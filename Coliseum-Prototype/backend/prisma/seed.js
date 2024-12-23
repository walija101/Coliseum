// prisma/seed.js
require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SERVICE_ROLE_KEY);

async function ensureUserInAuth(email, password, user_metadata) {
  // List all users from Supabase Auth
  const { data: userList, error: listError } = await supabase.auth.admin.listUsers();
  if (listError) {
    throw new Error('Error listing users from Supabase Auth: ' + listError.message);
  }

  const existingUser = userList.users.find(u => u.email === email);

  if (existingUser) {
    console.log(`User with email ${email} already exists in Supabase Auth. Skipping auth creation.`);
    return existingUser; // return the existing user
  }

  // Create new user with email confirmed
  const { data: newAuthUser, error: authError } = await supabase.auth.admin.createUser({
    email,
    password,
    user_metadata,
    email_confirm: true // Ensures the email is marked as confirmed
  });

  if (authError) {
    console.error('Error creating user in Supabase Auth:', authError);
    throw authError;
  }

  return newAuthUser.user;
}

async function ensureUserInDB(authUser, { firstName, lastName, maidenName, bday }) {
  const existing = await prisma.user.findUnique({
    where: { id: authUser.id }
  });

  if (existing) {
    console.log(`User ${authUser.email} already exists in local DB. Skipping DB creation.`);
    return existing;
  }

  const newUser = await prisma.user.create({
    data: {
      id: authUser.id,
      email: authUser.email,
      firstName: firstName,
      lastName: lastName,
      maidenName: maidenName || null,
      role: 'USER',
      bday: bday ? new Date(bday) : new Date('1990-01-01'),
      profile: {
        create: {
          images: [],
          gender: 'Undisclosed',
          sexuality: ['Male', 'Female'],
          hobbies: ['Reading'],
          height: 170,
          bday: bday ? new Date(bday) : new Date('1990-01-01'),
        },
      },
    },
  });

  return newUser;
}

async function createOrEnsureUser({ email, firstName, lastName, maidenName, bday }) {
  const password = 'password123'; // Known password for testing

  // Ensure user in Supabase Auth
  const authUser = await ensureUserInAuth(email, password, { firstName, lastName, maidenName });

  // Ensure user in local DB
  const dbUser = await ensureUserInDB(authUser, { firstName, lastName, maidenName, bday });
  return dbUser;
}

async function main() {
  const userA = await createOrEnsureUser({
    email: 'aliace@example.com',
    firstName: 'Alice',
    lastName: 'Anderson',
    bday: '1990-01-01'
  });

  const userB = await createOrEnsureUser({
    email: 'boab@example.com',
    firstName: 'Bob',
    lastName: 'Brown',
    bday: '1988-05-05'
  });

  const userC = await createOrEnsureUser({
    email: 'chaarlie@example.com',
    firstName: 'Charlie',
    lastName: 'Chaplin',
    bday: '1992-07-10'
  });

  // Make Alice and Bob friends
  await prisma.user.update({
    where: { id: userA.id },
    data: {
      friends: { connect: { id: userB.id } },
      seenUsers: { connect: { id: userB.id } },
    },
  });
  await prisma.user.update({
    where: { id: userB.id },
    data: {
      friends: { connect: { id: userA.id } },
      seenUsers: { connect: { id: userA.id } },
    },
  });

  // Check if a match between Alice and Charlie already exists
  const existingMatchAC = await prisma.match.findFirst({
    where: {
      OR: [
        { user1Id: userA.id, user2Id: userC.id },
        { user1Id: userC.id, user2Id: userA.id }
      ]
    }
  });

  let matchAC;
  if (!existingMatchAC) {
    // Create a match between Alice and Charlie if it doesn't exist
    matchAC = await prisma.match.create({
      data: {
        user1Id: userA.id,
        user2Id: userC.id,
        dateTime: new Date(),
      },
    });
  } else {
    console.log('Match between Alice and Charlie already exists, skipping creation.');
    matchAC = existingMatchAC;
  }

  // Approve match on both sides if not approved already
  const existingApprovalA = await prisma.approval.findFirst({
    where: {
      userId: userA.id,
      OR: [
        { matchingApprovalsid: matchAC.id },
        { matchedApprovalsid: matchAC.id }
      ]
    }
  });

  if (!existingApprovalA) {
    await prisma.approval.create({
      data: {
        userId: userA.id,
        approverId: userA.id,
        matchingApprovalsid: matchAC.id,
        dateTime: new Date(),
      },
    });
  } else {
    console.log('Alice approval for this match already exists, skipping.');
  }

  const existingApprovalC = await prisma.approval.findFirst({
    where: {
      userId: userC.id,
      OR: [
        { matchingApprovalsid: matchAC.id },
        { matchedApprovalsid: matchAC.id }
      ]
    }
  });

  if (!existingApprovalC) {
    await prisma.approval.create({
      data: {
        userId: userC.id,
        approverId: userC.id,
        matchedApprovalsid: matchAC.id,
        dateTime: new Date(),
      },
    });
  } else {
    console.log('Charlie approval for this match already exists, skipping.');
  }

  // Check if chat for this match already exists
  const existingChat = await prisma.chat.findFirst({
    where: { matchId: matchAC.id }
  });

  let mainChat;
  if (!existingChat) {
    mainChat = await prisma.chat.create({
      data: {
        matchId: matchAC.id,
        type: 'MAIN',
        readUsers: {
          connect: [{ id: userA.id }, { id: userC.id }],
        },
        writeUsers: {
          connect: [{ id: userA.id }, { id: userC.id }],
        },
      },
    });
  } else {
    console.log('Main chat for this match already exists, skipping creation.');
    mainChat = existingChat;
  }

  // Insert a couple of messages if none exist
  const existingMessages = await prisma.message.findMany({
    where: { chatId: mainChat.id }
  });

  if (existingMessages.length === 0) {
    await prisma.message.create({
      data: {
        userId: userA.id,
        chatId: mainChat.id,
        dateTime: new Date(Date.now() - 1000 * 60 * 5),
        content: "Hello, Charlie! How’s it going?",
      },
    });

    await prisma.message.create({
      data: {
        userId: userC.id,
        chatId: mainChat.id,
        dateTime: new Date(Date.now() - 1000 * 60 * 2),
        content: "Hi Alice! I’m doing well, thanks for asking!",
      },
    });
  } else {
    console.log('Messages for this chat already exist, skipping creation.');
  }

  console.log('Seeding completed successfully!');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });

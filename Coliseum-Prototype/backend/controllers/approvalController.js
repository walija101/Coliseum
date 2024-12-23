// controllers/approvalController.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function notifyFriends(userId, matchId) {
  const friends = await prisma.user.findMany({
    where: { id: userId },
    select: { friends: true },
  });

  friends.forEach(async friend => {
    const notification = await prisma.notification.create({
      data:{
        receivingUserId: friend.id,
        type: 'APPROVE',
        message: user.firstName + 'wants their match approved!',
        contentId: matchId
      }
    })
  });
}

//better to make two different functions to check which user is related to in frontend
//maybe we need to check for if people have friends in common?
async function approveMatchSenderSide(req, res){
  const {matchId, approverId, matchUserId} = req.body

  const match = await prisma.match.findUnique({
    where: {id: matchId}
  })

  const approval = await prisma.approval.create({
    where:{
      userId: matchUserId,
      approverId: approverId,
      matchingApprovalsId: matchId
    }
  })

  if (match.user1Approvals.length > 0 && match.user2Approvals.length > 0){
    return res.status(200).json({message:' chat created here'})
  }

  res.status(200).json({message: 'approval counted'})

}

async function approveMatchReceiverSide(req, res){
  const {matchId, approverId, matchUserId} = req.body

  const approval = await prisma.approval.create({
    where:{
      userId: matchUserId,
      approverId: approverId,
      matchingApprovalsId: matchId
    }
  })

  //after making approval, get match to check 
  const match = await prisma.match.findUnique({
    where: {id: matchId},
    include: {user1Approvals: true, user2Approvals: true}
  })

  if (match.user1Approvals.length > 0 && match.user2Approvals.length > 0){
    return res.status(200).json({message:' chat created here'})
  }

  res.status(200).json({message: 'approval counted'})
}

async function approveMatch(req, res) {
  const userId = req.user.id;
  const { matchId, notificationId, sendingUserId } = req.body;

  console.log('Approving match', matchId, 'from user', sendingUserId);

  // SET AS 1 FOR TEST PURPOSES
  const approvalsNeeded = 1;

  try {
    // find the match by its id
    const match = await prisma.match.findUnique({
      where: { id: matchId },
      include: { 
        user1Approvals: true, 
        user2Approvals: true 
      },
    });

    if (!match) {
      return res.status(404).json({ message: 'Match not found' });
    }

    // see which user in the match is the sending user
    // if the sending user is user1, create an approval for user1
    // if the sending user is user2, create an approval for user2
    if (match.user1Id === sendingUserId) {
      await prisma.approval.create({
        data: {
          userId: match.user1Id,
          approverId: userId,
          matchingApprovalsid: matchId,
          dateTime: new Date(),
        },
      });
    } else if (match.user2Id === sendingUserId) {
      await prisma.approval.create({
        data: {
          userId: match.user2Id,
          approverId: userId,
          matchedApprovalsid: matchId,
          dateTime: new Date(),
        },
      });
    } else {
      return res.status(403).json({ message: 'Not authorized to approve this match' });
    }

    // Get the updated match with the approvals
    const updatedMatch = await prisma.match.findUnique({
      where: { id: matchId },
      include: { user1Approvals: true, user2Approvals: true },
    });

    // Find and delete all notifications with similar user1 and user2
    await prisma.notification.deleteMany({
      where: {
        OR: [
          { receivingUserId: userId, sendingUserId: sendingUserId },
          { receivingUserId: sendingUserId, sendingUserId: userId }
        ]
      }
    });

    // If both set of friends for each have approved the match, create chats for the match
    if (updatedMatch.user1Approvals.length >= approvalsNeeded && updatedMatch.user2Approvals.length >= approvalsNeeded) {
      await createChatsForMatch(matchId);

      console.log(`Match ${matchId} approved and chats created`);
      return res.json({ message: 'Match approved and chats created' });
    }

    res.json({ message: 'Match approved' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function denyMatch(req, res) {
  const userId = req.user.id;
  const { matchId, notificationId, sendingUserId } = req.body;

  try {
    const match = await prisma.match.findUnique({
      where: { id: matchId },
    });

    if (!match) {
      return res.status(404).json({ message: 'Match not found' });
    }

    // Log the denial without deleting the match or taking any other action
    console.log(`User ${userId} denied match ${matchId}`);

    // Delete the notification
    await prisma.notification.delete({
      where: { id: notificationId },
    });

    res.json({ message: 'Match denied' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function createChatsForMatch(matchId) {
  // find the match by its Id
  const match = await prisma.match.findUnique({
    where: { id: matchId },
  });

  // find all friends of user1 and user2
  const user1Friends = await prisma.user.findMany({
    where: { friends: { some: { id: match.user1Id } } },
  });

  const user2Friends = await prisma.user.findMany({
    where: { friends: { some: { id: match.user2Id } } },
  });

  // create a main chat for the match with all friends of user1 and user2
  await prisma.chat.create({
    data: {
      matchId,
      type: 'MAIN',
      readUsers: {
        connect: [
          ...user1Friends.map(friend => ({ id: friend.id })),
          ...user2Friends.map(friend => ({ id: friend.id })),
        ],
      },
      writeUsers: {
        connect: [
          { id: match.user1Id },
          { id: match.user2Id },
        ],
      },
    },
  });

  // create a side chat for user1 and their friends
  await prisma.chat.create({
    data: {
      matchId,
      type: 'SIDE1',
      writeUsers: {
        connect: [
          { id: match.user1Id },
          ...user1Friends.map(friend => ({ id: friend.id })),
        ],
      },
    },
  });

  // create a side chat for user2 and their friends
  await prisma.chat.create({
    data: {
      matchId,
      type: 'SIDE2',
      writeUsers: {
        connect: [
          { id: match.user2Id },
          ...user2Friends.map(friend => ({ id: friend.id })),
        ],
      },
    },
  });

  // TESTING PURPOSES
  try {
    const chats = await prisma.chat.findMany({
      include: {
        readUsers: {
          select: { firstName: true }
        },
        writeUsers: {
          select: { firstName: true }
        }
      }
    });

    const formattedChats = chats.map(chat => ({
      chatId: chat.id,
      type: chat.type,
      readUsers: chat.readUsers.map(user => user.firstName),
      writeUsers: chat.writeUsers.map(user => user.firstName)
    }));

    console.log(formattedChats);
  } catch(error) {
    console.error('Error fetching chats:', error);
  }
}

module.exports = { createChatsForMatch, approveMatch, denyMatch, approveMatchSenderSide, approveMatchReceiverSide, notifyFriends };

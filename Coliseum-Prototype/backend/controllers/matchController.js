// controllers/matchController.js
const { makeNotification } = require('./notification');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function swipeUser(req, res) {
  const { swipedUserId, direction } = req.body;
  const userId = req.user.id;

  // Let both users be seen
  await prisma.user.update({
    where:{id: userId},
    data:{
      seenUsers:{
        connect: {id: swipedUserId}
      },
    },
  });

  await prisma.user.update({
    where: {id : swipedUserId},
    data:{
      seenUsers:{
        connect: {id: userId}
      },
    },
  });

  if (direction === 'right') {
    // Check if a match already exists
    const existingMatch = await prisma.match.findFirst({
      where: {
        OR: [
          { user1Id: userId, user2Id: swipedUserId },
          { user1Id: swipedUserId, user2Id: userId },
        ],
      },
    });

    if (!existingMatch) {
      // Create a new match if none exists
      await prisma.match.create({
        data: { 
          user1: { connect: { id: userId } },
          user2: { connect: { id: swipedUserId } },
          dateTime: new Date(),
        },
      });
      res.json({ message: 'Swiper recorded' });
    } else {
      // If match exists, send approval request to friends
      await notifyFriends(userId, existingMatch.id);
      await notifyFriends(swipedUserId, existingMatch.id);
      res.json({ message: 'It’s a match! Approval requests sent to friends' });
    }
  } else {
    res.json({ message: 'No match action taken' });
  }
}

async function notifyFriends(userId, matchId) {
  // get the user who swiped
  const user = await prisma.user.findUnique({
    where: { id: userId }
  });

  // get the friends of the user who swiped
  const friends = await prisma.user.findMany({
    where: { friends: { some: { id: userId } } },
  });

  // send a notification to each friend requesting approval for the match
  for (const friend of friends) {
    await makeNotification(friend.id, userId, 'APPROVE', `${user.firstName} wants their match approved!`, matchId);
  }
}

async function getUncompletedMatches(req, res) {
  const userId = req.user.id;
  const matches = await prisma.match.findMany({
    where: { OR: [{ user1Id: userId }, { user2Id: userId }], chats: {none: {}} },
    include: { user1: true, user2: true },
  });
  res.json(matches);
}

async function findNewUsers(req, res){
  const {userId} = req.body;

  const userProfile = await prisma.profile.findUnique({
    where:{
      userId: userId
    }
  })

  const notFind = await prisma.user.findFirst({
    where: {
      id: userId
    },
    select: {
      seenUsers: true, friends: true
    }
  })

  const newMatches = await prisma.profile.findMany({
    take: 5,
    where:{
      hobbies: {hasSome: user.interests},
      interests: {hasSome: user.interests},
      gender: {hasSome: userProfile.sexuality},
      userId: {notIn: notFind.seenUsers},
      NOT:{
        user:{
          hasSome: notFind.friends
        }
      }
    },
    select: {
      id: true
    }
  })

  res.status(200).json({message:'approvals found', newUsers: newMatches})
}

async function getUserMatches(req, res) {
  const userId = req.user.id;

  try {
    const matches = await prisma.match.findMany({
      where: {
        OR: [
          { user1Id: userId },
          { user2Id: userId },
          {
            chats: {
              some: {
                OR: [
                  { readUsers: { some: { id: userId } } },
                  { writeUsers: { some: { id: userId } } }
                ]
              }
            }
          }
        ],
      },
      include: {
        user1: true,
        user2: true,
        chats: {
          include: {
            readUsers: {
              select: { 
                firstName: true,
                id: true,
              }
            },
            writeUsers: {
              select: { 
                firstName: true,
                id: true, 
              }
            },
            messages: true  // ensure messages are fetched if needed
          }
        },
      },
    });

    res.json(matches);
  } catch (error) {
    console.error('Error in getUserMatches:', error);
    res.status(500).json({ message: error.message });
  }
}


// New endpoint: minimal list of matchIds for the authenticated user
async function getUserMatchIds(req, res) {
  const userId = req.user.id;

  try {
    const matches = await prisma.match.findMany({
      where: {
        OR: [
          { user1Id: userId },
          { user2Id: userId },
        ],
      },
      select: {
        id: true
      }
    });

    res.json(matches); // returns [{id: 1}, {id: 2}, ...]
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function getMatchById(req, res) {
  const { matchId } = req.params;

  try {
    // Find the match by ID and include the users and chats
    const match = await prisma.match.findUnique({
      where: { id: parseInt(matchId) },
      include: { user1: true, user2: true, chats: true },
    });

    if (!match) {
      return res.status(404).json({ message: 'Match not found' });
    }

    res.status(201).json(match);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function getFullMatchByIdForUser(req, res) {
  const userId = req.user.id;
  const { matchId } = req.params;

  const numericMatchId = parseInt(matchId, 10);
  if (isNaN(numericMatchId)) {
    return res.status(400).json({ message: 'Invalid match ID' });
  }

  try {
    // Find the single match along with all chats and messages
    const match = await prisma.match.findUnique({
      where: { id: numericMatchId },
      include: {
        user1: true,
        user2: true,
        chats: {
          include: {
            messages: true,
            readUsers: { select: { id: true, firstName: true } },
            writeUsers: { select: { id: true, firstName: true } }
          }
        },
      },
    });

    if (!match) {
      return res.status(404).json({ message: 'Match not found' });
    }

    // Check if the user has any right to view this match:
    const isParticipant = (match.user1Id === userId || match.user2Id === userId);
    const userInChats = match.chats.some(chat =>
      chat.readUsers.some(u => u.id === userId) || chat.writeUsers.some(u => u.id === userId)
    );

    if (!isParticipant && !userInChats) {
      return res.status(403).json({ message: 'Not authorized to view this match data' });
    }

    res.json(match);
  } catch (error) {
    console.error('Error in getFullMatchByIdForUser:', error);
    res.status(500).json({ message: error.message });
  }
}

module.exports = { getMatchById, getUserMatches, swipeUser, notifyFriends, getUncompletedMatches, findNewUsers, getUserMatchIds, getFullMatchByIdForUser };

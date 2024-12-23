// controllers/friendController.js
const { makeNotification } = require('./notification')
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function sendFriendRequest(req, res){
  const userId = req.user.id;
  const { friendId } = req.body;

  console.log(`${userId} sending friend request to ${friendId}`);

  try {
    const check = await prisma.friendRequest.findFirst({
      where: {
        sendingUserId: userId,
        receivingUserId: friendId
      }
    })

    if (check) {
      return res.status(400).json({ message: 'Friend request already sent' });
    }

    const newRequest = await prisma.friendRequest.create({
      data: {
          sendingUserId: userId,
          receivingUserId: friendId
      },
    });

    const sendingUser = await prisma.user.findUnique({
      where:{
        id: userId
      }
    })

    // no link - only accept or decline, but that can be coded in?
    await makeNotification(friendId, userId, 'FRIEND', `${sendingUser.firstName} has sent you a friend request!`, newRequest.id);

    res.status(200).json({ message: 'Friend request successfully created' });
  } catch(error) {
      console.log(error);
      res.status(400).json({ message: error.message })
  }
}

async function addFriend(req, res) {
  const userId = req.user.id;
  const { friendId, notificationId } = req.body;

  console.log(`${userId} adding ${friendId}, notificationId: ${notificationId}`);

  try{
    // Find the friend requestconnected to the notification
    const friendRequest = await prisma.friendRequest.findFirst({
      where:{
        sendingUserId: friendId,
        receivingUserId: userId,
      },
    });

    if (!friendRequest) {
      return res.status(404).json({ message: 'Friend request not found' });
    }

    // Update the sending user's friends list
    await prisma.user.update({
      where: { id: friendId },
      data: {
          friends: {
              connect: { id: userId },
          },
          seenUsers: {
              connect: { id: userId },
          },
      },
  });

  // Update the receiving user's friends list
  await prisma.user.update({
      where: { id: userId },
      data: {
          friends: {
              connect: { id: friendId },
          },
          seenUsers: {
              connect: { id: friendId },
          },
      },
  });

  // Delete the friend request
  await prisma.friendRequest.delete({
      where: { id: friendRequest.id },
  });

  // Delete the notification
  await prisma.notification.delete({
    where: { id: notificationId },
  });

  // check and delete the notification from the person who initially sent the friend request, in case i sent them one too
  const otherNotification = await prisma.notification.findFirst({
    where: {
      sendingUserId: userId,
      receivingUserId: sendingUserId,
      type: 'FRIEND',
    },
  });

  if (otherNotification) {
    await prisma.notification.delete({
      where: { id: otherNotification.id },
    });
  }

  res.status(200).json({message: 'Friend request cleared'});
  } catch(error) {
    res.status(400).json({message: error.message});
  }
}

async function declineFriend(req, res){
  const userId = req.user.id;
  const {friendId, notificationId} = req.body;

  console.log(`${userId} rejecting request from ${friendId}, notificationId ${notificationId}`);
  
  try{
    // Find the friend request
    const friendRequest = await prisma.friendRequest.findFirst({
      where: {
        sendingUserId: friendId,
        receivingUserId: userId,
      },
    });

    if (!friendRequest) {
      return res.status(404).json({ message: 'Friend request not found' });
    }

    // Delete the friend request
    await prisma.friendRequest.delete({
      where: { id: friendRequest.id },
    });

    // Delete the notification
    await prisma.notification.delete({
      where: { id: notificationId },
    });

    res.status(200).json({ message: 'Friend request declined' });
  } catch(error){
    res.status(400).json({message: error.message})
  }
}

async function viewAllFriendRequests(req, res){
  const {userId} = req.body

  try{
    const requests = await prisma.friendRequest.findMany({
      where:{
        receivingUserId: userId
      }
    })

    res.status(200).json({message: 'Retrieved all friend requests successfully.', requests: requests})
  } catch(error) {
    res.status(400).json({message: error.message})
  }
}

async function getFriends(req, res){
  const userId = req.body
  try{
    const friends = await prisma.user.findFirst({
      where:{
        id: userId
      },
      include:{
        friends: true
      }
    })
    res.status(200).json({message: 'Retrieved friends successfully.', friends: friends})
  } catch(error){
    res.status(400).json({message: error.message})
  }
}

async function deleteFriend(req, res) {
  const userId = req.user.id;
  const { friendId } = req.body;

  console.log(`deleteFriend called with userId: ${userId} and friendId: ${friendId}`);

  try {
    // Update the sending user's friends list
    await prisma.user.update({
      where: { id: userId },
      data: {
        friends: {
          disconnect: { id: friendId },
        },
      },
    });

    // Update the receiving user's friends list
    await prisma.user.update({
      where: { id: friendId },
      data: {
        friends: {
          disconnect: { id: userId },
        },
      },
    });

    res.status(200).json({ message: 'Friend deleted successfully' });
  } catch (error) {
    console.error('Error in deleteFriend:', error);
    res.status(500).json({ message: error.message });
  }
}

module.exports = { addFriend, deleteFriend, sendFriendRequest, declineFriend, viewAllFriendRequests, getFriends };
  
// controllers/userController.js
const { PrismaClient } = require('@prisma/client');
const {makeNotification} = require('./notification');
const prisma = new PrismaClient();

// Get User Profile
async function getProfile(req, res) {

    const id  = req.user.id;

    if (!id) {
        return res.status(400).json({ error: "User ID is missing" });
    }

    try {
        const profile = await prisma.profile.findUnique({
            where: { userId: id },
            include: { user: true },
        });

        if (!profile) {
            return res.status(200).json({ message: "Profile not found" });
        }

        res.json(profile);
    } catch (error) {
        res.status(500).json({ error: error.message });
  }
}

// get specific user profile
async function getUserProfile(req, res) {

    const { userId } = req.body;

    if (!userId) {
        return res.status(400).json({ error: "User ID is missing" });
    }

    try {
        const profile = await prisma.profile.findUnique({
            where: { userId: userId },
            include: { user: true },
        });

        if (!profile) {
            return res.status(200).json({ message: "Profile not found" });
        }

        res.json(profile);
    } catch (error) {
        res.status(500).json({ error: error.message });
  }
}

// Update User Profile
async function updateProfile(req, res) {
  const id = req.user.id;
  const { 
    images, 
    gender, 
    sexuality,
    hobbies,
    bday,
    height
  } = req.body;

  try {
      const updatedProfile = await prisma.profile.update({
          where: { userId: id },
          data: { 
            images, 
            gender, 
            sexuality,
            hobbies,
            bday: new Date(bday),
            height
          },
      });
      res.json(updatedProfile);
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
}

async function getUser(req, res){
  const id = req.user.id;

  try {
      const user = await prisma.user.findFirst({
          where: { id: id },
          include: { friends: true, banRequest: true }
      });
    
      if (!user){
        res.status(404).json({ error: "User not found" });
      } else{
        res.status(200).json(user);
      }
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
}

async function createProfile(req, res){
  const id = req.user.id;
  const { 
    images, 
    gender, 
    sexuality,
    hobbies,
    bday,
    height
   } = req.body;

  try {
      const newProfile = await prisma.profile.create({
          data: {
              userId: id,
              images, 
              gender, 
              sexuality,
              hobbies,
              bday: new Date(bday),
              height
          },
      });
      res.status(201).json(newProfile);
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
}

async function getBlockedUsers(req, res){
    const id = req.user.id;
    try {
        const blockedUsers = await prisma.user.findUnique({
            where: {
                userId: id
            },
            include: {
                blocked: true
            }
        });
        res.json(blockedUsers);
    }
    catch(error) {
        res.status(500).json({ error: error.message });
    }
}

async function blockUser(req, res){
    const {id, toBlock} = req.body;

    try {
        const blockedUser = await prisma.user.update({
            where: {
                userId: id
            },
            data: {
                blocked: {
                    connect: {
                        userId: toBlock
                    }
                }
            }
        });
        res.json(blockedUser);
    }
    catch(error) {
        res.status(500).json({ error: error.message });
    }
}

async function createBlockRequest(req, res){
    const {id, toBlock, type} = req.body;
    try{
        const newBlockRequest = await prisma.blockRequest.create({
            data: {
                fromId: id,
                toId: toBlock,
                type: type // can either be block or unblock
            }
        });

        const user = await prisma.user.findUnique({
            where: {
                userId: id
            },
            include: {
                friends: true
            }
        });

        // send notification to all friends

        for(let i = 0; i < user.friends.length; i++){
            await makeNotification(user.friends[i].userId, "blockRequest", "You have a new block request", newBlockRequest.id);
        }
    }
    catch(error){
        res.status(500).json({ error: error.message });
    }
}

async function acceptBlockRequest(req, res){
    const {id, requestId} = req.body;

    try{
        const blockRequest = await prisma.blockRequest.findFirst({
            where: {
                id: requestId
            },
            include: {
                approvals: true, //get approvals to check length
                toBlock: true,
                creator: true,
                type: true
            }
        })

        const del = await prisma.blockRequest.delete({
            where: {
                id: requestId
            }
        })

        if (blockRequest.approvals.length === 2){
            // request approved after some arbitrary number of friends approve
            if (blockRequest.type  === "BLOCK"){
                // for block-type requests
                const cur = await prisma.user.update({
                    where:{
                        id: blockRequest.creator.id
                    },
                    data: {
                        blocked: {
                            connect: {
                                userId: blockRequest.toBlock.toBlockId
                            }
                        }
                    }
                })
                return res.status(201).json({ message: 'blocked user properly' });
            }
            else{
                //for unblokc-type requests
                const cur = await prisma.user.update({
                    where:{
                        id: blockRequest.creator.id
                    },
                    data: {
                        blocked: {
                            disconnect: {
                                userId: blockRequest.toBlock.toBlockId
                            }
                        }
                    }
                })
                return res.status(201).json({ message: 'unblocked user properly' });

            }
        }
    }

    catch(error){
        res.status(500).json({ error: error.message });
    }

}

// Get All users
async function getAllUsers(req, res) {
    // get the current user's Id
    const userId = req.user.id;

    try {
        // get the current user's friends
        const user = await prisma.user.findUnique({
            where: { id: userId },
            include: { friends: true },
        });

        const friendIds = user.friends ? user.friends.map(friend => friend.id) : [];

        const users = await prisma.user.findMany({
            where: {
                id: {
                    notIn: [userId, ...friendIds], 
                },
            },
            select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
            },
        });
        res.json(users);
    } catch(error) {
        console.log(error);
        res.status(500).json({ error: error.message });
    }
}

// Get All Users with Profiles
async function getAllUsersWithProfiles(req, res) {
    try {
        const users = await prisma.user.findMany({
            include: {
                profile: true,
            },
        });
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

//declining a block request doesn't need a function to be created
module.exports = { getUserProfile, getAllUsersWithProfiles, getAllUsers, getProfile, updateProfile, getUser, createProfile, acceptBlockRequest, createBlockRequest, getBlockedUsers, blockUser };

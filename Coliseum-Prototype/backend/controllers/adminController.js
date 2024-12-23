const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

//need to create prisma items for these
async function viewAllRequests(req, res){

    const allRequests = await prisma.banRequest.findAll({})

    return json.status(200).response({message: 'all requests retrieved', requests: allRequests})
}

async function approveRequest(req, res){
    const {requestId} = req.body;

    const banRequest = await prisma.banRequest.findFirst({
        where: {
            id: requestId
        },
        include:{
            userId: true,
            reason: true,
            messageId: true,
            proposedTime: true
        }
    })

    const user = await prisma.user.update({
        where: {
            id: banRequest.userId
        },
        data: {
            bannedUntil: banRequest.proposedTime
        }
    })

}

async function declineRequest(req, res){
    const {requestId} = req.body

    const remove = prisma.banRequest.remove({
        where:{
            id: requestId
        }
    })

}


async function banUser(req, res){
    const {userId, toBanId, re} = req.body
    const admin = await prisma.user.findFirst({
        where: {
            id: userId
        }
    })

    if (admin.role !== 'ADMIN'){
        return res.status(500).json({message: 'Something went wrong'})
    }

    const banUser = await prisma.user.update({
        where: {
            id: toBanId
        },
        data: {
            bannedUntil: new Date()
        }
    })
}
 
module.exports = {declineRequest, approveRequest, viewAllRequests, banUser}
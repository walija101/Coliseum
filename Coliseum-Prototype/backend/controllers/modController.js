const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function createRequest(req, res){
    const {userId, bannedUntil, messageId, reason} = req.body;

    //code in constraints to not allow for submission of warnings with proposed time
    try{
        const newRequest = await prisma.banRequest.create({
            userId: userId,
            bannedUntil: bannedUntil,
            messageId: messageId,
            reason: reason
    
        });

        res.status(200).json({message:'ban request created'});
    }

    catch(error){
        res.status(400).json({message:'error: ' + message.error});
    }

}

async function createWarning(req, res){
    const {userId, reason, messageId} = req.body;

    try{
        const newWarning = await prisma.warning.create({
            userId: userId,
            reason: reason,
            messageId: messageId
        });
    
        res.status(200).json({message: 'warning sent', warning: newWarning});
    
    }
    catch(error){
        res.status(400).json({message:'error: ' + message.error});
    }
}

//need websockets for this someone else do it (or i can do it later)
async function waitForChat(){

}

module.exports = { createRequest, createWarning, waitForChat }
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function makeNotification(receivingUserId, sendingUserId, type, message, link){
    try {
        const newNotif = await prisma.notification.create({
            data: {
                receivingUserId: receivingUserId,
                sendingUserId: sendingUserId,
                type: type,
                message: message,
                content: link,
            },
        });
        console.log('Notification created:', newNotif);
    } catch (error) {
        console.error('Error creating notification:', error.message);
    }
}

async function seenNotification(req, res){
    const { notifId } = req.body

    try{
        await prisma.notification.delete({
            where: {id: notifId}
        });
        res.status(200).json({ message: 'Notification marked as seen' });
    } catch(error){
        res.status(400).json({ message: 'Error marking notification as seen' });
    }
}

async function getNotifications(req, res) {
    const userId = req.user.id;

    try {
        const notifications = await prisma.notification.findMany({
            where: {
                receivingUserId: userId,
            },
        });
        res.status(200).json({ message: 'Notifications retrieved successfully', notifications });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

module.exports = {getNotifications, makeNotification, seenNotification}
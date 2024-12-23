// controllers/chatController.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const supabase = require('../supabaseClient');

async function createChat(req, res) {
  const { matchId } = req.body;
  const match = await prisma.match.findUnique({ where: { id: matchId } });

  if (!match) {
    return res.status(404).json({ message: 'Match not found' });
  }

  // Check status if needed
  if (match.status !== 'approved') {
    return res.status(400).json({ message: 'Match not approved yet' });
  }

  const chat = await prisma.chat.create({
    data: {
      matchId,
      users: { connect: [{ id: match.user1Id }, { id: match.user2Id }] },
    },
  });
  res.json(chat);
}

async function viewChat(req, res) {
  const { chatId } = req.params;
  const userId = req.user.id;

  const numericChatId = parseInt(chatId, 10);
  if (isNaN(numericChatId)) {
    return res.status(400).json({ message: 'Invalid chat ID format' });
  }

  const chat = await prisma.chat.findUnique({
    where: { id: numericChatId },
    include: {
      messages: true,
      readUsers: true,   // Ensure these fields are fetched
      writeUsers: true
    },
  });

  if (!chat) {
    return res.status(404).json({ message: 'Chat not found' });
  }

  const isReadUser = chat.readUsers.some(user => user.id === userId);
  const isWriteUser = chat.writeUsers.some(user => user.id === userId);

  if (!isReadUser && !isWriteUser) {
    return res.status(403).json({ message: 'Not authorized to view this chat' });
  }

  res.json(chat);
}

async function sendMessage(req, res) {
  const { chatId, content } = req.body;
  const userId = req.user.id;

  const numericChatId = parseInt(chatId, 10);
  if (isNaN(numericChatId)) {
    return res.status(400).json({ message: 'Invalid chat ID format' });
  }

  const chat = await prisma.chat.findUnique({
    where: { id: numericChatId },
    include: { writeUsers: true },
  });

  if (!chat) {
    return res.status(404).json({ message: 'Chat not found' });
  }

  const isWriteUser = chat.writeUsers.some(user => user.id === userId);

  if (!isWriteUser) {
    return res.status(403).json({ message: 'Not authorized to send messages in this chat' });
  }

  const message = await prisma.message.create({
    data: {
      chatId: numericChatId,
      userId,
      content,
      dateTime: new Date(),
    },
  });

  await supabase
    .from('Message')
    .insert([{ chatId: numericChatId, userId, content, dateTime: new Date() }]);

  res.json(message);
}

async function getChatsByMatchIds(req, res) {
  const { matchIds } = req.body; // { matchIds: [1,2,3] }

  if (!Array.isArray(matchIds) || matchIds.length === 0) {
    return res.status(400).json({ message: 'matchIds must be a non-empty array' });
  }

  try {
    const chats = await prisma.chat.findMany({
      where: {
        matchId: { in: matchIds }
      },
      include: { messages: true }
    });

    res.json(chats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function getFullChatById(req, res) {
  const userId = req.user.id;
  const { chatId } = req.params;

  const numericChatId = parseInt(chatId, 10);
  if (isNaN(numericChatId)) {
    return res.status(400).json({ message: 'Invalid chat ID format' });
  }

  try {
    const chat = await prisma.chat.findUnique({
      where: { id: numericChatId },
      include: {
        messages: true,
        readUsers: { select: { id: true, firstName: true } },
        writeUsers: { select: { id: true, firstName: true } },
        match: {
          include: {
            user1: true,
            user2: true,
            chats: {
              include: {
                messages: true,
                readUsers: { select: { id: true, firstName: true } },
                writeUsers: { select: { id: true, firstName: true } }
              }
            }
          }
        }
      }
    });

    if (!chat) {
      return res.status(404).json({ message: 'Chat not found' });
    }

    // Authorization check
    const isReadUser = chat.readUsers.some(u => u.id === userId);
    const isWriteUser = chat.writeUsers.some(u => u.id === userId);
    const isUser1OrUser2 = chat.match && (chat.match.user1Id === userId || chat.match.user2Id === userId);

    if (!isReadUser && !isWriteUser && !isUser1OrUser2) {
      return res.status(403).json({ message: 'Not authorized to view this chat' });
    }

    let mainChatId = null;
    let sideChatId = null;

    if (chat.match && chat.match.chats) {
      const isUser1 = chat.match.user1Id === userId;
      const mainChat = chat.match.chats.find(c => c.type === 'MAIN') || null;
      const sideType = isUser1 ? 'SIDE1' : 'SIDE2';
      const sideChat = chat.match.chats.find(c => c.type === sideType) || null;

      mainChatId = mainChat ? mainChat.id : null;
      sideChatId = sideChat ? sideChat.id : null;
    }

    // Return the chat data plus the identified main and side chat IDs
    res.json({
      chat,
      mainChatId,
      sideChatId
    });
  } catch (error) {
    console.error('Error in getFullChatById:', error);
    res.status(500).json({ message: error.message });
  }
}


module.exports = { createChat, viewChat, sendMessage, getChatsByMatchIds, getFullChatById };

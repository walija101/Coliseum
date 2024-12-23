// src/components/Chat.jsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { viewChat, sendMessage } from '../api/apiService';
import { useAuth } from '../contexts/AuthContext';
import { useSwipeable } from 'react-swipeable';
import ChatInstance from "./ChatInstance";
import profilePicture from "../assets/profilePicture.jpg";

function Chat() {
  const { chatId } = useParams();
  const { userId } = useAuth();

  const [mainChat, setMainChat] = useState(null);
  const [sideChat, setSideChat] = useState(null);
  const [currentMatch, setCurrentMatch] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [activeChat, setActiveChat] = useState('FRIEND'); 
  const [isLoading, setIsLoading] = useState(true);

  const handlers = useSwipeable({
    onSwipedLeft: () => setActiveChat('MATCH'),
    onSwipedRight: () => setActiveChat('FRIEND'),
    trackMouse: true
  });

  useEffect(() => {
    if (!userId || !chatId) {
      setLoading(false);
      return;
    }

    async function fetchData() {
      try {
        const { chat, mainChatId, sideChatId } = await viewChat(chatId);

        if (!chat.match) {
          console.warn("Chat has no associated match. Display only this chat.");
          // Just show this one chat
          setMainChat(chat.type === 'MAIN' ? chat : null);
          setSideChat(chat.type !== 'MAIN' ? chat : null);
          setLoading(false);
          return;
        }

        setCurrentMatch(chat.match);

        const main = mainChatId ? chat.match.chats.find(c => c.id === mainChatId) : null;
        const side = sideChatId ? chat.match.chats.find(c => c.id === sideChatId) : null;

        setMainChat(main || null);
        setSideChat(side || null);
        setLoading(false);

      } catch (err) {
        console.error('Error fetching chat data:', err);
        setError('Failed to load chat.');
        setLoading(false);
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, [userId, chatId]);

  const transformMessages = (chat) => {
    if (!chat || !chat.messages) return [];
    const sorted = [...chat.messages].sort((a,b) => new Date(b.dateTime) - new Date(a.dateTime));
    return sorted.map(msg => {
      const isFromUser = msg.userId === userId;
      const time = new Date(msg.dateTime).toLocaleString();
      return {
        isFromUser,
        relationship: chat.type === 'MAIN' ? 'MATCH' : 'FRIEND',
        img: profilePicture,
        fullName: isFromUser ? "Me" : "Other User",
        time,
        textContent: msg.content
      };
    });
  };

  const handleSendMessage = async (targetChatId, message) => {
    if (!targetChatId) return;

    try {
      await sendMessage(targetChatId, message);
      const newMsg = {
        userId,
        content: message,
        dateTime: new Date().toISOString()
      };

      // Update the state of whichever chat was targeted
      if (mainChat && mainChat.id === targetChatId) {
        setMainChat(prev => prev ? { ...prev, messages: [...(prev.messages || []), newMsg] } : prev);
      }
      if (sideChat && sideChat.id === targetChatId) {
        setSideChat(prev => prev ? { ...prev, messages: [...(prev.messages || []), newMsg] } : prev);
      }

    } catch (err) {
      console.error('Error sending message:', err);
      setError('Failed to send message.');
    }
  };

  if (error) {
    return <div className="p-4 text-red-500">{error}</div>;
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-t-transparent border-r-iconRed border-b-iconRed border-l-iconRed"></div>
      </div>
    );
  }

  if (!mainChat && !sideChat) {
    return <div className="p-4">No chats available for this match.</div>;
  }

  let mainFullName = '';
  if (currentMatch && mainChat && mainChat.type === 'MAIN') {
    const isUser1 = currentMatch.user1Id === userId;
    const otherUser = isUser1 ? currentMatch.user2 : currentMatch.user1;
    mainFullName = otherUser 
      ? ((otherUser.firstName || '') + ' ' + (otherUser.lastName || '')).trim() || 'Unknown User'
      : 'Unknown User';
  }

  const mainMessages = transformMessages(mainChat);
  const sideMessages = transformMessages(sideChat);

  return (
    <div className="flex flex-col h-full justify-between" {...handlers}>
      {/* On large screens: show both chats side by side */}
      <div className="hidden lg:flex gap-2 h-full p-2">
        {sideChat && (
          <ChatInstance
            chatId={sideChat.id}
            relationship="FRIEND" 
            textInstances={sideMessages}
            onSendMessage={handleSendMessage}
          />
        )}
        {mainChat && (
          <ChatInstance
            chatId={mainChat.id}
            relationship="MATCH" 
            textInstances={mainMessages} 
            onSendMessage={handleSendMessage}
            fullName={mainFullName}
          />
        )}
      </div>

      {/* On smaller screens: swipe between FRIEND and MATCH */}
      <div className="lg:hidden h-full overflow relative p-2">
        {sideChat && (
          <div className={`transition-transform duration-300 h-full ${activeChat === 'MATCH' ? '-translate-x-full' : 'translate-x-0'}`}>
            <ChatInstance 
              chatId={sideChat.id}
              relationship="FRIEND" 
              textInstances={sideMessages}
              onSendMessage={handleSendMessage}
            />
          </div>
        )}
        {mainChat && (
          <div className={`absolute top-0 w-full h-full transition-transform duration-300 ${activeChat === 'MATCH' ? 'translate-x-0' : 'translate-x-full'}`}>
            <ChatInstance 
              chatId={mainChat.id}
              relationship="MATCH" 
              textInstances={mainMessages}
              onSendMessage={handleSendMessage}
              fullName={mainFullName}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default Chat;

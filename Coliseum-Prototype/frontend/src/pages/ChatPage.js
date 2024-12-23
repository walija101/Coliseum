// src/pages/ChatPage.js
import React from 'react';
import { useParams } from 'react-router-dom';
import ChatView from '../components/ChatView';

const ChatPage = () => {
  const { chatId } = useParams();

  return (
    <div>
      <h2>Chat</h2>
      <ChatView chatId={chatId} />
    </div>
  );
};

export default ChatPage;

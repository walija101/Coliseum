// src/components/ChatView.js
import React, { useEffect, useState } from 'react';
import { viewChat } from '../api/apiService';
import supabase from '../supabaseClient';

const ChatView = ({ chatId }) => {
  const [chat, setChat] = useState(null);

  useEffect(() => {
    const fetchChat = async () => {
      const data = await viewChat(chatId);
      setChat(data);
    };
    fetchChat();;

    const subscription = supabase
      .from(`Message:chatId=eq.${chatId}`)
      .on('INSERT', payload => {
        setChat(prevChat => ({
          ...prevChat,
          messages: [...prevChat.messages, payload.new],
        }));
      })
      .subscribe();

    return () => {
      supabase.removeSubscription(subscription);
    };

  }, [chatId]);

  return (
    <div>
      <h2>Chat</h2>
      {chat?.messages.map(message => (
        <p key={message.id}>{message.content}</p>
      ))}
    </div>
  );
};

export default ChatView;

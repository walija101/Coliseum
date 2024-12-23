import React, { useEffect, useState } from 'react';
import MessageInstance from "./MessageInstance";
import { getUserMatches } from "../api/apiService";
import profilePicture from "../assets/profilePicture.jpg";
import { useAuth } from "../contexts/AuthContext";

function Messages() {
  const { userId } = useAuth(); 
  const [combinedData, setCombinedData] = useState([]);
  const [error, setError] = useState('');
  const [userMap, setUserMap] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;

    async function fetchData() {
      try {
        const matches = await getUserMatches();
        console.log('FULL fullMatches:', matches);

        const allChats = [];
        const allMatches = [];
        const allUsers = new Map();

        for (const match of matches) {
          for (const chat of match.chats) {
            const isInRead = chat.readUsers?.some(u => u.id === userId);
            const isInWrite = chat.writeUsers?.some(u => u.id === userId);

            if ((isInRead || isInWrite) && !allMatches.includes(match)) {
              allChats.push({ match, chat });
              allMatches.push(match);
              [...(chat.readUsers || []), ...(chat.writeUsers || [])].forEach(u => {
                if (!allUsers.has(u.id)) {
                  const name = [u.firstName].filter(Boolean).join(' ') || 'User';
                  allUsers.set(u.id, { name });
                }
              });
            }
          }
        }

        setUserMap(Object.fromEntries(allUsers));
        setCombinedData(allChats);
      } catch (err) {
        console.error('Error fetching messages data:', err);
        setError('Failed to load messages from server.');
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, [userId]);

  const transformMessages = (messages) => {
    if (!messages) return [];
    return messages.slice().sort((a,b) => new Date(a.dateTime)-new Date(b.dateTime)).map(msg => {
      const isFromUser = (msg.userId === userId);
      const senderInfo = userMap[msg.userId] || { name: isFromUser ? 'Me' : 'Other User' };
      const time = new Date(msg.dateTime).toLocaleString(); 
      return {
        senderId: msg.userId,
        isFromUser,
        img: profilePicture,
        fullName: senderInfo.name,
        time,
        textContent: msg.content
      };
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-t-transparent border-r-iconRed border-b-iconRed border-l-iconRed"></div>
      </div>
    );
  }

  if (error) {
    return <div className="p-4 text-red-500">{error}</div>;
  }

  if (combinedData.length === 0) {
    return <div className="p-4">No chats available.</div>;
  }

  return (
    <div className="flex flex-col">
      <div className="bg-bgRed font-playfair font-semibold py-2 px-4">
        You have {combinedData.length} chats
      </div>
      {combinedData.map(({ match, chat }) => {
        const chatType = chat.type;

        let friendFullName = "Other User(s)";
        if (chatType === 'MAIN') {
          const isUser1 = match.user1Id === userId;
          const otherUser = isUser1 ? match.user2 : match.user1;
          friendFullName = otherUser 
            ? ((otherUser.firstName || '') + ' ' + (otherUser.lastName || '')).trim() || 'Unknown User'
            : 'Unknown User';
        } else {
          friendFullName = "Friends Chat";
        }

        const messages = transformMessages(chat.messages || []);
        const latestMessage = messages[messages.length - 1];
        const latestText = latestMessage 
          ? [{ text: latestMessage.textContent, senderID: latestMessage.senderId, receiverID: userId }]
          : [];

        return (
          <MessageInstance
            key={chat.id}
            userID={userId}
            secondaryUserID={null}
            friendFullName={friendFullName}
            img={profilePicture}
            latestText={latestText}
            latestTextIsNew={false}
            chatId={chat.id}
          />
        );
      })}
    </div>
  );
}

export default Messages;

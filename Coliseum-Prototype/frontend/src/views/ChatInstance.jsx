// src/components/ChatInstance.jsx
import React, { useState } from 'react';
import TextMessage from './TextMessage';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import profilePicture from "../assets/profilePicture.jpg";
import multiPfp from "../assets/multiPfp.jpg";

function ChatInstance({ relationship, fullName, textInstances, onSendMessage, chatId }) {
  const [inputMessage, setInputMessage] = useState('');

  const handleSend = () => {
    if (!inputMessage.trim()) return;
    onSendMessage(chatId, inputMessage.trim());
    setInputMessage('');
  };

  return(        
    <div className={`flex flex-col rounded-lg ${relationship === "FRIEND" ? `bg-fontBrown` : `bg-peach`} p-2 gap-2 h-full w-full`}>
      <div className="w-full flex justify-between font-playfair text-gray-900 pb-2 border-b-2">
        <div className="flex items-center gap-2">
          <img src={profilePicture} className="h-full max-h-6 rounded-full object-contain" alt="profile"/>
          <p>{relationship} NAME</p>
          <img src={relationship === "MATCH" ? profilePicture : multiPfp} className="h-full max-h-6 rounded-full object-contain" alt="pfp"/>
          <p>{relationship === "MATCH" ? fullName : ''}</p>
        </div>
        <p>{relationship} CHAT</p>
      </div>
      <div className="flex gap-2 overflow-y-scroll [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] flex-col-reverse flex-1">
        {textInstances?.map((textInstance, index) => (
          <TextMessage
            key={index}
            isFromUser={textInstance.isFromUser}
            relationship={textInstance.relationship}
            img={textInstance.img}
            fullName={textInstance.fullName}
            time={textInstance.time}
            textContent={textInstance.textContent}
          />
        ))}
      </div>
      <div className="flex flex-row gap-2 py-2 w-full mt-auto">
        <input
          type="text"
          placeholder="type here..."
          className="w-full p-1 px-3 rounded-full"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') handleSend(); }}
        />
        <button onClick={handleSend}>
          <FontAwesomeIcon
            icon={faArrowRight}
            className={`${relationship === "FRIEND" ? `bg-bgRed text-sand` : `bg-specialGreen text-fontBrown`} rounded-full h-8 w-10 p-1`}
          />
        </button>
      </div>
    </div>
  );
}

export default ChatInstance;

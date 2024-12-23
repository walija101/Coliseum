// src/components/Swipe.js
import React from 'react';
import { swipeUser } from '../api/apiService';

const Swipe = ({ swipedUserId }) => {
  const handleSwipe = async direction => {
    try {
      const response = await swipeUser(swipedUserId, direction);
      alert(response.message);
    } catch (error) {
      console.error('Swipe failed:', error);
    }
  };

  return (
    <div>
      <button onClick={() => handleSwipe('left')}>Swipe Left</button>
      <button onClick={() => handleSwipe('right')}>Swipe Right</button>
      <button onClick={() => handleSwipe('down')}>Swipe Down</button>
    </div>
  );
};

export default Swipe;

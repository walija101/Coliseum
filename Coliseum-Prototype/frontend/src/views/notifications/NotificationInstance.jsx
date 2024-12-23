import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMatchById, addFriend, declineFriendRequest, deleteNotification, approveMatch, denyMatch, getUserProfile } from '../../api/apiService';

function NotificationInstance({ type, userName, userImage, onOpen, onAccept, onDecline, message, sendingUserId, notificationId, matchId }){
  const navigate = useNavigate();
  const [matchProfile, setMatchProfile] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [match, setMatch] = useState(null);

  useEffect(() => {
    const fetchMatch = async () => {
      try {
        const match = await getMatchById(matchId);
        setMatch(match);
      } catch (error) {
        console.error('Error fetching match:', error);
      }
    };
    fetchMatch();
  }, [matchId]);

  const handleOpen = async () => {
    try {
      // get the profile of the user who is the other user in the match
      const otherUserId = match.user1Id === sendingUserId ? match.user2Id : match.user1Id;

      // get the profile of the other user by their userId
      const profile = await getUserProfile(otherUserId);


      setMatchProfile(profile);
      setIsModalOpen(true);
      onOpen();
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const handleApprove = async () => {
    try {
      await approveMatch(matchId, notificationId, sendingUserId);
      onAccept();
      setIsModalOpen(false);
      navigate(0);
    } catch (error) {
      console.error('Error approving match:', error);
    }
  };

  const handleDeny = async () => {
    try {
      await denyMatch(matchId, notificationId, sendingUserId);
      onDecline();
      setIsModalOpen(false);
      navigate(0);
    } catch (error) {
      console.error('Error denying match:', error);
    }
  };

  const handleAccept = async () => {
    try {
      await addFriend(sendingUserId, notificationId);
      onAccept();
      navigate(0);
    } catch (error) {
      console.error('Error accepting friend request:', error);
    }
  };

  const handleDecline = async () => {
    try {
      console.log(notificationId);
      await declineFriendRequest(sendingUserId, notificationId);
      onDecline();
      navigate(0);
    } catch (error) {
      console.error('Error declining friend request:', error);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };
  
  const renderMessage = () => {
    if (type === 'APPROVE') {
      return (
        <p className="flex-1 px-4 text-sm">
          <b>{message}</b>
        </p>
      );
    }
    return (
      <p className="flex-1 px-4 text-sm">
        <b>{message}</b>
      </p>
    );
  };

  const renderActions = () => {
    if (type === 'APPROVE') {
      return (
        <div 
          className="bg-gold text-white text-sm font-medium py-1 px-3 rounded-lg cursor-pointer"
          onClick={handleOpen}
        >
          Open
        </div>
      );
    }
    return (
      <div className="space-y-1">
        <div 
          className="bg-specialGreen text-white text-sm font-medium py-1 px-3 rounded-lg cursor-pointer"
          onClick={handleAccept}
        >
          Accept
        </div>
        <div 
          className="bg-iconRed text-white text-sm font-medium py-1 px-3 rounded-lg cursor-pointer"
          onClick={handleDecline}
        >
          Decline
        </div>
      </div>
    );
  };

  return (
<div className="relative">
      <div className="bg-white flex justify-between items-center p-4 rounded-xl shadow-md w-full max-w-md">
        <img className="h-12 w-12 rounded-full" src={userImage} alt={`${userName}'s Headshot`} />
        {renderMessage()}
        {renderActions()}
      </div>
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center" onClick={closeModal}>
          <div className="bg-white p-4 rounded-lg shadow-md" onClick={(e) => e.stopPropagation()}>
            {matchProfile ? (
              <>
                <img src={matchProfile.profileImageURL} alt="Match Profile" className="w-24 h-24 rounded-full mx-auto" />
                <h3 className="text-center text-xl font-bold mt-2">{matchProfile.user.firstName} {matchProfile.user.lastName}</h3>
                <p className="text-center text-sm text-gray-600">{matchProfile.hobbies.join(', ')}</p>
                <div className="flex justify-center mt-4 space-x-4">
                  <button
                    className="bg-green-500 text-white py-1 px-3 rounded-lg"
                    onClick={handleApprove}
                  >
                    Approve
                  </button>
                  <button
                    className="bg-red-500 text-white py-1 px-3 rounded-lg"
                    onClick={handleDeny}
                  >
                    Deny
                  </button>
                </div>
              </>
            ) : (
              <p>Loading...</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationInstance;
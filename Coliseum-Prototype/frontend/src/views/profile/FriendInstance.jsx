import React from 'react';
import tempFriend from '../../assets/tempUserHeadshot.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

function FriendInstance({ friend, isEditMode, onDelete }) {
    return (
        <div className="relative flex items-center space-x-4 p-3 bg-white/10 rounded-lg hover:bg-white/20 transition-colors">
            <div className="relative">
                {isEditMode ? (
                    <button
                        className="ml-1 absolute top-0 left-0 w-full h-full bg-red-500 bg-opacity-75 text-white rounded-full flex items-center justify-center"
                        onClick={() => onDelete(friend.id)}
                    >
                        <FontAwesomeIcon icon={faTimes} className="w-6 h-6" />
                    </button>
                ) : (
                    <img src={/*friend.profileImageURL ||*/ tempFriend} className="rounded-full h-12 w-12" alt="Friend headshot" />
                )
                }
            </div>
            <p className="text-lg">{friend.firstName} {friend.lastName}</p>
        </div>
    );
}

export default FriendInstance;
import React, { useEffect, useState } from 'react';
import FriendInstance from "./FriendInstance";
import { getUser, getAllUsers, sendFriendRequest, deleteFriend } from "../../api/apiService";

function FriendsList(){
    const [friends, setFriends] = useState([]);
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [isEditMode, setIsEditMode] = useState(false);
    const [deletingFriends, setDeletingFriends] = useState(new Set());

    useEffect(() => {
        const fetchFriends = async () => {
            try {
                const user = await getUser();
                console.log('friends are:', user.friends);
                setFriends(user.friends);
            } catch (error) {
                console.error('Error fetching friends:', error);
            }
        };

        const fetchUsers = async () => {
            try {
                const allUsers = await getAllUsers();
                setUsers(allUsers);
                setFilteredUsers(allUsers);
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };

        fetchUsers();
        fetchFriends();
    }, []);

    useEffect(() => {
        setFilteredUsers(
            users.filter(user =>
                `${user.firstName} ${user.lastName}`.toLowerCase().includes(searchTerm.toLowerCase())
            )
        );
    }, [searchTerm, users]);

    const handleAddFriend = async (friendId) => {
        try {
            await sendFriendRequest(friendId);
            alert('Friend request sent!');
        } catch (error) {
            console.error('Error sending friend request:', error);
            alert('Failed to send friend request.');
        }
    };

    const handleDeleteFriend = async (friendId) => {
        try {
            setDeletingFriends(prev => new Set([...prev, friendId]));
            await deleteFriend(friendId);
            setFriends(prevFriends => prevFriends.filter(friend => friend.id !== friendId))
        } catch (error) {
            console.error('Error deleting friend:', error);
            alert('Failed to delete friend.');
        } finally {
            setDeletingFriends(prev => {
                const newSet = new Set(prev);
                newSet.delete(friendId);
                return newSet;
            });
        }
    };

    const renderFriendOrSpinner = (friend, index) => {
        if (deletingFriends.has(friend.id)) {
            return (
                <div key={index} className="flex items-center justify-center h-16">
                    <div className="animate-spin rounded-full h-16 w-16 border-4 border-t-transparent border-r-iconRed border-b-iconRed border-l-iconRed"></div>
                </div>
            );
        }

        return (
            <FriendInstance 
                key={index}
                friend={friend}
                isEditMode={isEditMode}
                onDelete={handleDeleteFriend}
            />
        );
    };

    return (
        <div className="flex flex-col items-center font-playfair">
            <p className="text-center font-bold text-2xl m-4">Trusted Friends</p>
            <div className="bg-gold rounded-xl p-6 w-full max-w-sm">
                {friends.length > 0 && (
                    <div>
                        <p
                            className="relative underline text-end mb-2 right-2 cursor-pointer"
                            onClick={() => setIsEditMode(!isEditMode)}
                        >
                            {isEditMode ? 'Done' : 'Edit'}
                        </p>
                    </div>
                )}
                <div className="space-y-3">
                    {friends.length > 0 ? (
                        friends.map((friend, index) => renderFriendOrSpinner(friend, index))
                    ) : (
                        <div className="text-center py-8">
                            <p className="text-gray-600 mb-2">No friends added yet</p>
                            <p className="text-sm text-gray-500">Use the search below to start adding trusted friends to your network</p>
                        </div>
                    )}
                </div>
            </div>
            <div className="bg-[#82A671] inline-block rounded-md p-6 max-h-[60vh] overflow-y-auto mt-4 w-full max-w-sm &::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                <input
                    type="text"
                    placeholder="Search for friends..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full p-2 rounded border font-sans border-gray-300 text-md focus:outline-none bg-white text-black"
                />
                <div className="mt-4 space-y-4">
                    {filteredUsers.map(user => (
                        <div key={user.id} className="flex justify-between items-center bg-white/10 p-3 rounded-lg">
                            <p className="text-lg">{user.firstName} {user.lastName}</p>
                            <button
                                onClick={() => handleAddFriend(user.id)}
                                className="bg-specialGreen text-black py-1 px-3 rounded-lg"
                            >
                                Add Friend
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default FriendsList;
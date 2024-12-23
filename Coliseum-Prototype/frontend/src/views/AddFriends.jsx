import React, { useState, useEffect } from 'react';
import { getAllUsers, sendFriendRequest } from '../api/apiService';

function AddFriends() {
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredUsers, setFilteredUsers] = useState([]);

    useEffect(() => {
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

    return (
        <div className="bg-[#2F1F06] h-full text-center text-white flex flex-col items-center justify-center space-y-16">
            <p className="font-cinzel text-5xl">FIND YOUR <br /> COMRADES</p>
            <p className="font-playfair text-3xl">Add at least 3 friends before using the app!</p>
            <div className="bg-[#82A671] inline-block rounded-md p-6 max-h-[40vh] overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                <input
                    type="text"
                    placeholder="Search for friends..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full p-2 rounded border font-sans border-gray-300 text-md focus:outline-none bg-white text-black"
                />
                <div className="mt-4 space-y-4 ">
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

export default AddFriends;
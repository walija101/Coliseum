import React, { useState, useEffect, setError, setLoading } from 'react';
import { getAllUsers, getUser } from '../../api/apiService';
import { redirect } from 'react-router-dom';

function DatabaseOverview() {
    /*
    const users = [
        { id: 1, name: "User 1" },
        { id: 2, name: "User 2"},
        { id: 3, name: "User 3"},
        { id: 6, name: "Admin", ticketsSubmitted: [] }
    ];
    */
    

    //const users = await getAllUsers();

    const [selectedUser, setSelectedUser] = useState(null);
    const [userList, setUserList] = useState([]);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const currentUser = await getUser();
                if (currentUser.role != 'ADMIN'){
                    redirect('/');
                    return;
                }

                setUser(currentUser);

                const users = await getAllUsers(); // use api
                setUserList(users);
                console.log(users);
                setSelectedUser(users[0] || null); // select the first user by default
            } catch (err) {
                setError('Failed to fetch users');
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);


    const handleUserSelect = (user) => {
        setSelectedUser(user);
    };

    const handleBanUser = (userId) => {
        const updatedUsers = userList.filter(user => user.id !== userId);
        setUserList(updatedUsers);
        
        if (selectedUser.id === userId) {
            setSelectedUser(updatedUsers[0] || null);
        }
    };

    const handleUnBanUser = (userId) => {

    }

    return (
        <div className="min-h-screen flex bg-sand">
            <div className="flex-1">
                <div className="p-6">
                    <h2 className="text-xl mb-4">Database Overview</h2>
                    
                    <div className="grid grid-cols-2 gap-6">
                        <div className="bg-amber-200/50 rounded-lg p-4">
                            <div className="space-y-2">
                                {userList.map((user) => (
                                    <div
                                        key={user.id}
                                        className={`p-2 hover:bg-amber-200 transition-colors cursor-pointer rounded
                                            ${selectedUser?.id === user.id ? 'bg-amber-300' : ''}`}
                                        onClick={() => handleUserSelect(user)}
                                    >
                                        {user.firstName} {user.lastName}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {selectedUser && (
                            <div className="bg-amber-200/50 rounded-lg p-4">
                                <div className="mb-4">
                                    <h3 className="text-lg font-medium">{selectedUser.name}</h3>
                                </div>
                                <div className="space-y-4">
                                    <div>
                                        <p className="font-medium">User ID:</p>
                                        <p>{selectedUser.id}</p>
                                    </div>

                                    <button 
                                        className="px-4 py-2 bg-amber-700 text-white rounded hover:bg-amber-800 transition-colors"
                                        onClick={() => handleBanUser(selectedUser.id)}
                                    >
                                        Ban User
                                    </button>
                                    <button 
                                        className="px-4 py-2 ml-6 bg-amber-700 text-white rounded hover:bg-amber-800 transition-colors"
                                        onClick={() => handleUnBanUser(selectedUser.id)}
                                    >
                                        UnBan User
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DatabaseOverview;
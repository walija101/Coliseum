import React, { useState } from 'react';

function AdminModsOverview() {
  const mods = [
    { 
      id: 1, 
      name: "Mod 1",
      ticketsAssigned: ["Ticket #123", "Ticket #456"],
      usersFlagged: ["User A", "User B", "User C"]
    },
    { 
      id: 2, 
      name: "Mod 2",
      ticketsAssigned: ["Ticket #789"],
      usersFlagged: ["User D"]
    },
    { 
      id: 3, 
      name: "Mod 3",
      ticketsAssigned: [],
      usersFlagged: ["User E", "User F"]
    }
  ];

  const [selectedMod, setSelectedMod] = useState(mods[0]);

  const handleModSelect = (mod) => {
    setSelectedMod(mod);
  };

  const handleDropMod = () => {
    if (window.confirm(`Are you sure you want to drop ${selectedMod.name}?`)) {
      alert(`${selectedMod.name} has been dropped`);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
        <div className="p-4 bg-gold m-4 w-full rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-sand rounded-lg p-4 shadow-sm">
                    <div className="mb-4">
                        <h2 className="text-lg font-medium">Mod list</h2>
                    </div>
                <div className="space-y-2">
                    {mods.map(mod => (
                    <div 
                        key={mod.id} 
                        className={`p-2 rounded transition-colors cursor-pointer ${
                        selectedMod.id === mod.id 
                            ? 'bg-orange-100 font-medium' 
                            : 'hover:bg-orange-50'
                        }`}
                        onClick={() => handleModSelect(mod)}
                    >
                        {mod.name}
                    </div>
                    ))}
                </div>
            </div>

            <div className="bg-sand rounded-lg p-4 shadow-sm">
                <div className="mb-4">
                    <h2 className="text-lg font-medium">{selectedMod.name}</h2>
                </div>
                <div className="space-y-4">
                    <div>
                        <p className="font-medium">Mod id:</p>
                        <p>{selectedMod.id}</p>
                    </div>
                    
                    <div>
                        <p className="font-medium">Tickets assigned:</p>
                        <div className="mt-1">
                            {selectedMod.ticketsAssigned.length > 0 ? (
                            <ul className="list-disc pl-4">
                                {selectedMod.ticketsAssigned.map((ticket, index) => (
                                <li key={index}>{ticket}</li>
                                ))}
                            </ul>
                            ) : (
                            <p className="text-gray-500 italic">No tickets assigned</p>
                            )}
                        </div>
                    </div>

                    <div>
                        <p className="font-medium">Users Flagged:</p>
                        <div className="mt-1">
                            {selectedMod.usersFlagged.length > 0 ? (
                            <ul className="list-disc pl-4">
                                {selectedMod.usersFlagged.map((user, index) => (
                                <li key={index}>{user}</li>
                                ))}
                            </ul>
                            ) : (
                            <p className="text-gray-500 italic">No users flagged</p>
                            )}
                        </div>
                    </div>

                    <button 
                        onClick={handleDropMod}
                        className="mt-4 px-4 py-2 bg-fontBrown text-white rounded hover:bg-red-600 transition-colors w-full md:w-auto"
                        >
                        Drop Mod
                    </button>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}

export default AdminModsOverview;
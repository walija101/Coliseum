// src/components/Profile.js
import React, { useState, useEffect } from 'react';
import { getProfile, updateProfile } from '../api/apiService';

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      const data = await getProfile();
      setProfile(data);
    };
    fetchProfile();
  }, []);

  const handleUpdate = async e => {
    e.preventDefault();
    const updatedData = await updateProfile(profile);
    setProfile(updatedData);
    setEditing(false);
  };

  return (
    <div>
      {editing ? (
        <form onSubmit={handleUpdate}>
          <input value={profile.firstName} onChange={e => setProfile({ ...profile, firstName: e.target.value })} />
          <input value={profile.lastName} onChange={e => setProfile({ ...profile, lastName: e.target.value })} />
          {/* Add other fields as needed */}
          <button type="submit">Save</button>
        </form>
      ) : (
        <>
          <p>{profile?.firstName} {profile?.lastName}</p>
          <button onClick={() => setEditing(true)}>Edit</button>
        </>
      )}
    </div>
  );
};

export default Profile;

import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencil, faCheck, faTimes } from '@fortawesome/free-solid-svg-icons';
import profileImage from '../../assets/tempUserHeadshot.png';

const ProfileEdit = () => {
  const [editMode, setEditMode] = useState({});
  const [profileData, setProfileData] = useState({
    name: "Jane Doe",
    location: "Calgary",
    age: "23",
    bio: "I like long walks on the beach",
    occupation: "Customer Service Worker",
    education: "University of Waterloo",
    relationshipGoals: "Long-term",
    languages: "Italian, English",
    religiousBeliefs: "Agnostic",
    pets: "Golden Retrievers",
    ethnicity: "White"
  });

  const [tempValues, setTempValues] = useState({});

  const startEditing = (field) => {
    setEditMode({ ...editMode, [field]: true });
    setTempValues({ ...tempValues, [field]: profileData[field] });
  };

  const cancelEditing = (field) => {
    setEditMode({ ...editMode, [field]: false });
    setTempValues({ ...tempValues, [field]: profileData[field] });
  };

  const saveEdit = (field) => {
    setProfileData({ ...profileData, [field]: tempValues[field] });
    setEditMode({ ...editMode, [field]: false });
  };

  const handleChange = (field, value) => {
    setTempValues({ ...tempValues, [field]: value });
  };

  const handleKeyDown = (e, field) => {
    if (e.key === 'Enter') {
      saveEdit(field);
    } else if (e.key === 'Escape') {
      cancelEditing(field);
    }
  };

  const EditableField = ({ field, label }) => (
    <div className="flex items-center justify-between p-3 rounded-lg bg-white/50 hover:bg-white/60 transition-colors">
      <div className="flex-grow">
        <p className="text-sm text-gray-600">{label}</p>
        {editMode[field] ? (
          <input
            type="text"
            value={tempValues[field] || ''}
            onChange={(e) => handleChange(field, e.target.value)}
            onKeyDown={(e) => handleKeyDown(e, field)}
            className="w-full p-1 border rounded focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white"
            autoFocus
          />
        ) : (
          <p className="font-medium">{profileData[field]}</p>
        )}
      </div>
      <div className="flex space-x-2">
        {editMode[field] ? (
          <>
            <button
              type="button"
              onClick={() => saveEdit(field)}
              className="p-2 hover:bg-white/80 rounded-full transition-colors text-green-600"
              aria-label="Save changes"
            >
              <FontAwesomeIcon icon={faCheck} className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => cancelEditing(field)}
              className="p-2 hover:bg-white/80 rounded-full transition-colors text-red-600"
              aria-label="Cancel editing"
            >
              <FontAwesomeIcon icon={faTimes} className="w-4 h-4" />
            </button>
          </>
        ) : (
          <button
            type="button"
            onClick={() => startEditing(field)}
            className="p-2 hover:bg-white/80 rounded-full transition-colors"
            aria-label={`Edit ${label}`}
          >
            <FontAwesomeIcon icon={faPencil} className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );

  return (
    <div className="h-full p-4 overflow-y-auto font-playfair">
      <div className="flex items-start mt-6 space-x-6">
        <div className="relative flex-shrink-0">
          <img
            className="h-32 w-43 lg:h-64 lg:w-64 rounded-xl object-cover border-4 border-amber-500"
            src={profileImage}
            alt="Jane Doe"
          />
          <button 
            type="button"
            className="absolute bottom-0 right-0 bg-white p-1 rounded-full shadow-lg hover:bg-gray-100 transition-colors"
            aria-label="Edit profile picture"
          >
            <FontAwesomeIcon icon={faPencil} className="w-4 h-4" />
          </button>
        </div>
        
        <div className="space-y-2 flex-grow">
          <EditableField field="name" label="Name" />
          <EditableField field="age" label="Age" />
          <div className='hidden lg:block space-y-2'>
            <EditableField field="location" label="Location" />
            <EditableField field="bio" label="Bio" />
          </div>
        </div>
      </div>

      <div className="mt-8 space-y-4">
        <div className='block lg:hidden space-y-4'>
            <EditableField field="location" label="Location" />
            <EditableField field="bio" label="Bio" />
        </div>
        <EditableField field="occupation" label="Occupation" />
        <EditableField field="education" label="Education" />
        <EditableField field="relationshipGoals" label="Relationship Goals" />
        <EditableField field="languages" label="Languages Spoken" />
        <EditableField field="religiousBeliefs" label="Religious Beliefs" />
        <EditableField field="pets" label="Pets" />
        <EditableField field="ethnicity" label="Ethnicity" />
      </div>

      <div className="flex justify-center mt-6 lg:ml-4">
        <button 
          type="button"
          className="bg-gold text-white px-8 py-2 rounded-xl font-medium hover:bg-[#C28E4F] transition-colors"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
};

export default ProfileEdit;
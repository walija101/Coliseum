import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencil, faCheck, faTimes } from '@fortawesome/free-solid-svg-icons';

const EditableField = ({ 
  field, 
  label, 
  editMode, 
  tempValues, 
  profileData,
  onStartEditing,
  onCancelEditing,
  onSaveEdit,
  onValueChange,
  onKeyDown 
}) => (
  <div className="flex items-center justify-between p-3 rounded-lg bg-white/50 hover:bg-white/60 transition-colors">
    <div className="flex-grow">
      <p className="text-sm text-gray-600">{label}</p>
      {editMode[field] ? (
        <input
          type="text"
          value={tempValues[field] || ''}
          onChange={(e) => onValueChange(field, e.target.value)}
          onKeyDown={(e) => onKeyDown(e, field)}
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
            onClick={() => onSaveEdit(field)}
            className="p-2 hover:bg-white/80 rounded-full transition-colors text-green-600"
            aria-label="Save changes"
          >
            <FontAwesomeIcon icon={faCheck} className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => onCancelEditing(field)}
            className="p-2 hover:bg-white/80 rounded-full transition-colors text-red-600"
            aria-label="Cancel editing"
          >
            <FontAwesomeIcon icon={faTimes} className="w-4 h-4" />
          </button>
        </>
      ) : (
        <button
          type="button"
          onClick={() => onStartEditing(field)}
          className="p-2 hover:bg-white/80 rounded-full transition-colors"
          aria-label={`Edit ${label}`}
        >
          <FontAwesomeIcon icon={faPencil} className="w-4 h-4" />
        </button>
      )}
    </div>
  </div>
);

export default EditableField;
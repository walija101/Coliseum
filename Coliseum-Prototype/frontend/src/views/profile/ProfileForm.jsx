import React, { useState, useEffect } from 'react';
import { createProfile, updateProfile, getProfile, uploadImage, getImage } from '../../api/apiService';
import { useNavigate } from 'react-router-dom';

const ProfileForm = ({ isUpdate }) => {
  const [profileData, setProfileData] = useState({
    gender: 'Undisclosed',
    bday: '',
    height: '',
    hobbies: '',
    sexuality: 'Other',
    images: [],
  });
  const navigate = useNavigate();
  const [imageUrls, setImageUrls] = useState([]);

  useEffect(() => {
    if (isUpdate) {
      const fetchProfile = async () => {
        try {
          const profile = await getProfile();
          setProfileData({
            gender: profile.gender,
            bday: profile.bday,
            height: profile.height,
            hobbies: profile.hobbies.join(', '),
            sexuality: profile.sexuality.join(', '),
            images: profile.images || [],
          });
          const urls = await Promise.all(profile.images.map(async image => await getImage(image)));
          console.log(urls);
          setImageUrls(urls);
  
        } catch (error) {
          console.error('Error fetching profile:', error);
        }
      };

      fetchProfile();
    }
  }, [isUpdate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length + profileData.images.length > 5) {
      alert('You can only upload up to 5 images.');
      return;
    }

    const paths = await Promise.all(files.map(async (file) => {
      const response = await uploadImage(file); // Assume uploadImage returns { imageUrl: 'url' }
      return response.imageUrl; // Extract and return the imageUrl
    }));

    const updateImageUrls = async (paths) => {
      try {
        // get new urls
        const newUrls = await Promise.all(
          paths.map(async (path) => {
            const url = await getImage(path);
            return url;
          })
        );
    
        // add new uls on top of existing
        setImageUrls((prevImageUrls) => [...prevImageUrls, ...newUrls]);
        console.log('new urls', imageUrls);
      } catch (error) {
        console.error('Error updating image URLs:', error);
      }
    };
    //update
    updateImageUrls(paths);
    
    setProfileData((prevData) => ({
      ...prevData,
      images: [...prevData.images, ...paths],
    }));
  };

  const handleRemove = (indexToRemove) => {
    // get everything except for removed image
    const updatedImages = profileData.images.filter((_, index) => index !== indexToRemove);
    setProfileData({
      ...profileData, // get the existing properties
      images: updatedImages, // update
    });

  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = {
      ...profileData,
      height: parseInt(profileData.height, 10),
      hobbies: profileData.hobbies.split(',').map((hobby) => hobby.trim()),
      sexuality: profileData.sexuality.split(',').map((sex) => sex.trim()),
      images: profileData.images,
    };

    try {
      if (isUpdate) {
        console.log('Updating profile:', data);
        await updateProfile(data);
        navigate('/profile');
      } else {
        await createProfile(data);
        navigate('/swiping');
      }
      navigate('/profile');
    } catch (error) {
      console.error('Error saving profile:', error);
    }
  };

  return (
    <div className="flex flex-col items-center font-playfair p-4 max-h-[80vh] overflow-y-auto">
      <h1 className="text-3xl font-bold mb-4 ">{isUpdate ? 'Update Profile' : 'Create Profile'}</h1>
      <form onSubmit={handleSubmit} className="bg-gold rounded-xl p-6 w-full max-w-sm space-y-4">
        
        <div className="space-y-2">
          <label htmlFor="gender" className="block uppercase text-sm">Gender</label>
          <select
            id="gender"
            name="gender"
            value={profileData.gender}
            onChange={handleChange}
            className="w-full p-2 rounded border font-sans border-gray-300 text-md focus:outline-none"
            required
          >
            <option value="Undisclosed">Undisclosed</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
        </div>
        
        <div className="space-y-2">
          <label htmlFor="bday" className="block uppercase text-sm">Birthday</label>
          <input
            type="date"
            id="bday"
            name="bday"
            value={profileData.bday.split('T')[0]}
            onChange={handleChange}
            className="w-full p-2 rounded border font-sans border-gray-300 text-md focus:outline-none"
            required
          />
        </div>
        
        <div className="space-y-2">
          <label htmlFor="height" className="block uppercase text-sm">Height (cm)</label>
          <input
            type="number"
            id="height"
            name="height"
            value={profileData.height}
            onChange={handleChange}
            className="w-full p-2 rounded border font-sans border-gray-300 text-md focus:outline-none"
            required
          />
        </div>
        
        <div className="space-y-2">
          <label htmlFor="hobbies" className="block uppercase text-sm">Hobbies (comma separated)</label>
          <input
            type="text"
            id="hobbies"
            name="hobbies"
            value={profileData.hobbies}
            onChange={handleChange}
            className="w-full p-2 rounded border font-sans border-gray-300 text-md focus:outline-none"
            required
          />
        </div>
        
        <div className="space-y-2">
          <label htmlFor="sexuality" className="block uppercase text-sm">Sexuality (comma separated)</label>
          <select
            id="sexuality"
            name="sexuality"
            value={profileData.sexuality}
            onChange={handleChange}
            className="w-full p-2 rounded border font-sans border-gray-300 text-md focus:outline-none"
            required
          >
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div className="space-y-2">
          <label htmlFor="images" className="block uppercase text-sm">Upload Images (up to 5)</label>
          <input
            type="file"
            id="images"
            name="images"
            accept="image/*"
            multiple
            onChange={handleImageUpload}
            className="w-full p-2 rounded border font-sans border-gray-300 text-md focus:outline-none"
          />
        </div>
        {imageUrls.map((image, index) => (
          <div key={index}>
            <img src={image.tempUrl.signedUrl} alt={`Uploaded ${index + 1}`} style={{ maxWidth: '100px', maxHeight: '100px' }} />
            <button onClick={() => handleRemove(index)} style={{ marginLeft: '10px' }}>
              Remove
            </button>
          </div>
        ))}
        <button
          type="submit"
          className="w-full bg-specialGreen text-black uppercase py-2 rounded transition-colors"
        >
          {isUpdate ? 'Update Profile' : 'Create Profile'}
        </button>
      </form>
    </div>
  );
};

export default ProfileForm;
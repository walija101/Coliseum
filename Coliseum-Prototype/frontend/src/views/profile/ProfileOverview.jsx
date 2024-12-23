import React, { useState, useEffect } from 'react';
import { getProfile, getImage, getUser } from '../../api/apiService';
import { useNavigate } from 'react-router-dom';
import tempUser from "../../assets/tempUserHeadshot.png";

const ProfileOverview = () => {
  const [profile, setProfile] = useState(null);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const [userPfp, setUserPfp] = useState(null);
  const [images, setImages] = useState(null); // maybe change this for whenever form submitted
  const [isLoadingUser, setIsLoadingUser] = useState(true);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [isLoadingImages, setIsLoadingImages] = useState(false);

  const LoadingSpinner = () => (
    <div className="flex items-center justify-center h-full">
      <div className="animate-spin rounded-full h-16 w-16 border-4 border-t-transparent border-r-iconRed border-b-iconRed border-l-iconRed"></div>
    </div>
  );

  useEffect(() => {
    const fetchUserAndPfp = async () => {
      setIsLoadingUser(true);
      try {
        const userData = await getUser();
        setUser(userData);
        console.log(userData);
        if (userData?.profileImageURL) {
          const pfpData = await getImage(userData.profileImageURL);
          setUserPfp(pfpData.tempUrl.signedUrl);
        }
      } catch (error) {
        console.error('Error fetching user:', error);
      } finally {
        setIsLoadingUser(false);
      }
    };

    const fetchProfile = async () => {
      setIsLoadingProfile(true);
      try {
        const profileData = await getProfile();
        if (profileData.message === "Profile not found") {
          setProfile(null);
        } else {
          setProfile(profileData);
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setIsLoadingProfile(false);
      }
    };

    //if we decide to put profile images in the overview or not
    const fetchImages = async () => {
      if (!profile?.images) return;
      setIsLoadingImages(true);
      try {
        console.log('testing');
        const imageUrls = await Promise.all(profile.images.map(async image => await getImage(image)));
        console.log(imageUrls);
        setImages(imageUrls);
      } catch (error) {
        console.error('Error fetching images:', error);
      } finally {
        setIsLoadingImages(false);
      }
    };

    fetchImages();
    fetchUserAndPfp();
    fetchProfile();
  }, []);

  if (isLoadingProfile || isLoadingUser) {
    return <LoadingSpinner />;
  }

  if (profile === null) {
    return (
      <div className="flex flex-col items-center font-playfair p-4">
        <h1 className="text-3xl font-bold mb-4">Profile</h1>
        <p>No profile found. Please create a profile.</p>
        <button
          onClick={() => navigate('/create-profile')}
          className="mt-4 bg-specialGreen text-black py-2 px-4 rounded-lg"
        >
          Create Profile
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center font-playfair p-4">
      <div className="flex justify-center items-center gap-4 mb-8">
        <div className="h-24 w-24 md:h-32 md:w-32">
          {isLoadingImages ? (
            <LoadingSpinner />
          ) : (
            <img 
              src={userPfp || tempUser}
              alt="User Profile"
              className="rounded-full w-full h-full object-cover"
            />
          )}
        </div>
        <div>
          <p className="text-2xl font-bold">{profile.user.firstName} {profile.user.lastName}</p>
          <p className="text-lg"><b>Age:</b> {new Date().getFullYear() - new Date(profile.bday).getFullYear()}</p>
        </div>
      </div>
      <div className="bg-gold rounded-xl p-6 w-full max-w-sm">
        <p><strong>Gender:</strong> {profile.gender}</p>
        <p><strong>Birthday:</strong> {new Date(profile.bday).toLocaleDateString().split('T')[0 ]}</p>
        <p><strong>Height:</strong> {profile.height} cm</p>
        <p><strong>Hobbies:</strong> {profile.hobbies.join(', ')}</p>
        <p><strong>Sexuality:</strong> {profile.sexuality.join(', ')}</p>
      </div>
    </div>
  );
};

export default ProfileOverview;
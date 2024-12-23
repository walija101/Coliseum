import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { logout, setAuthToken, getProfile, getImage, getUser } from '../../api/apiService';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight, faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import tempUser from "../../assets/tempUserHeadshot.png";

const ProfileLogout = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [user, setUser] = useState(null);
  const [userPfp, setUserPfp] = useState(null);
  const [images, setImages] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLoadingImages, setIsLoadingImages] = useState(true);


  const goToPrevious = () => {
    if (currentImageIndex > 0) {
      setCurrentImageIndex(prev => prev - 1);
    }
  };

  const goToNext = () => {
    if (currentImageIndex < images.length - 1) {
      setCurrentImageIndex(prev => prev + 1);
    }
  };

  useEffect(() => {
    const fetchUserAndPfp = async () => {
      try {
        const userData = await getUser();
        setUser(userData);
        if (userData?.profileImageURL) {
          const pfpData = await getImage(userData.profileImageURL);
          setUserPfp(pfpData.tempUrl.signedUrl);
        }
      } catch (error) {
        console.error('Error fetching user:', error);
      }
    };

    const fetchProfile = async () => {
      try {
        const profileData = await getProfile();
        if (profileData.message === "Profile not found") {
          setProfile(null);
        } else {
          setProfile(profileData);
          // Fetch all profile images after getting profile data
          if (profileData.images && profileData.images.length > 0) {
            setIsLoadingImages(true);
            const imageUrls = await Promise.all(
              profileData.images.map(async image => {
                const imageData = await getImage(image);
                return imageData.tempUrl.signedUrl;
              })
            );
            setImages(imageUrls);
            setIsLoadingImages(false);
          }
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      } 
    };

    fetchUserAndPfp();
    fetchProfile();
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      localStorage.removeItem('token');
      setAuthToken(null);
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
      alert('Logout failed');
    }
  };


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
      <div className="bg-iconRed flex flex-col rounded-lg items-center p-2 pb-4 w-full max-w-md mb-4">
        <div className="relative">
          <img
            className="border-iconRed border-8 rounded-lg justify-center object-cover h-64 w-64"
            src={images[currentImageIndex] || userPfp || tempUser} // the images array, or the user's profile photo, or the default
            alt="Profile"
          />
        </div>
        
        <div className="bg-white w-3/4 text-center font-playfair font-medium text-xl rounded-xl py-2 mt-4">
          {user?.firstName || "User"} {user?.lastName || ""} - Age {profile?.bday ? new Date().getFullYear() - new Date(profile.bday).getFullYear() : "N/A"}
        </div>
        
        {images.length > 0 && (
          <div className="flex justify-center items-center py-4">
            <div className="bg-gold px-6 py-2 rounded-full inline-flex items-center gap-4">
              <button
                onClick={goToPrevious}
                disabled={currentImageIndex === 0}
                className="p-1 hover:bg-white/10 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Previous slide"
              >
                <FontAwesomeIcon icon={faChevronLeft} className="w-5 h-5 text-white" />
              </button>
  
              <div className="flex gap-2">
                {images.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`h-3 w-3 rounded-full transition-all duration-300 ${
                      index === currentImageIndex ? "bg-white scale-125" : "bg-white/50"
                    }`}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>
  
              <button
                onClick={goToNext}
                disabled={currentImageIndex === images.length - 1}
                className="p-1 hover:bg-white/10 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Next slide"
              >
                <FontAwesomeIcon icon={faChevronRight} className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>
        )}
      </div>
  
      <button
        onClick={handleLogout}
        className="bg-gold text-fontBrown text-lg font-bold py-2 px-4 rounded-lg transition-colors duration-200"
      >
        Logout
      </button>
    </div>
  );  
  
};

export default ProfileLogout;
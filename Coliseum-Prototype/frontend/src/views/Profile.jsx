import React, { useState, useEffect } from 'react';
import { useSwipeable } from 'react-swipeable';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight, faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import ProfileHeader from "./profile/ProfileHeader";
import ProfileOverview from "./profile/ProfileOverview";
import FriendsList from "./profile/FriendsList";
import ProfileForm from "./profile/ProfileForm";
import ProfilePreferences from "./profile/ProfilePreferences";
import ProfileLogout from './profile/ProfileLogout';
import { getProfile } from '../api/apiService';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const components = [
        { component: <ProfileOverview /> },
        // { component: <FriendsList /> },
        { component: <FriendsList friends={["John Doe", "Hailey Welch", "Sylvester Stallone", "Kalle Rovanperä"]} />},
        { component: <ProfileForm isUpdate={true} /> },
        { component: <ProfileLogout /> }
        //{ component: <ProfilePreferences /> }
    ];
    const navigate = useNavigate();
    const [profileExists, setProfileExists] = useState(false);

    useEffect(() => {
        const checkProfile = async () => {
            try {
                const profileData = await getProfile();
                if (profileData.message === "No profile found") {
                    navigate('/create-profile');
                } else {
                    setProfileExists(true);
                }
            } catch (error) {
                console.error('Error checking profile:', error);
            }
        };

        checkProfile();
    }, [navigate]);

    const handlers = useSwipeable({
        onSwipedLeft: () => {
            if (currentIndex < components.length - 1) {
                setCurrentIndex(prev => prev + 1);
            }
        },
        onSwipedRight: () => {
            if (currentIndex > 0) {
                setCurrentIndex(prev => prev - 1);
            }
        },
        preventDefaultTouchmoveEvent: true,
        trackMouse: true
    });

    const goToSlide = (index) => {
        setCurrentIndex(index);
    };

    const goToPrevious = () => {
        if (currentIndex > 0) {
            setCurrentIndex(prev => prev - 1);
        }
    };

    const goToNext = () => {
        if (currentIndex < components.length - 1) {
            setCurrentIndex(prev => prev + 1);
        }
    };

    return (
        <div className="h-full flex flex-col bg-sand">
            <ProfileHeader />

            <div className="flex-1 overflow-hidden relative">
                <div
                    {...handlers}
                    className="flex h-full transition-transform duration-300 ease-out absolute inset-0"
                    style={{
                        transform: `translateX(-${currentIndex * 100}%)`,
                    }}
                >
                    {components.map(({ component }, index) => (
                        <div
                            key={index}
                            className="w-full flex-shrink-0 overflow-y-auto"
                            style={{ minWidth: '100%' }}
                        >
                            {component}
                        </div>
                    ))}
                </div>
            </div>

            <div className="flex justify-center items-center py-4 mb-6">
                <div className="bg-gold px-6 py-2 rounded-full inline-flex items-center gap-4">
                    <button
                        onClick={goToPrevious}
                        disabled={currentIndex === 0}
                        className="p-1 hover:bg-white/10 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        aria-label="Previous slide"
                    >
                        <FontAwesomeIcon icon={faChevronLeft} className='w-5 h-5 text-white' />
                    </button>
                    
                    <div className="flex gap-2">
                        {components.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => goToSlide(index)}
                                className={`h-3 w-3 rounded-full transition-all duration-300 ${
                                    index === currentIndex ? 'bg-white scale-125' : 'bg-white/50'
                                }`}
                                aria-label={`Go to slide ${index + 1}`}
                            />
                        ))}
                    </div>
                    
                    <button
                        onClick={goToNext}
                        disabled={currentIndex === components.length - 1}
                        className="p-1 hover:bg-white/10 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        aria-label="Next slide"
                    >
                        <FontAwesomeIcon icon={faChevronRight} className='w-5 h-5 text-white' />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Profile;
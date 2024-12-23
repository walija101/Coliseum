import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import acceptImage from '../assets/accept.png';
import declineImage from '../assets/decline.png';
import placeholderImage from '../assets/placeholderPhoto.jpg';
import { getUser, getProfile, getAllUsersWithProfiles, swipeUser } from '../api/apiService';

const Swiping = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [potentialMatches, setPotentialMatches] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkUserStatus = async () => {
        try {
            setIsLoading(true);

            // get the current logged in user
            const user = await getUser();

            // if there is no current user, send back to login
            if (!user) {
                navigate('/login');
                return;
            }

            // check the user's friends list to see if they are able to start matching
            if (!user.friends || user.friends.length < 3) {
                navigate('/add-friends');
            }

            // get the current user's profile
            const profile = await getProfile();

            // if the user does not have a profile, send them to create one
            if(profile.message === "Profile not found") {
                console.log('no profiles found');
                navigate('/create-profile');
                return;
            }
            
            // Add logging to verify the structure of the profile object
            console.log('Profile hobbies:', profile.hobbies);

            // Add a check to handle cases where profile.hobbies is undefined
            if (!Array.isArray(profile.hobbies)) {
                console.error('Profile hobbies is not an array:', profile.hobbies);
                return;
            }
            
            // get all users with profiles
            const allUsers = await getAllUsersWithProfiles();
            const filteredUsers = allUsers.filter(u => {
                // filter out the current user from the list of all users
                if (!u.profile || u.id === user.id) return false;

                // check if the user has at least 3 common hobbies with the current user
                const commonHobbies = u.profile.hobbies.filter(hobby => profile.hobbies.includes(hobby));
                return commonHobbies.length >= 3;
            });

            console.log('The potential matches are:', filteredUsers);
            setPotentialMatches(filteredUsers);
        } catch (error) {
            console.error('Error checking user status:', error);
        } finally {
            setIsLoading(false);  // This is new
        }
    };
    
    checkUserStatus();
    }, [navigate]);

    const handleApprove = async (swipedUserId) => {
        try {
            await swipeUser(swipedUserId, 'right');
            setPotentialMatches(potentialMatches.filter(match => match.id !== swipedUserId));
        } catch (error) {
            console.error('Error approving match:', error);
        }
    };

    const handleDeny = async (swipedUserId) => {
        try {
            await swipeUser(swipedUserId, 'left');
            setPotentialMatches(potentialMatches.filter(match => match.id !== swipedUserId));
        } catch (error) {
            console.error('Error denying match:', error);
        }
    };

    const currentMatch = potentialMatches[currentIndex];

    if (isLoading) {
        return (
          <div className="flex items-center justify-center min-h-screen">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-t-transparent border-r-iconRed border-b-iconRed border-l-iconRed"></div>
          </div>
        );
      }      

return (
    <div className="flex flex-col items-center justify-center max-w-2xl w-full p-4">
        {potentialMatches.length === 0 ? (
            <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">No Potential Matches</h2>
            <p>Try updating your profile or expanding your search criteria.</p>
            </div>
        ) : (
            currentMatch && (
            <>
            <div className='bg-iconRed flex flex-col rounded-lg items-center p-2 pb-4 max-h-[50vh]'>
                <img 
                className="border-iconRed border-8 rounded-lg justify-center object-cover max-h-[35vh]" 
                src={currentMatch.profile.profileImageURL || placeholderImage}
                alt="users profile"
                />
                <div className='bg-white w-3/4 text-center font-playfair font-medium text-xl rounded-xl py-2'>
                {currentMatch.firstName} {currentMatch.lastName} - Age {new Date().getFullYear() - new Date(currentMatch.profile.bday).getFullYear()}
                </div>  
            </div>
        
            <div className='flex justify-center'>
                <div className='bg-gold px-6 py-2 rounded-full inline-flex gap-2 my-4'>
                {[...Array(potentialMatches.length)].map((_, index) => (
                    <div
                    key={index}
                    className={`h-3 w-3 rounded-full transition-all duration-300 ${
                        index === currentIndex ? 'bg-white scale-125' : 'bg-white/50'
                    }`}
                    />
                ))}
                </div>
            </div>

            <div className="flex items-center justify-center gap-8">
                <button 
                className="p-4 w-32 h-32 md:w-40 md:h-40 flex justify-center items-center rounded-full bg-gold border-4 border-red-500 hover:border-red-600 transition-colors duration-200 shadow-md"
                aria-label="Decline"
                onClick={() => handleDeny(currentMatch.id)}
                >
                <img 
                    src={declineImage}
                    alt="Decline"
                    className="w-20 h-24 md:w-24 md:h-32"
                />
                </button>
                <button 
                className="p-4 w-32 h-32 md:w-40 md:h-40 flex justify-center items-center rounded-full bg-gold border-4 border-green-500 hover:border-green-600 transition-colors duration-200 shadow-md"
                aria-label="Accept"
                onClick={() => handleApprove(currentMatch.id)}
                >
                <img 
                    src={acceptImage}
                    alt="Accept"
                    className="w-20 h-24 md:w-24 md:h-32"
                />
                </button>
            </div>
            </>
        )
      )}
    </div>
  );
};

export default Swiping;
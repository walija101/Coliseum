import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { register, uploadImage } from '../api/apiService';


function Registration() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [maidenName, setMaidenName] = useState('');
  const [image, setImage] = useState(null);
  const [bday, setBday] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async e => {
    e.preventDefault();
    // check if the two passwords match

    console.log("Checking passwords", image);

    if (password !== confirmPassword) {
        alert(`Passwords no not match`);
        return;
    }
    // handle image upload and user signup communication with backend API
    try {
        let imageUrl = '';
        if (image) {
            const response = await uploadImage(image);
            imageUrl = response.imageUrl;
        }

        console.log("Registering user with supabase", image);
        const userData = { email, password, firstName, lastName, maidenName, image: imageUrl, bday };
        await register(userData);
        navigate('/login'); // Redirect to login page after registration
    } catch (error) {
        console.error('Registration failed:', error);
        alert('Registration failed');
    }
  };

  return (
    <div className="flex font-cinzel items-start justify-center p-4 h-screen overflow-y-auto">
      <div className="bg-gold rounded-xl p-6 w-full max-w-sm"> 
        <div className="bg-iconRed rounded-lg p-4 text-center">
          <form className="space-y-4 text-black" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label htmlFor="email" className="block text-white uppercase text-sm ">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full p-2 rounded border font-sans border-gray-300 text-md focus:outline-none"
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="block text-white uppercase text-sm">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full p-2 rounded border font-sans border-gray-300 focus:outline-none"
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="confirmPassword" className="block text-white uppercase text-sm">
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                className="w-full p-2 rounded border font-sans border-gray-300 focus:outline-none"
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="firstName" className="block text-white uppercase text-sm ">
                First Name
              </label>
              <input
                type="text"
                id="firstName"
                value={firstName}
                onChange={e => setFirstName(e.target.value)}
                className="w-full p-2 rounded border font-sans border-gray-300 text-md focus:outline-none"
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="lastName" className="block text-white uppercase text-sm ">
                Last Name
              </label>
              <input
                type="text"
                id="lastName"
                value={lastName}
                onChange={e => setLastName(e.target.value)}
                className="w-full p-2 rounded border font-sans border-gray-300 text-md focus:outline-none"
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="maidenName" className="block text-white uppercase text-sm ">
                Maiden Name
              </label>
              <input
                type="text"
                id="maidenName"
                value={maidenName}
                onChange={e => setMaidenName(e.target.value)}
                className="w-full p-2 rounded border font-sans border-gray-300 text-md focus:outline-none"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="image" className="block text-white uppercase text-sm ">
                Profile Image
              </label>
              <input
                type="file"
                id="image"
                onChange={e => setImage(e.target.files[0])}
                className="w-full p-2 rounded border font-sans border-gray-300 text-md focus:outline-none"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="bday" className="block text-white uppercase text-sm ">
                Birthday
              </label>
              <input
                type="date"
                id="bday"
                value={bday}
                onChange={e => setBday(e.target.value)}
                className="w-full p-2 rounded border font-sans border-gray-300 text-md focus:outline-none"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-specialGreen active:bg-[#68855A] text-black uppercase py-2 mt-4 rounded transition-colors"
            >
              Register
            </button>
            <button
               type="button"
               onClick={() => navigate('/login')}
               className="w-full text-white py-2 transition-colors"
            >
              Back To Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Registration;
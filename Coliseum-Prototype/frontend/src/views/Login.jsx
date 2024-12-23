import React, { useState } from 'react';
import { getUser, login, setAuthToken } from '../api/apiService';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../contexts/UserContext';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const { token } = await login(email, password);
      localStorage.setItem('token', token);
      setAuthToken(token);
      const user = await getUser();

      console.log(user + 'user');
      if (user.role == 'ADMIN') {
        console.log('yurr');
        navigate('/admin/home');
        return;
      }

      setPassword(''); // Clear the password field
      navigate('/home');
    } catch (error) {
      console.log('Login failed:', error);
      setError('Invalid email or password');
      setPassword(''); // Clear the password field on error
    }
  };

  return (
    <div className="min-h-screen flex font-cinzel items-center justify-center p-4">
      <div className="bg-gold rounded-xl p-6 w-full max-w-sm">
        <div className="text-center text-fontBrown mb-3">
          <h1 className="text-3xl">COLISEUM</h1>
          <p className="text-sm mt-1">YOUR FRIENDS, YOUR FILTERS</p>
        </div>
        
        <div className="bg-iconRed rounded-lg p-4 text-center">
          <form onSubmit={handleSubmit} className="space-y-4 text-black">
            {error && <div className="text-red-500">{error}</div>}
            <div className="space-y-2">
              <label htmlFor="email" className="block uppercase text-sm">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full p-2 rounded border font-sans border-gray-300 text-md focus:outline-none bg-white text-black"
                required
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="password" className="block uppercase text-sm">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full p-2 rounded border font-sans border-gray-300 focus:outline-none bg-white text-black"
                required
              />
            </div>
            
            <button
              type="submit"
              className="w-full bg-specialGreen active:bg-[#68855A] text-black uppercase py-2 rounded transition-colors"
            >
              Login
            </button>
            
            <button
              type="button"
              onClick={() => navigate('/registration')}
              className="w-full text-white py-2 transition-colors"
            >
              Register
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
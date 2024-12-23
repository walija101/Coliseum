import React, { createContext, useState, useEffect } from 'react';
import { getUser } from '../api/apiService';

// Create a Context for the user
export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Initial state is null until user is fetched
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Fetch the user data (this could be from an API or localStorage)
  const getUser = async () => {
    try {
      // Replace with your actual logic to fetch the user (e.g., from an API or localStorage)
      if (localStorage.getItem('token')) {
        const userData = await getUser();
        setUser(userData);
        setIsAuthenticated(true);
      }
      else {
        throw new Error('No token found');
      }
    } catch (error) {
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  useEffect(() => {
    getUser(); // Get user on app load
  }, []);

  return (
    <UserContext.Provider value={{ user, isAuthenticated }}>
      {children}
    </UserContext.Provider>
  );
}

export const useUser = () => {
  const context = React.useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}
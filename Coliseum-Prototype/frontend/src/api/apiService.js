// src/api/apiService.js
import axios from 'axios';
import { send } from 'process';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:4000',
});

// Interceptor to add the token to every request
api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  response => {
    console.log("working");
    // check for newtoken in response
    if (response.data.newToken) {
      localStorage.setItem('token', response.data.newToken);
    }

    return response;
  },
  (error) => {
    if (error.status === 401) {
      console.log("yuh");
      localStorage.removeItem('token');
    }
    return Promise.reject(error);
  }
);

// Set token in headers for authenticated routes
export const setAuthToken = token => {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    console.log('added token');
  } else {
    console.log('no token found');
    delete api.defaults.headers.common['Authorization'];
  }
};

// Upload image route
export const uploadImage = async (file) => {
  console.log(file);

  const reader = new FileReader();

  return new Promise((resolve, reject) => {
    reader.onload = async () => {
      const arrayBuffer = reader.result;
      try {
        const response = await api.post('/upload/upload', arrayBuffer, {
          headers: {
            'Content-Type': 'application/octet-stream',
            'Content-Disposition': `attachment; filename="${file.name}"`,
          },
        });
        console.log(response.data);
        resolve(response.data);
      } catch (error) {
        console.log(error);
        reject(error);
      }
    };

    reader.onerror = () => {
      reject(new Error('File reading failed'));
    };

    reader.readAsArrayBuffer(file);

  });
};

export const getImage = async (path) => {
  const response = await api.get(`/upload/getImage`, {
    params: {path},
  });
  return response.data;
};

// MESSAGES & MATCHES
export const getUserMatches = async () => {
  const response = await api.get('/matches/user-matches');
  return response.data;
};

// **New endpoint**: get minimal list of matchIds for the authenticated user
export const getUserMatchIds = async () => {
  const response = await api.get('/matches/for-user');
  return response.data; // returns something like [{id: 1}, {id: 2}, ...]
};

// **New endpoint**: given matchIds, return chats
export const getChatsByMatchIds = async (matchIds) => {
  const response = await api.post('/chats/for-matches', { matchIds });
  return response.data; // returns array of chats [{id: 'chatid', matchId: x, messages: [...]}]
};

// Authentication API
export const login = async (email, password) => {
  console.log(email, password);
  const response = await api.post('/auth/login', { email, password });
  return response.data;
};

export const register = async (userData) => {
  const response = await api.post('/users/signup', userData);
  return response.data;
};

export const logout = async () => {
  const response = await api.post('/auth/logout');
  return response.data;
};

// User API
export const getProfile = async () => {
  const response = await api.get('/users/profile');
  return response.data;
};

export const getUserProfile = async (userId) => {
  console.log(userId);
  const response = await api.post('/users/userProfile', { userId });
  return response.data;
};

export const createProfile = async (profileData) => {
  const response = await api.post('/users/profile', profileData);
  return response.data;
};

export const getUser = async () => {
  const response = await api.get('/users/user');
  return response.data;
};

export const getAllUsers = async () => {
  const response = await api.get('/users/all-users');
  return response.data;
};

export const getAllUsersWithProfiles = async () => {
  const response = await api.get('/users/all-users-with-profiles');
  return response.data;
};

export const sendFriendRequest = async (friendId) => {
  const response = await api.post('/friend/send', { friendId });
  return response.data;
};

export const getNotifications = async () => {
  const response = await api.get('/users/notification');
  return response.data;
};

export const updateProfile = async (profileData) => {
  const response = await api.patch('/users/profile', profileData);
  return response.data;
};

export const getFriends = async () => {
  const response = await api.get('/friend/friends');
  return response.data;
};

export const addFriend = async (friendId, notificationId) => {
  const response = await api.post('/friend/add', { friendId, notificationId });
  return response.data;
};

export const deleteFriend = async (friendId) => {
  const response = await api.delete('/friend/delete', { data: { friendId } });
  return response.data;
};

export const declineFriendRequest = async (friendId, notificationId) => {
  const response = await api.post('/friend/decline', { friendId, notificationId });
  return response.data;
};

// Matching API
export const swipeUser = async (swipedUserId, direction) => {
  const response = await api.post('/matches/swipe', { swipedUserId, direction });
  return response.data;
};

export const getMatches = async () => {
  const response = await api.get('/matches');
  return response.data;
};

// Approval API
export const approveMatch = async (matchId, notificationId, sendingUserId) => {
  const response = await api.post('/approvals/approve', { matchId, notificationId, sendingUserId });
  return response.data;
};

export const denyMatch = async (matchId, notificationId, sendingUserId) => {
  const response = await api.post('/approvals/deny', { matchId, notificationId, sendingUserId });
  return response.data;
};

// Chat API
export const createChat = async matchId => {
  const response = await api.post('/chats', { matchId });
  return response.data;
};

export const viewChat = async (chatId) => {
  // Now we call the new endpoint that returns full chat data
  const response = await api.get(`/chats/${chatId}/full`);
  return response.data;
};

export const sendMessage = async (chatId, content) => {
  const response = await api.post('/chats/sendMessage', { chatId, content });
  return response.data;
};

export const getMatchById = async (matchId) => {
  const response = await api.get(`/matches/${matchId}`);
  return response.data;
};

// New endpoint: get a single match with all chats/messages the user can access
export const getFullMatchByIdForUser = async (matchId) => {
  const response = await api.get(`/matches/${matchId}/full`);
  return response.data;
};

export const getFullChatById = async (chatId) => {
  const response = await api.get(`/chats/${chatId}/full`);
  return response.data;
};


export default api;

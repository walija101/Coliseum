// src/pages/LoginPage.js
import React from 'react';
import LoginForm from '../components/LoginForm';

const LoginPage = ({ onLogin }) => (
  <div>
    <h2>Login</h2>
    <LoginForm onLogin={onLogin} />
  </div>
);

export default LoginPage;

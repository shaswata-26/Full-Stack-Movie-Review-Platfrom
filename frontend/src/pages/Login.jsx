import React from 'react';
import AuthForm from '../components/user/AuthForm';

const Login = () => {
  return (
    <div className="auth-page">
      <AuthForm mode="login" />
    </div>
  );
};

export default Login;
import React from 'react';
import AuthForm from '../components/user/AuthForm';

const Register = () => {
  return (
    <div className="auth-page">
      <AuthForm mode="register" />
    </div>
  );
};

export default Register;
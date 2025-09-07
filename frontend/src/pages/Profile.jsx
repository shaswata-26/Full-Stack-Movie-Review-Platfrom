import React from 'react';
import { useParams } from 'react-router-dom';
import UserProfile from '../components/user/Profile';

const Profile = () => {
  const { id } = useParams();
  
  return (
    <div className="profile-page">
      <UserProfile />
    </div>
  );
};

export default Profile;
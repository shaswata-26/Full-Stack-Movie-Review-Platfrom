const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

const debugUser = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/movie_review_db');
    
    const user = await User.findOne({ email: "admin@example.com" });
    
    if (user) {
      console.log('User found:');
      console.log('Email:', user.email);
      console.log('Password hash:', user.password);
      console.log('IsAdmin:', user.isAdmin);
      console.log('Username:', user.username);
      
      // Test with bcrypt
      const bcrypt = require('bcryptjs');
      const isMatch = await bcrypt.compare('adminpassword123', user.password);
      console.log('Password matches:', isMatch);
    } else {
      console.log('User not found!');
    }
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.connection.close();
  }
};

debugUser();
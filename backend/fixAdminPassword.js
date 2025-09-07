const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

const fixAdminPassword = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/movie_review_db');
    
    // Find the admin user
    const adminUser = await User.findOne({ email: 'admin@example.com' });
    
    if (adminUser) {
      console.log('Current password hash:', adminUser.password);
      
      // Set the password to 'adminpassword123' - the pre-save hook will hash it
      adminUser.password = 'adminpassword123';
      await adminUser.save();
      
      console.log('Password reset successfully!');
      console.log('New password: adminpassword123');
      console.log('Login with:');
      console.log('Email: admin@example.com');
      console.log('Password: adminpassword123');
    } else {
      console.log('Admin user not found');
    }
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.connection.close();
  }
};

fixAdminPassword();
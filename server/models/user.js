// Require the mongoose module 
const mongoose = require('mongoose'); 
const Schema = mongoose.Schema;


const chatRoomObject = {
  chatRoomId: {
      type: String
  },
  notifications: {
    type: Number
  },
  userId: {
    type: String
  }
}

const userSchemaObject = {
    username: {
        type: String,
        required: true,
        unique: true
      },
      // bio on default, will be created on its own when a User object is initialized
      bio: {
        type: String,
        default: "Add your bio here !"
      },
      email: {
        type: String,
        required: true,
        unique: true
      },
      password: {
        type: String,
        required: true
      },
      age: {
        type: Number,
        required: true,
        min: 14,
        max: 120
      },
      country: {
        type: String,
        required: false
      },
      gender: {
        type: String,
        required: false,
        enum: ['Male', 'Female', 'Other', 'Prefer not to say']
      },
      friends: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User' // reference to the User model
      }],
      friendRequests: [{
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User' // reference to the User model
      }],
      chatRooms: [chatRoomObject]
}

const mongooseSchema = mongoose.Schema(userSchemaObject);

module.exports = mongoose.model('User',mongooseSchema);
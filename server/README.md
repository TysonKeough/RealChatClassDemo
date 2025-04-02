# Build Your Own Chat App Server

This guide will teach you how to create a simple chat application server from scratch. By the end of this tutorial, you will have a working server that supports user authentication, friend management, chatroom creation, and message handling.


---

## Prerequisites
Before you begin, make sure you have the following installed:
1. **Node.js** (v14 or higher)
2. **MongoDB** 
3. **A Code Editor**  (e.g., VS Code) 
---

## Installation

### Step 1: Initialize Your Project

1. Create a new folder for your project:


2. Install the required dependencies:
   ```bash
   npm install express
   ```

3. Required dependencies:
    ```bash
    "dependencies": {
    "bcryptjs": "^3.0.2",
    "cookie-parser": "^1.4.7",
    "dotenv": "^16.4.7",
    "express": "^4.21.2",
    "express-flash": "^0.0.2",
    "express-session": "^1.18.1",
    "mongodb": "^6.14.2",
    "mongoose": "^8.12.1",
    "mongosh": "^2.4.2",
    "nodemon": "^3.1.9",
    "passport": "^0.7.0",
    "passport-local": "^1.0.0",
    "passport-local-mongoose": "^8.0.0",
    "save": "^2.9.0",
    "socket.io": "^4.8.1"
    }
    ```


---

### Step 2: Set Up the Project Structure

Create the following folder and file structure:
```
server/
├── models/         # Mongoose models for MongoDB
│   ├── user.js     
│   ├── chatroom.js 
│   └── message.js  
├── routes/         # Express routes
│   ├── user.js     
│   ├── chatroom.js 
│   ├── message.js  
│   └── friend.js
├── server.js       # Main server file
├── .env            # Environment variables
├── package.json    # Node.js dependencies and scripts
```

### Step 3: Set Up the ```.env``` File
Set Up the .env file in the root directory and add the following:
```bash
MONGO_CONNECTION=mongodb+srv://example.mongodb.net/
SESSION_SECRET=Secret123456789
```

### Step 4: Define the Models

#### User Model (`models/user.js`)
```javascript
// Require the mongoose module 
const mongoose = require('mongoose'); 
const Schema = mongoose.Schema;


const chatRoomObject = {
  chatRoomId: {
      type: String
  },
  notifications: {
    type: Number
  }
}

const userSchemaObject = {
    username: {
        type: String,
        required: true,
        unique: true
      },
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
```

#### Chatroom Model (`models/chatroom.js`)
```javascript
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const chatroomSchemaObject = {
     user1: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User' 
    },
    user2: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User' 
    }
};

const chatroomSchema = new Schema(chatroomSchemaObject);
module.exports = mongoose.model('Chatroom', chatroomSchema);
```

#### Message Model (`models/message.js`)
```javascript
const mongoose = require('mongoose'); 
const Schema = mongoose.Schema;

const messageSchemaObject = {
    chatroomId: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Chatroom',  // reference to the Chatroom model
        required: true  
    },
    username: {
        type: String
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',  // reference to the User model
        required: true 
    },
    content: {
        type: String,  
        required: true  
    },
    timestamp: {
        type: Date,  
        default: Date.now  
    }
};

const messageSchema = new Schema(messageSchemaObject);
module.exports = mongoose.model('Message', messageSchema);

```

---

### Step 5: Create the Routes

#### API Documentation

For detailed API routes and descriptions, please refer to the [API Routes Documentation](./routes/router.md).

### Step 6: Set Up the Server (Simple version)

#### Main Server File (`server.js`)
```javascript
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const createServer = require('http');
const Server = require('socket.io');
// and other modulus.....

//initialize express app
var app = express();

//mongoose connect
mongoose
.connect('ConnectionStringExample')
.then(() => { console.log('connected to mongo DB YEYEYEYEYE');
})
.catch((err) => {console.log('Error:',err);
});

// Routes
app.use("/api/user", require('./routes/user'));
app.use("/api/chatroom", require('./routes/chatroom'));
app.use("/api/message", require('./routes/message'));
app.use("/api/friend", require('./routes/friend'));

// Start the server
httpServer.listen(8080,() => {
  console.log(`Example app listening on port 8080`);
});
```

---

### Step 7: Run the Server

1. Start the server:
   ```bash
   cd server
   npm start
   ```

2. Once the server is running, you should see the following message in your terminal:
   ```
   MongoDB connected
   Server running on port 8080
   ```

3. Test the API endpoints using tools like [Postman](https://www.postman.com/) or [cURL](https://curl.se/).

---

Congratulations! You have successfully set up and run your chat app server.
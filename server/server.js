
const Message = require('./models/message');
const { grabNonSenderId, updateNotifications } = require('./middleware/web-socket');

const cors = require('cors');
var express = require('express');
// Websocket imports
const http = require('http');
const https = require('https');
const Server = require('socket.io');
//initialize express app
var app = express();

require('dotenv').config({ path: `.env.${process.env.NODE_ENV}` });  // This loads .env.production if NODE_ENV=production
console.log(`./.env.${process.env.NODE_ENV}`);
console.log(process.env.NODE_ENV);



const corsOptions = {
  origin: 'https://client.tysonk.com',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'HEAD'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}


// Or for specific domains (for production)
app.use(cors(corsOptions));






const httpServer = http.createServer(app);


const io = new Server.Server(httpServer, {
  cors: {
    origin: [
      "http://localhost:4200",              
      "https://realchatclient.onrender.com",  
      "https://client.tysonk.com"                  
    ],
  }
});




// Probably route callbacks to a websocket file here
io.on("connection", (socket) => {
  
  console.log("Someone Connected..");
  console.log("Socket id:", socket.id);


  

  // listen for initial data
  socket.on("credentials-pass", (userId) => {
    //set room to users ID
    console.log(`User with socket ID ${socket.id} just joined the room ${userId}`);
    socket.join(userId);
  });

  // disconnect listener
  socket.on("disconnect", (reason) => {
    // ...
    console.log("disconnect reason: ", reason);
  });

  //send on connection
  socket.emit("initial-connect", "Sending to client from server through websocket TEST...", socket.id);


  // Main listener from client for messages
  socket.on("message-form", async (payload) => {

    //give data to route to update model
    console.log("message-form socket event was hit from client with: ", payload);

    

    // grab other user id in that chatroom
    const secondUserId = await grabNonSenderId(payload.userId,payload.chatRoomId);

    console.log("second users ID: ",secondUserId);

    // Create new message document and save into database...
    const newMessage = new Message({
      chatroomId: payload.chatRoomId,
      username: payload.username,
      userId: payload.userId,
      content: payload.message
    });
    await newMessage.save();


    // update notifs for both people ?
    await updateNotifications(payload.userId, payload.chatRoomId);


    

    // emit to this sender
    socket.emit('message-update', payload.chatRoomId)

    // emit to the other user in their own ID room
    io.in(secondUserId).emit('message-update', payload.chatRoomId, secondUserId);

  });
  
});

// // Look for disconnect 
io.on("disconnect", (socket) => {
  console.log("Someone disconnected..");
  console.log("Socket id:", socket.id);
})





// require mongoose for mongoDB
var mongoose = require('mongoose');

var configurations = require('./configs/global');
var passport = require('passport');
var session = require('express-session');
var flash = require('express-flash');
const LocalStrategy = require('passport-local').Strategy;
const User = require('./models/user');
const encrypt = require('bcryptjs');




//import config,and passport
var cookieParser = require('cookie-parser')
  

// app.use(cors({origin: ['http://localhost:4200'], credentials:true, optionsSuccessStatus: 200}));
app.use(express.json());
app.use(cookieParser());





//startup express flash to show messages from sessions
app.use(flash());


// SESSIONS
// ----------------------------------------------------------------------------------------------------------
// initialize session
// this has to go before passport initialization
app.use(session({
  name: "RealChatUser",
  secret: "Secret123",
  resave: false,
  saveUninitialized: false,
  sameSite: 'none',
  secure: true,
  // httpOnly: true,
  partitioned: true,

  cookie: {
    domain: process.env.NODE_ENV === 'development' ? undefined : '.tysonk.com',
    maxAge: 60000 * 60,
  }
}));




app.use(passport.initialize());
// 
app.use(passport.session());

passport.serializeUser((user,done) => {
  console.log("serializing user.");
  done(null,user);
});

passport.deserializeUser((user,done) => {
  console.log('within De serialize..');
  done(null,user);
})



// Register Code
passport.use(
  'register',
  new LocalStrategy(
    {usernameField: "email", passwordField: "password", passReqToCallback: true},
    async (req,email,password,done) => {
      try {

        //check to make sure your email does not exist in the database
        let emailCheck = await User.findOne({ email });
        console.log(emailCheck);
        if(emailCheck != null){
          return done(null,false,{message: "Email already exists in", success: false, url: "", id:"", code: "ee"});
        }

        //hash password received from frontend with 10 salt rounds
        let hashedPassword = await encrypt.hash(password,10);
        
        let user = new User({email: email, username: req.body.username, password: hashedPassword, age: req.body.age});
        // commit data to DB
        await user.save();
        // call done and user should be logged in from here
        done(null,user,{message: "User registered successfully..."});
      }
      
      catch (error) {
        return done(error);
      }

    }
  )
);


// Set strategy to use
passport.use(
  'login',
  new LocalStrategy({usernameField: "email", passwordField: "password"}, async (email,password,done) => {

    try {
      let user = await User.findOne({ email });

      if(!user){
        console.log('user is not found....');
        return done(null,false, {message: "User not found in Database!", success: false, url: "", id:"", code: "unf"});
      }

      console.log("user object in login...",user.password);

      let isCorrectPassword = await encrypt.compare(password,user.password);
        console.log("is correct password : ", isCorrectPassword);


      

      if(isCorrectPassword){
        return done(null,user, {message: "User found, and is going to be logged.."});
      }
      else{
        return done(null,false,{message: "Password did not match!", success: false, url: "", id:"", code: "npm"});
      }
    } 
    catch (error) {
      return done(error);
    }
  })
);
// --------------------------------------------------------------------------------------------------------------------------------


console.log(process.env.NODE_ENV);
if(process.env.NODE_ENV === 'development'){
  console.log("environment is: ",process.env.ENVIRONMENT_CURRENT);
}
else{
  console.log("environment is: ", process.env.ENVIRONMENT_CURRENT);

}

//mongoose connect
mongoose
.connect(process.env.NODE_ENV === 'development' ? process.env.MONGO_CONNECTION : process.env.MONGO_CONNECTION)
.then(() => { console.log('connected to mongo DB YEYEYEYEYE');
})
.catch((err) => {console.log('Error:',err);
});


// Routes
app.use("/api/user", require('./routes/user'));
app.use("/api/chatroom", require('./routes/chatroom'));
app.use("/api/message", require('./routes/message'));
app.use("/api/friend", require('./routes/friend'));


httpServer.listen(8080,() => {
  console.log(`Example app listening on port 8080`);
});




  





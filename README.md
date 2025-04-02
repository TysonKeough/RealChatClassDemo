# Step 1
## Run npm i in the server and chatApplication to install the node modules for Socket.io.

# Server-side
# Step 2
## Connect Socket.io to server and create io listener for reserved connection class.

```
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
});
```

# Step 3
## Add listener for "credentials-pass" and an emit for inital connect to let client know we are connected.
## Add listeners for socket/io reserve disconnect class.


```
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

});

// // Look for disconnect 
io.on("disconnect", (socket) => {
  console.log("Someone disconnected..");
  console.log("Socket id:", socket.id);
})
```
# Step 4
## Add socket listener for "message-form" and add socket emit for "message-update".



```
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
```
# Client-Side
# Step 5
## Create socket variables. 
## Create socket listener for reserved class "connect" and socket listener for "initial-connect".
## Create socket emitter for "credentials-pass".
## Create socket listener for reserved class "disconnect" and disconnect function to be called when user logs out.
```
// Store current websocket id here
  curSocketId = '';

  // store current socket connection here
  curSocket: any = null;

  
  establishSocket() {
    console.log("establish socket function called...");
    const socket = io(environment.apiSocket);
    this.curSocket = socket;

  // client-side receiving connect response from server socket...
  socket.on("connect", () => {
    console.log("Socket Connect ID: ", socket.id); // x8WIv7-mJelg7on_ALbx
    console.log("Socket Status:", socket.connected);

    setTimeout(() => {
      socket.emit('credentials-pass', this.profileService.userData);

    },5000);
  });

  // disconnect emit from server side...
  socket.on("disconnect", (reason, details) => {
    console.log("Socket Disconnect ID:",socket.id);
    console.log("Reason for Socket Disconnect: ",reason);
    console.log("Details of Socket Disconnect: ",details)
  });

  socket.on("initial-connect", (message, socketId) => {
    console.log("received test socket message: ",message);
    this.curSocketId = socketId;
  });

  }

  // disonnect client to server socket connection when logout is pressed...
  clientDisconnect() {
    console.log("client disconnect function called...");

    //disconnect
    this.curSocket.disconnect();

    this.curSocket.on("disconnect", () => {
      console.log("ClientDisconnect Function - Socket Disconnect ID:",this.curSocket.id); // undefined
    });
  }
  ```
# Step 6
## Create emit message function that emits on the socket for "message-form" to send message data.
## Create a listener on the socket called "message-update" that will receive updates for new messages.

```
// Store current websocket id here
  curSocketId = '';

  // store current socket connection here
  curSocket: any = null;

  
  establishSocket() {
    console.log("establish socket function called...");
    const socket = io(environment.apiSocket);
    this.curSocket = socket;

  // client-side receiving connect response from server socket...
  socket.on("connect", () => {
    console.log("Socket Connect ID: ", socket.id); // x8WIv7-mJelg7on_ALbx
    console.log("Socket Status:", socket.connected);

    setTimeout(() => {
      socket.emit('credentials-pass', this.profileService.userData);

    },5000);
  });

  // disconnect emit from server side...
  socket.on("disconnect", (reason, details) => {
    console.log("Socket Disconnect ID:",socket.id);
    console.log("Reason for Socket Disconnect: ",reason);
    console.log("Details of Socket Disconnect: ",details)
  });

  socket.on("initial-connect", (message, socketId) => {
    console.log("received test socket message: ",message);
    this.curSocketId = socketId;
  });


  // Receive chatroom updates from server via socket for own messages or other user messages...
  // Will want to either store notifications for that chatroom for this user, or update the chatroom via GET
  socket.on("message-update", (chatRoomId: string, secondUserId: string) => {
      console.log("message-update has been received: ",chatRoomId);

      // Want to let chatroom component to update and GET all messages
      // If chatroom id matches
      if(chatRoomId == this.friendService.curChatroomId) {
        this.changeMyVariable(true);
      }
    


  });


  }


  // disonnect client to server socket connection when logout is pressed...
  clientDisconnect() {
    console.log("client disconnect function called...");

    //disconnect
    this.curSocket.disconnect();

    this.curSocket.on("disconnect", () => {
      console.log("ClientDisconnect Function - Socket Disconnect ID:",this.curSocket.id); // undefined
    });

  }

  // emit data from client for message just sent...
  emitMessage(payload : {chatRoomId: string, userId: string | undefined, message: string | null | undefined, username: string | undefined}) {
    console.log("within emit message");

    this.curSocket.emit("message-form", payload);
  }
  ```
# Step 7
## Run the code and you will see the websockets are connected in the server logs.

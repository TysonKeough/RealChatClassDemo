# API Routes Documentation

## User Routes

### POST /api/user/test
- **Description**: Test route to check if the API is working.
- **Request Body**: `{ message: String }`
- **Response**: `{ message: "Test api route is working real well !!!." }`

### GET /api/user
- **Description**: Get all users.
- **Response**: Array of user objects.

### GET /api/user/me
- **Description**: Get the current authenticated user's data.
- **Response**: `{ user: UserObject }`

### DELETE /api/user/:id
- **Description**: Delete a user by ID.
- **Response**: `{ message: "Item was deleted !" }`

### POST /api/user/new
- **Description**: Register a new user.
- **Request Body**: User registration data.
- **Response**: Success or error message.

### POST /api/user/login
- **Description**: Login an existing user.
- **Request Body**: User login data.
- **Response**: Success or error message.

### POST /api/user/logout
- **Description**: Logout the current user.
- **Response**: `{ message: "Logout received..." }`

### POST /api/user/isGood
- **Description**: Check if the user is authenticated.
- **Response**: `{ isAuthenticated: Boolean }`

### POST /api/user/friend/request/:username
- **Description**: Send a friend request to a user by username.
- **Response**: `{ msg: 'Friend request sent' }`

### POST /api/user/friend/accept/:id
- **Description**: Accept a friend request by user ID.
- **Response**: `{ msg: 'Friend request accepted', userIds: [userId, friendId] }`

### POST /api/user/friend/reject/:id
- **Description**: Reject a friend request by user ID.
- **Response**: `{ msg: 'Friend request rejected' }`

### POST /api/user/friend/remove/:id
- **Description**: Remove a friend by user ID.
- **Response**: `{ msg: 'Friend removed' }`

### GET /api/user/friend/getList
- **Description**: Get the current user's friends list.
- **Response**: Array of friend objects.

### GET /api/user/friend/request
- **Description**: Get the current user's friend requests.
- **Response**: Array of friend request objects.

## Chatroom Routes

### POST /api/chatroom/new
- **Description**: Create a new chatroom.
- **Request Body**: `{ users: [user1Id, user2Id] }`
- **Response**: Chatroom object.

### GET /api/chatroom
- **Description**: Get all chatrooms.
- **Response**: Array of chatroom objects.

### GET /api/chatroom/:id
- **Description**: Get a chatroom by user ID.
- **Response**: Chatroom object.

### DELETE /api/chatroom/:id
- **Description**: Delete a chatroom by ID.
- **Response**: `{ msg: 'Chatroom deleted successfully' }`

## Message Routes

### POST /api/message/new
- **Description**: Create a new message.
- **Request Body**: `{ chatRoomId: String, userId: String, message: String }`
- **Response**: Message object.

### GET /api/message
- **Description**: Get all messages.
- **Response**: Array of message objects.

### GET /api/message/:chatroomId
- **Description**: Get all messages for a specific chatroom.
- **Response**: Array of message objects.

### DELETE /api/message/:id
- **Description**: Delete a message by ID.
- **Response**: `{ msg: 'Message deleted successfully' }`
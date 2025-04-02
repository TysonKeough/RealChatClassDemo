const express = require('express');
const router = express.Router();
const Chatroom = require('../models/chatroom');
const Message = require('../models/message');
const User = require('../models/user');

// create a new chatroom
router.post('/new', async (req, res) => {
  const { users } = req.body;
  console.log("inside post new chatroom...");

  try {
    console.log(req.body);
    const chatroom = new Chatroom({
      // name: name,
      user1: users[0],
      user2: users[1]
    });

    await chatroom.save();

    //update both users to include chatroom id and notifications
    // const userOne = await User.findById(users[0]);
    // const userTwo = await User.findById(users[1]);

    //update user documents
    // await User.updateOne({_id: users[0]}, {$set: {chatRooms: {chatRoomId: chatroom.id, notifications: 0, userId:users[1]}}});
    // await User.updateOne({_id: users[1]}, {$set: {chatRooms: {chatRoomId: chatroom.id, notifications: 0, userId:users[0]}}});

    await User.updateOne({_id: users[0]}, {$push: {chatRooms: {chatRoomId: chatroom.id, notifications: 0, userId:users[1]}}});
    await User.updateOne({_id: users[1]}, {$push: {chatRooms: {chatRoomId: chatroom.id, notifications: 0, userId:users[0]}}});



    
    res.status(201).json(chatroom);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// get all chatroom
router.get('/', async (req, res) => {
  try {
    const chatrooms = await Chatroom.find();
    res.status(200).json(chatrooms);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// get a chatroom by id
// Receives FRIEND that is clicked on's ID, and NOT CHATROOM ID
router.get('/:id', async (req, res) => {
  try {
    console.log("Within grabbing chatroom id to set....");

    console.log("GET charoom: ",req.user);
    console.log("GET chatroom id: ",req.user._id);

    const userId = req.user._id;
    const friendId = req.params.id;
    // const reqIds = [req.user._id, req.params.id];
    console.log("uuserid: ",userId);
    console.log("friendId: ",friendId);

    // const chatroom = await User.find({ users: [{ _id:  { $in: reqIds}}]});
    const chatroom = await Chatroom.findOne({
      $or: [
        { user1: friendId, user2: userId },
        { user1: userId, user2: friendId }
      ]
    });

    // const chatroom = await Chatroom.findById(req.params.id);
    // const chatroom2 = await Chatroom.findOne({user1: friendId, user2: userId});
    
    // const chatroom = await User.find({ _id: { $in:req.user.friendRequests }});
    // console.log("chatroom 2 ob: ", chatroom2);
    console.log("chatroom object is: ", chatroom);

    if (chatroom) {
      res.status(200).json({id: chatroom._id});
      console.log("chatroom found and sent back in response...");
    }
    // else if(chatroom2){
    //   res.status(200).json({id: chatroom2._id});
    // }
    else{
    res.status(404).json({ msg: 'Chatroom not found to match both user ids.' });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// delete a chatroom by id
router.delete('/:id', async (req, res) => {
  try {
    // const chatroom = await Chatroom.findById(req.params.id);

    // if (!chatroom) {
    //   return res.status(404).json({ msg: 'Chatroom not found' });
    // }

    await Chatroom.deleteOne({_id: req.params.id});
    res.status(200).json({ msg: 'Chatroom deleted successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
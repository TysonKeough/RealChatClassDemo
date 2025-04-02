const express = require('express');
const router = express.Router();
const Message = require('../models/message');
const Chatroom = require('../models/chatroom');
const User = require('../models/user');
const chatroom = require('../models/chatroom');

// create a new message
router.post('/new', async (req, res) => {
  const { chatRoomId, userId, message, username } = req.body;

  try {
    console.log("inside new messages....");
    // console.log("req body here...", req.body);
    // const chatroom = await Chatroom.findById(chatroomId);
    // const user = await User.findById(userId);

    // if (!chatroom || !user) {
    //   return res.status(404).json({ msg: 'Chatroom or User not found' });
    // }

    const newMessage = new Message({
      chatroomId: chatRoomId,
      username: username,
      userId: userId,
      content: message
    });

    await newMessage.save();

    // add the message to the chatroom's messages array
    // chatroom.messages.push(newMessage._id);
    // await chatroom.save();

    res.status(201).json({content: message});
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Get all messages in collection
router.get('/', async (req,res) => {
  console.log("GET message route has been hit!!!");
  try{
    const messages = await Message.find();
    res.status(200).json(messages);
  }
  catch (err) {
    res.status(500).send('Server error MESSAGES HEHE');
  }

});

// get all messages for a chatroom
router.get('/:chatroomId', async (req, res) => {
  try {
    const messages = await Message.find({ chatroomId: req.params.chatroomId });
    res.status(200).json(messages);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// delete a message by id
router.delete('/:id', async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);

    if (!message) {
      return res.status(404).json({ msg: 'Message not found' });
    }

    await message.remove();
    res.status(200).json({ msg: 'Message deleted successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});


router.post('/notif/:id', async (req,res) => {

  const { chatRoomId } = req.body;
  try {

    // const user = User.findById(req.params.id);
    // await User.updateOne({_id: req.params.id}, {chatRooms: { chatRoomId: req.params.id, notifications: { $gt: -1 }}},{$set: {$inc: {notifications: 1}}});  
    await User.updateOne({_id: req.params.id, 'chatRooms.chatRoomId': chatRoomId}, { $inc: { 'chatRooms.$.notifications': 1 } });  

    console.log(req.params.id);
    console.log("updating notifications for dogs, hititititt");

    res.status(200).json({message: "notif route hit!"});




  }catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }

});


router.post('/notif/remove/:id', async (req,res) => {

  const { chatRoomId } = req.body;
  try {

    await User.updateOne({_id: req.params.id, 'chatRooms.chatRoomId': chatRoomId}, { $set: { 'chatRooms.$.notifications': 0 } });  
    console.log("clearing notifs...");


  }catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }

});



module.exports = router;
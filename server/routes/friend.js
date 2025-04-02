const User = require('../models/user');
const passport = require('passport');
const express = require('express');
const encrypt = require('bcryptjs');
//main router to 
const userRoutes = express.Router();

const { test } = require('../middleware/web-socket');



// send friend request
userRoutes.post('/request/:username', async (req, res) => {
    try {
        // res.status(200).json({ msg: 'servers not fucked' });
        const user = await User.findById(req.user._id);
        const friend = await User.findOne({username: req.params.username});


        if(user.id === friend.id){
            return res.status(404).json({ msg: 'Cannot add yourself...' });
        }

        if (!friend) {
            return res.status(404).json({ msg: 'User not found' });
        }

        if (friend.friendRequests.includes(user.id)) {
            return res.status(400).json({ msg: 'Friend already added.' });
        }

        friend.friendRequests.push(user.id);
        await friend.save();

        res.status(200).json({ msg: 'Friend request sent' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// accept friend request
userRoutes.post('/accept/:id', async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        const friend = await User.findById(req.params.id);

        if (!friend) {
            return res.status(404).json({ msg: 'User not found' });
        }

        if (!user.friendRequests.includes(friend.id)) {
            return res.status(400).json({ msg: 'No friend request from this user' });
        }

        user.friends.push(friend.id);
        user.friendRequests = user.friendRequests.filter(id => id.toString() !== friend.id.toString());
        await user.save();

        friend.friends.push(user.id);
        await friend.save();
        
        // Create chatroom for both of these users... 



        res.status(200).json({ msg: 'Friend request accepted', userIds: [req.user._id,req.params.id] });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// get friends list
userRoutes.get('/getList', async (req, res) => {

    console.log("GET friends list route hit !!!");
    try {
        const user = await User.findById(req.user._id).populate('friends', 'username chatRooms');
        // const user = await User.findById(req.user._id);

        console.log(user.friends);
        console.log("friends object ?",user);
        res.status(200).json(user.friends);

        

        //test websocket sent back to client side...
        //test();


    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error GET FREINDS CATCH HEHE');
    }
});

// get friend requests
userRoutes.get('/request', async (req, res) => {

    console.log("GET friends request route hit !!!");

    console.log("req user in Friend requests: ", req.user);

    try {
        // if(!req.user.friendrequests || res.user.friendRequests.length === 0){
        //     res.status(500);
        // }
        // const user = await User.findById(req.user.id).populate('friendRequests', 'username');
       // const user = await User.find({ _id: { $in: req.user.friendRequests } });

       const user = await User.findById(req.user._id)
       .populate('friendRequests', 'username');
        
        console.log("user requests: ",user);
        // console.log("user into friend requests: ", user.friendRequests);

        res.status(200).json(user.friendRequests);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error from catch HEHE');
    }
});

// reject friend request
userRoutes.post('/reject/:id', async (req, res) => {
    console.log("friend rejection hit..");
    try {
        const friendId = req.params.id;
        const userId = req.user._id;
        const user = await User.findById(userId);

        console.log(friendId);
        console.log(userId);
       
        const friendRequests = user.friendRequests.filter((id) => id.toString() !== friendId.toString());

        console.log(friendRequests);

        await User.updateOne({_id: userId}, {$set: {friendRequests: friendRequests}});   

        res.status(200).json({ msg: 'Friend request rejected' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

userRoutes.post('/remove/:id', async(req,res) => {

    console.log("friend rejection hit..");
    try {
        const userId = req.user._id;
        const user = await User.findById(userId);
        const friend = await User.findById(req.params.id);


        const userFriends = user.friends.filter((id) => id.toString() !== req.params.id);

        const friendFriends = friend.friends.filter((id) => id.toString() !== userId);

        await User.updateOne({_id: req.params.id}, {$set: {friends: friendFriends}});

        // Update user with new friends list...
        await User.updateOne({_id: userId}, {$set: {friends: userFriends}});   

        res.status(200).json({ msg: 'Friend request rejected' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = userRoutes;
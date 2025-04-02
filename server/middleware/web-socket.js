

const io = require("../server");
const User = require('../models/user');
const Chatroom = require('../models/chatroom');





const test = () => {
    console.log("tester called hehehehehehehehehehee");
    // io.engine.emit("test-bitch", "penis fuck shit");
}

const grabNonSenderId = async (userId, chatRoomId) => {
    console.log(userId,chatRoomId,"grabber hehe");

    //grab chatroom by id
    const chatroom = await Chatroom.findById(chatRoomId);
    console.log("chatroom body:",chatroom);

    //and then search for the id that DOES NOT equal userId
    if(chatroom.user1 != userId) {
        return chatroom.user1.toString();
    }
    else{
        return chatroom.user2.toString();
    }
}


const updateNotifications = async (userId, chatRoomId) => {

    console.log("updating notifs hehehehe");
    try {
        console.log("updating notifs for: ",userId);
        // const user = User.findById(req.params.id);
        // await User.updateOne({_id: req.params.id}, {chatRooms: { chatRoomId: req.params.id, notifications: { $gt: -1 }}},{$set: {$inc: {notifications: 1}}});  
        await User.updateOne({_id: userId, 'chatRooms.chatRoomId': chatRoomId}, { $inc: { 'chatRooms.$.notifications': 1 } });  
    
      }catch (err) {
        console.error(err.message);
      }

}


// module.exports.test = test;

module.exports = {
    test,
    grabNonSenderId,
    updateNotifications
}




// module.exports = socketToClient();


// module.exports = (io, socket) => {
//     const testCall = (payload) => {

//         socket.emit("tester","TEST this is TEST TEST this is TEST");
//       // ...
//     //   return "well this is a test this is a test this is a test this is a test";
//     }
  
//     // const readOrder = (orderId, callback) => {
//     //   // ...
//     // }
  
//     // socket.emit("tester",testCall);
      
//   }



const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const chatroomSchemaObject = {
    // name: {
    //     type: String,
    //     required: true,
    //     unique: true
    // },
    // users: [{
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'User' 
    // }] 
    // array of User references( 2+ users in a chatroom)
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
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

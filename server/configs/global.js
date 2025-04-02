//application level config object

require('dotenv').config();

//config object
const configurations = {
    ConnectionStrings:{
        MongoDB: process.env.MONGO_CONNECTION
    }
}

module.exports = configurations;
var localStrategy = require('passport-local').Strategy;
// var LocalMongoose = require('')
const User = require("./models/user");
// const encrypt = require('bcryptjs');

//startup passport 
function initializePassport(passport, getUserById){


    // main authentication method. checks email and password 
    const authenticateUser = async (username, password, done) => {

        
        console.log('in passport authenticate function');
        try {
            //const hashedPassword = await encrypt.hash(password,10);
            const user = await User.findOne({email: username});
            
            // const unHashedPassword = await encrypt.compare(password,user.password);
            console.log("password is: ",password);
            //check the email to see if it matches
            if(user === null){
                console.log('user: ',user);
                console.log("user is null still...")
                return done(null, false, { message: 'No user with that email.'});
            }
            // check if the password matches the db (add bcrypt at some point for more secure password storage...)
            else{
                // console.log('users password: ',user.password);

                console.log('User has been found...');
                return done(null, user);
            } 
        } 
        catch (err){
            return done(err);
        }

    }


    //setup a local strategy to handle login authentication
    // passport.use(new localStrategy({usernameField: 'email' }, authenticateUser));
    passport.use(new localStrategy({usernameField: 'email' }, authenticateUser));

    //serialize the user
    passport.serializeUser((user, done) => {
        
        done(null, {id: user.id, username: user.username});
        
    });

    //Deserialize the user
    passport.deserializeUser(async (user, done) => {
        return done(null, user);
    });

}


module.exports = initializePassport;



const passport = require('passport');
const strat = require('passport-local-mongoose');
// const encrypt = require('bcryptjs');


// export default passport.use(
//     new strat.Strategy({usernameField: "email"}, async (username, password, done) => {

//         // search for user
//         try {
//             const user = await User.findOne({email: username});
//             if(user === null) {
//                 throw new Error("user not found");
//             }
//             else{
//                 const unHashedPassword = await encrypt.compare(password,user.password);
//                 // password does match, good to authenticate...
//                 if(unHashedPassword){
//                     done(null,user);
//                 }
//                 // password does not match
//                 else{

//                 }
//             }
//         } catch (error) {
//             console.log(error); 
//             done(error,null);
            
//         }
        
//     })
// );
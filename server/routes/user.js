
const User = require('../models/user');
const passport = require('passport');
const express = require('express');
const encrypt = require('bcryptjs');
//main router to 
const userRoutes = express.Router();

// --------------------------------------------------------------


userRoutes.post("/test", function(req,res) {
    console.log("test api route was hit !!!");
    console.log("message from the front:", req.body.message);
    res.status(200).json({message: "Test api route is working real well !!!."});
  });


//handle user account posts when path is just '/api/user'

//GET - when path is '/api/user'
userRoutes.get("/", async (req,res,next) => {

    let users = await User.find();
    console.log("GET Request received, and is working !")
    return res.status(200).json(users);
});

//GET - a users friends


//GET - get a specific user by id
userRoutes.get("/me", async (req, res) => {
    console.log("GET ME route has been hit !!!");
    
    try{
        console.log("NEW NEW DAVIS DAVIS DAVIS req user", req.user);
        // send back user data for themselves by grabbing their user data from 'req.user'
        res.status(200).json({user: req.user});
    } catch (error) {
        console.log("error occurred while running get me!");
        console.log("Caught the Error: ", error);
        res.status(500).json({user: "user is undefined... HEHEHEHE this is us"});
    }    
    
});


// DELETE a user 
userRoutes.delete("/:id", async (req,res) => {
    console.log("within delete user...");
    try {
        //grab id from url path with 'req.params.id'
        const result = await User.findByIdAndDelete(req.params.id);
        console.log("result: ", result);

        if(result){
            res.status(200).json({message: "Item was deleted !"});
        }
        else{
            res.status(500).json({message: "Error occurred while deleting the item!"});
        }
    }
    catch (error) {
        console.log("error occurred while running delete!");
        console.log("Caught the Error: ", error);
    }
})



// -----------------------------------------------------------------------------------------

// REGISTER - a new user
userRoutes.post(
    "/new",
    function(req,res,next) {
        console.log("inside register POST... Pre auth function.");
        passport.authenticate("register", async (err,user,info) =>{

            console.log("err",err);
            console.log("user",user);
            console.log("info: ",info);

            // dont login, or run register code for this register attempt
            if(!user){
                
                if(info.code == "ee"){
                    res.status(200).send(info);
                    console.log("response sent: email already exists!!!");
                    // next();
                }
            }
            // error happened during register authentication
            else if(err){
                res.status(500).send({message:"Register Error",success: false, url: "", id: "", code: "Register Error"});
            }
            // if user exists then auth is fine, so we log the user in...
            else{
                req.login(user, async (error) => {
                    console.log("register error....",error);
                    console.log("User logged in !");
                    // return res.redirect('profile');
                    next();
                });
                
                // res.status(200).send({message: "Hello, register auth works !!!", success: true, url: "/profile", id: req.user.id, code:"success"});
            }
        })(req,res,next);
    },
    (req,res,next) => {
        console.log('is auth: ', req.isAuthenticated());
        try {
            if(req.user){
                console.log("User created ! Sending back response.");
                res.status(200).send({message: "Hello, register auth works !!!", success: true, url: "/home", id: req.user.id, code:"success"});
            }
            else{
                console.log("register un-successful !");
                res.status(200).send({message: "register unsuccessful!",success: false, url: "", id: "", code: "bad register"});
            }
        }
        catch (error) {
            console.log(error);
            res.status(200).send({message: "Error: register bad + Error!",success: false, url: "", id: "", code: "bad register Error"});
        }
    }
);

// LOGIN - login an existing user
userRoutes.post(
    "/login",
    function(req,res,next) {
        console.log("inside login post... Pre auth function.");
        // call next function in line, which is the one below here. 'passport.authenticate()'
        // next();

        passport.authenticate("login", async (err,user,info) =>{

            console.log("err",err);
            console.log("user",user);
            console.log("info: ",info);

            // dont login, or run register code for this register attempt
            if(!user){
                // user not found
                if(info.code == "unf"){
                    res.status(200).send(info);
                    console.log("response sent: user not found");
                    // next();
                }
                // no password match
                else if(info.code == "npm"){
                    res.status(200).send(info);
                    console.log("response sent: password did not match");
                }
            }
            // error happened during login authentication
            else if(err){
                res.status(500).send({message:"Login Error",success: false, url: "", id: "", code: "Login Error"});
            }
            // user found so we log them in and go to next function to send response
            else{
                req.login(user, async (error) => {
                    // console.log("login error....",error);
                    console.log("logging them in");

                    

                    // console.log("setting cookie manually now.........");



                    // return res.redirect('profile');
                    next();
                });
            }

        })(req,res,next);
    },
    (req,res,next) => {
        console.log('is auth: ', req.isAuthenticated());
        try {

            // Manually set the session cookie for cross-origin
            // res.cookie('RealChatUser', req.sessionID, {
            //     httpOnly: true,
            //     secure: true,           // Only sent over HTTPS
            //     sameSite: 'None',       // For cross-origin requests
            //     // domain: '.realchatwebapp.onrender.com', // Set this to your production domain
            //     maxAge: 60000 * 60,     // 1 hour cookie expiration
            //     path: '/',              // Cookie path
            //     partitioned: true
            // });

            // console.log(res);
            console.log("this is the session... ", req.session);
            
            if(req.user){
                console.log("Req user right after login: ", req.user);
                console.log("Login Successful !");
                res.status(200).send({message: "Login was successful", success: true, url: "/home", id:req.user.id, code: "sl"});
            }
            else{
                console.log("login un-successful !");
                res.status(200).send({message:"Login unsuccessful",success: false, url: "", id: "", code: "Login Bad"});

            }
        }
        catch (error) {
            console.log(error);
            res.status(200).send({message:"Login Error",success: false, url: "", id: "", code: "Login Error"});
        }
       
    }
);



// Logout route...
userRoutes.post('/logout', (req, res, next) => {
    console.log("logout has been called....");
  req.logout(function(err) {
    console.log("logout has been called and ran...");
    if (err) { return next(err); }
    res.status(200).json({message: "Logout received..."})
  });
});


// isAuthenticated -  check is user is authenticated
userRoutes.post('/isGood', (req,res,next) => {
    console.log("Is auth route has been called...");
    try {
        console.log('request object: ',req.isAuthenticated());
        // res.status(200).json({isAuth: true});
        if(req.isAuthenticated()){
            res.status(200).json({isAuthenticated: true});
        }
        else{
            res.status(200).json({isAuthenticated: false});
        }
    } catch (error) {
        res.status(500).json({error: error});
    }
   
});



module.exports = userRoutes;


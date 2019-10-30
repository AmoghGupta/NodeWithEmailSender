const AuthModel = require("../models/auth");
const bcrypt = require("bcryptjs");
const isAuthenticated = require("../controllers/products").isAuthenitcatedUsingSession;
const sgMail = require('@sendgrid/mail');

sgMail.setApiKey("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");




const getSignUp = (req, res, next)=>{

    isAuthenticated(req,res).then((data)=>{
        res.redirect('/');
     }).catch((err)=>{
        res.render('signup', {
            pageTitle: 'Signup to the Node App',
            signUpPage:true
        });
     });
    
};

const postSignUp = (req, res, next)=>{
   
    AuthModel.findByEmailId(req.body.email).then((user)=>{
        console.log(user);
        if(user){
            return res.status(200).json({ message: "User already exists" });
        }
        //hasing the password, with salt 12
        bcrypt.hash(req.body.password, 12).then((hashedPassword)=>{
            const user = new AuthModel({
                email: req.body.email,
                password: hashedPassword
            });
            user.save().then((data)=>{
                console.log(data, "is saved");
                // once signedup send an email to user
                const msg = {
                    to: 'gupta.amogh15@gmail.com',
                    from: 'gupta.amogh15@gmail.com',
                    subject: "Singup succeded",
                    html: '<h1>You have signed up successfully</h1>'
                };
                sgMail.send(msg);
                res.status(200).json({ message: "User created successfully" });
            }).catch((err)=>{
                console.log("ERROR SIGNING UP NEW USER: ",err);
            })
        });
    }).catch((err)=>{
        console.log("ERROR CONNECTING TO USER AUTH DB: ",err);
    })
    
};


const getLogin = (req, res, next)=>{

    isAuthenticated(req,res).then((data)=>{
       res.redirect('/');
    }).catch((err)=>{
        res.render('login', {
            pageTitle: 'Login in to Node App',
            loginPage:true
        });
    });

    
}

const postLogin = (req, res, next)=>{

    // Cookies = Client side data (stored in visitors browser)
    //setting the cookie to logged in 
    // res.cookie('loggedIn',"true", { 
    //     maxAge: 900000, 
    //     //basically it means you cannot set this cookie from Javascript
    //     httpOnly: true,
    //     // cookie will be only when server is https
    //     // secure: true
    // });


    // Sessions = Server side data (are stored on server)
    // The session is stored on the server but it needs a cookie to store an 
    // indicator of who is requesting the session value.
    //req.session.isLoggedIn = true;



    AuthModel.findByEmailId(req.body.email).then((user)=>{
        if(!user){
            return res.status(200).json({ message: "Invalid login1" });
        }
        bcrypt.compare(req.body.password, user.password).then((doMatch)=>{
            if(!doMatch){
                return res.status(200).json({ message: "Invalid login2" });
            }else{
                // if passwords match 
                // setting session to logged in and saving user info
                // saving the session in session storage on server 
                req.session.isLoggedIn = true;
                req.session.user = user;
                req.session.save();
                return res.redirect('/');
            }
        }).catch((error)=>{
            console.log("something went wrong1! ", error)
        });
    }).catch((error)=>{
        console.log("something went wrong2! ", error)
    });
}



exports.postSignUp = postSignUp;
exports.getSignUp = getSignUp;
exports.getLogin = getLogin;
exports.postLogin = postLogin;

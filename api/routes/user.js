//Developer : Aditya Gadhvi (B00809664)

const express = require('express');
const User=require("../models/user");
const Organization=require("../models/organizations");
const bcrypt=require("bcrypt");
const mongoose=require("mongoose");
const jwt=require("jsonwebtoken");
const router = express.Router();
const randomstring = require('randomstring');
const nodemailer = require('nodemailer');

//The following code will save the personal users details and register them and store these details into the database.  
router.post("/signup_user", (req,res,next)=>{

    const secretToken = randomstring.generate();

    bcrypt.hash(req.body.password,10)
    .then(hash=>{
        const user=new User({
            _id:new mongoose.Types.ObjectId(),
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            phoneNumber: req.body.phone,
            email:req.body.email,
            password: hash,
            user_type:"personal",
            user_creation_date: Date(),
            secretToken: secretToken,
            isActive: false
        });
        user.save()
        .then(result=>{
            res.status(201).json({
                message:'personal user created!',
                result:result
            });
        })
        .catch(err=>{
            res.status(500).json({
                error:err
            });
        });
    });

    
    let transporter = nodemailer.createTransport({

        service: 'gmail',
        // host: "",
        // port: 587,
        // secure: false, // true for 465, false for other ports
        auth: {
          user: 'strayspirittest@gmail.com', // generated ethereal user
          pass: 'Qazwsx!2' // generated ethereal password
        },
        tls: {
            rejectUnauthorized: false
        }
      });
    
      confirmURL = 'http://localhost:4200/confirmation/'+secretToken;
      // setup email data with unicode symbols
      let mailOptions = {
        from: '"Stray Spirit" <strayspirittest@gmail.com>', // sender address
        to: req.body.email, // list of receivers
        subject: "Confirm your email account", // Subject line
        text: "", // plain text body
        html: "<a href="+confirmURL+">"+confirmURL+"</a>" // html body
      };
    
      // send mail with defined transport object
     transporter.sendMail(mailOptions, (error, info) => {
         if(error) {
             return console.log(error);
         }
         console.log("Message sent: %s", info.messageId);
         // Preview only available when sending through an Ethereal account
         console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));

     });
    
});


router.get('/userToken/:token', (req, res, next) => {
    const token = req.params.token;
    User.find({
        'secretToken':token
    })
    .exec()
    .then(doc =>{
        console.log(doc);
        res.status(200).json(doc);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({error:err});
    });
});


//The following code will save the organization users details and register them and store these details into the database.
router.post("/signup_org", (req,res,next)=>{
    bcrypt.hash(req.body.password,11)
    .then(hash=>{
        const organization=new Organization({
            _id:new mongoose.Types.ObjectId(),
            organizationtName:req.body.orgName,
            email:req.body.email,
            phoneNumber:req.body.orgPhone,
            registrationNumber:req.body.orgRegNo,
            password:hash,
            user_type:"Organization",
            user_creation_date:Date()
        });
        organization.save()
        .then(result=>{
            res.status(201).json({
                message:'Organization user created!',
                result:result
            });
        })
        .catch(err=>{
            res.status(500).json({
                error:err
            });
        });
    });
    
});

//The following code will authenticate the users by getting the data of the users from the database according to the entered email. If data is returned, the user is an authorized user, otherwise not.
router.post('/login', (req, res, next) => {
    let fetchedUser;
    User.findOne({email:req.body.email}).then(user=>{
        if(!user)
        {
            return res.status(401).json({
                message:"Auth failed"
            });
        }
         fetchedUser= user;
        return bcrypt.compare(req.body.password,user.password);
    })
    .then(result => {
        if(!result){
            return res.status(401).json({
                message:"Auth failed"
            });
        }
        if(!fetchedUser.isActive)
        {
            return res.status(401).json({
                message:"Inactive user!"
            });
        }
        const token=jwt.sign(
            {email:fetchedUser.email,userId:fetchedUser._id},
            "secret_secret_secret_secret_secret",
            {expiresIn:"1h"}
            );
        res.status(200).json({
            token:token,
            userId:fetchedUser._id,
            userType:fetchedUser.user_type
        });
    })
    .catch(err=>{
        console.log(err);
         return res.status(401).json({
             message:"Auth failed"
        })  
    });
  });

  //The following code will authenticate the organizations by getting the data of the organizations from the database according to the entered email. If data is returned, the organization is an authorized user, otherwise not.
  router.post('/orgLogin', (req, res, next) => {
   let fetchedOrg;
    Organization.findOne({email:req.body.email}).then(user=>{
        if(!user)
        {
            return res.status(401).json({
                 message:"Auth failed"
             });
        }
         fetchedOrg= user;
        return bcrypt.compare(req.body.password,user.password);
    })
    .then(result => {
        if(!result){
            return res.status(401).json({
                message:"Auth failed",
                
            });
           
        }
        const token=jwt.sign(
            {email:fetchedOrg.email,userId:fetchedOrg._id},
            "secret_secret_secret_secret_secret",
            {expiresIn:"1h"}
            );
        res.status(200).json({
            token:token,
            userId:fetchedOrg._id,
            userType:fetchedOrg.user_type
        });
    })
    .catch(err=>{
        console.log(err);
         return res.status(401).json({
             message:"Auth failed"
        })  
    });
  });

  //The following code will return all the user data of the user whose userId is passed.
  router.get('/personal/:userId', (req, res, next) => {
    const id = req.params.userId;
    User.findById(id)
    .exec()
    .then(doc =>{
        console.log(doc);
        res.status(200).json(doc);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({error:err});
    });
});

router.get('/org/:userId', (req, res, next) => {
    const id = req.params.userId;
    Organization.findById(id)
    .exec()
    .then(doc =>{
        console.log(doc);
        res.status(200).json(doc);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({error:err});
    });
});

router.put('/update/:id', (req, res, next) =>{
    const id=req.params.id;
    User.findByIdAndUpdate( id, {
        _id: id,
        firstName: req.body.firstNameModel,
        lastName: req.body.lastNameModel,
        email: req.body.emailModel,
        phoneNumber: req.body.phoneNumberModel,
        address:req.body.addressModel,
        pinCode:req.body.pincodeModel,
        dateOfBirth:req.body.dobModel,
        isActive: req.body.isActiveModel
    }).then( result=>{
      console.log(result);
        res.status(200).json({
            message: "Update successfull!"
        });
    });

});

router.put('/org/update/:id', (req, res, next) =>{
    const id=req.params.id;
    Organization.findByIdAndUpdate( id, {
        _id: id,
        organizationtName:req.body.orgNameModel,
        email: req.body.orgEmailModel,
        phoneNumber: req.body.phoneNumberModel,
        registrationNumber:req.body.regNumberModel,
        address:req.body.addressModel,
        pinCode:req.body.pincodeModel,
        
    }).then( result=>{
      console.log(result);
        res.status(200).json({
            message: "Update successfull!"
        });
    });

});

module.exports = router;
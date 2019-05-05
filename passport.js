const LocalStrategy = require('passport-local').Strategy;
const mongoose=require('mongoose');
const bcrypt=require('bcrypt');
const passport = require('passport');
const User=require('./api/models/user');

module.exports=function(passport){
    passport.use(
        new LocalStrategy({usernameField:'email'}, (email,password,done) => {
            //Match user
            User.findOne({email:email})
            .then(user => {
                if(!user) {
                    return done(null,false,{message:'Entered email is not registered!!!'})
                }

                //Match password of the user
                bcrypt.compare(password,user.password,(err,isMatch)=>{
                    if(err) throw err

                    if(isMatch){
                        return done(null,user);
                    }
                    else{
                        return done(null,false,{message:'Incorrect password'});
                    }
                });
            })
            .catch(err=>console.log(err));
        })
    );

    passport.serializeUser(function(user, done) {
        done(null, user.id);
      });
    
      passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
          done(err, user);
        });
      });
};

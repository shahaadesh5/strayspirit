const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');

const Adoption = require('../models/adoption');

router.post('/', (req, res, next) => {
    const adoption = new Adoption({
        _id: new mongoose.Types.ObjectId(),
        prevPet: req.body.prevPetModel,
        curPet: req.body.curPetModel,
        firstPet: req.body.firstPetModel,
        adopterPetFamily: req.body.adopterPetFamilyModel,
        petBehaviour: req.body.petBehaviourModel,
        petHome: req.body.petHomeModel,
        petAdopter: {
            userId: req.body.petAdopterModel.petAdopterId,
            firstName: req.body.petAdopterModel.petAdopterfirstName,
            lastName: req.body.petAdopterModel.petAdopterlastName,
            adopterAge: req.body.petAdopterModel.petAdopteradopterAge,
            adopterAddress: req.body.petAdopterModel.petAdopteradopterAddress,
            adopterEmail: req.body.petAdopterModel.petAdopteradopterEmail,
            adopterPhone: req.body.petAdopterModel.petAdopteradopterPhone
        },
        petDetail:{
            petId: req.body.petDetailModel.petIdModel,
            petName: req.body.petDetailModel.petNameModel,
            petUploaderId: req.body.petDetailModel.petUploaderIdModel
        },
        adoptionStatus: 'Requested',
        travel: req.body.travelModel,
        vacci: req.body.vacciModel,
        creationDate: Date()
    });
    adoption.save().then(result =>{
        console.log(result);
    })
    .catch(err => console.log(err));
    res.status(201).json({
        message: 'Handling POST requests to /adoption',
        createdPet: adoption
    });
});


router.get('/', (req, res, next) => {
    Adoption.find()
    .exec()
    .then(docs =>{
        console.log(docs);
        res.status(200).json(docs);
    })
    .catch(err =>{
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
});
router.get('/singleadoption/:adoptionId', (req, res, next) => {
    const id = req.params.adoptionId;
    Adoption.findById(id)
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

router.get('/adopterUser/:userId', (req, res, next) => {
    const id = req.params.userId;
    Adoption.find({
        'petAdopter.userId':id
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
router.get('/petadopt/:petId', (req, res, next) => {
    const id = req.params.petId;
    Adoption.find({
        'petDetail.petId':id
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
router.delete('/delete/:adoptionId', (req, res, next) => {
    const id = req.params.adoptionId;
    Adoption.remove({ _id: id} )
    .exec()
    .then(result =>{
        res.status(200).json(result);
    })
    .catch(err =>{
        console.log(err);
        res.status(500).json({
            error: err
        })
    })
});

router.put('/update/:id', (req, res, next) =>{
    const id=req.params.id;
    console.log(id);
    Adoption.findByIdAndUpdate( id, {
        _id: id,
        prevPet: req.body.prevPetModel,
        curPet: req.body.curPetModel,
        firstPet: req.body.firstPetModel,
        adopterPetFamily: req.body.adopterPetFamilyModel,
        petBehaviour: req.body.petBehaviourModel,
        petHome: req.body.petHomeModel,
        petAdopter: {
            userId: req.body.petAdopterModel.petAdopterId,
            firstName: req.body.petAdopterModel.petAdopterfirstName,
            lastName: req.body.petAdopterModel.petAdopterlastName,
            adopterAge: req.body.petAdopterModel.petAdopteradopterAge,
            adopterAddress: req.body.petAdopterModel.petAdopteradopterAddress,
            adopterEmail: req.body.petAdopterModel.petAdopteradopterEmail,
            adopterPhone: req.body.petAdopterModel.petAdopteradopterPhone
        },
        petDetail:{
            petId: req.body.petDetailModel.petIdModel,
            petName: req.body.petDetailModel.petNameModel,
            petUploaderId: req.body.petDetailModel.petUploaderIdModel
        },
        adoptionStatus: req.body.adoptionStatusModel,
        travel: req.body.travelModel,
        vacci: req.body.vacciModel

    }).then( result=>{
        console.log(result);
        res.status(200).json({
            message: "Update successfull!"
        });
    });
});

router.post('/adopt-req', (req, res, next) =>{

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
    
      // setup email data with unicode symbols
      let mailOptions = {
        from: '"Stray Spirit" <strayspirittest@gmail.com>', // sender address
        to: "shahaadesh5@gmail.com", // list of receivers
        subject: "A new Adoption request for "+req.body.petName, // Subject line
        text: "", // plain text body
        html: "<h2>Someone enquired about "+req.body.petName+"</h2>" // html body
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
    
      
    
      // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
      // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
    // res.render('register');

});

module.exports = router;
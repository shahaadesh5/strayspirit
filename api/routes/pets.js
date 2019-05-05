const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Pet = require('../models/pets');


router.get('/', (req, res, next) => {
    Pet.find()
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

router.post('/', (req, res, next) => {
    const pets = new Pet({
        _id: new mongoose.Types.ObjectId(),
        petName: req.body.petNameModel,
        petCategory: req.body.petCategoryModel,
        petAge: req.body.petAgeModel,
        petGender: req.body.petGenderModel,
        petHealth: req.body.petHealthModel,
        petDescription: req.body.petDescriptionModel,
        petUploader: {
            userId: req.body.petUploaderModel.petUploaderId,
            firstName: req.body.petUploaderModel.petUploaderfirstName,
            lastName: req.body.petUploaderModel.petUploaderlastName
        },
        petLocation:{
            petCity: req.body.petLocationModel.petCityModel,
            petState: req.body.petLocationModel.petStateModel,
            petCountry: req.body.petLocationModel.petCountryModel
        },
        adoptionStatus: 'Not Adopted',
        petPic: req.body.petPicModel
    });
    pets.save().then(result =>{
        console.log(result);
    })
    .catch(err => console.log(err));
    res.status(201).json({
        message: 'Handling POST requests to /pets',
        createdPet: pets
    });
});

router.get('/singlepet/:petId', (req, res, next) => {
    const id = req.params.petId;
    Pet.findById(id)
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
router.get('/uploader/:userId', (req, res, next) => {
    const id = req.params.userId;
    Pet.find({
        'petUploader.userId':id
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

router.patch('/:petId', (req, res, next) => {
    const id = req.params.petId;
    const updateOps = {};
    for (const ops of req.body){
        updateOps[ops.propName] = ops.value;
    }
    Pet.update({ _id: id }, { $set: updateOps })
    .exec()
    .then(result => {
        console.log(result);
        res.status(200).json(result);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
});

router.put('/update/:id', (req, res, next) =>{
    const id=req.params.id;
    console.log(id);
    Pet.findByIdAndUpdate( id, {
        _id: id,
        petName: req.body.petNameModel,
        petCategory: req.body.petCategoryModel,
        petAge: req.body.petAgeModel,
        petGender: req.body.petGenderModel,
        petHealth: req.body.petHealthModel,
        petDescription: req.body.petDescriptionModel,
        petUploader: {
            userId: req.body.petUploaderModel.petUploaderId,
            firstName: req.body.petUploaderModel.petUploaderfirstName,
            lastName: req.body.petUploaderModel.petUploaderlastName
        },
        petLocation:{
            petCity: req.body.petLocationModel.petCityModel,
            petState: req.body.petLocationModel.petStateModel,
            petCountry: req.body.petLocationModel.petCountryModel
        },
        adoptionStatus: req.body.petAdoptionStatusModel,
        petPic: req.body.petPicModel

    }).then( result=>{
        console.log(result);
        res.status(200).json({
            message: "Update successfull!"
        });
    });
});

router.delete('/delete/:petId', (req, res, next) => {
    const id = req.params.petId;
    Pet.remove({ _id: id} )
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

module.exports = router;
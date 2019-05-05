const mongoose = require('mongoose');

var petUploaderSchema = {
    userId: { type:String , required:true },
    firstName: { type:String , required:true },
    lastName: { type:String , required:true }
};
var petLocationSchema = {
    petCity: { type:String  },
    petState: { type:String  },
    petCountry: { type:String  }
};

const petSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    petName: { type:String , required:true },
    petCategory: { type:String , required:true },
    petAge: { type:String , required:true },
    petGender: { type:String , required:true },
    petHealth: { type:String , required:true },
    petDescription: { type:String , required:true },
    petUploader: petUploaderSchema,
    petLocation: petLocationSchema,
    adoptionStatus: { type:String, required:true },
    petPic: { type:String , required:true }
});

module.exports = mongoose.model('Pet', petSchema);
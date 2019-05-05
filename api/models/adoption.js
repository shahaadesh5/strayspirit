const mongoose = require('mongoose');

var adopterSchema = {
    userId: { type:String , required:true },
    firstName: { type:String , required:true },
    lastName: { type:String , required:true },
    adopterAge: { type:String, required:true },
    adopterAddress: { type:String, required:true },
    adopterEmail: { type:String, required:true },
    adopterPhone: { type:String, required:true }
};
var petSchema = {
    petId: { type:String  },
    petName: { type:String  },
    petUploaderId: { type:String }
};

const adoptionSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    prevPet: { type:String , required:true },
    curPet: { type:String , required:true },
    firstPet: { type:String , required:true },
    adopterPetFamily: { type:String , required:true },
    petBehaviour: { type:String , required:true },
    petHome: { type:String , required:true },
    petAdopter: adopterSchema,
    petDetail: petSchema,
    travel: { type:String, required:true },
    vacci: { type:String , required:true },
    adoptionStatus: { type:String , required:true },
    creationDate: { type:String, required:true }    
});

module.exports = mongoose.model('Adoption', adoptionSchema);
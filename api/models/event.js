//Authored by Aparna Sridhar [B00799570]
const mongoose = require('mongoose');
// Schema to store the data model in the database
const eventSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    eventName: { type:String , required:true },
    eventDescription: { type:String , required:true },
    location: { type:String , required:true },
    eventDate: { type:String , required:true },
    pincode: { type:String , required:true },
    eventUploader: {
        userId: { type:String  },
        firstName: { type:String  },
        lastName: { type:String  }
    },
    eventPic: { type:String , required:true }
    
});

module.exports = mongoose.model('Event', eventSchema);
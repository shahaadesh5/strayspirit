const mongoose = require('mongoose');

var productUploaderSchema = {
    firstName: { type:String , required:true },
    lastName: { type:String , required:true },
    uId:{type: String, required:true}
};



//Schema created for products https://developer.mozilla.org/en-US/docs/Learn/Server-side/Express_Nodejs/mongoose
const productSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    productName: { type:String , required:true },
    productPrice: { type:Number , required:true },
    productQuantity: {type:Number , required:true},
    productDescription: { type:String , required:true },
    productCategory: { type:String , required:true },
    productPic: { type:String , required:true },
    productUploader: productUploaderSchema
    
});

module.exports = mongoose.model('Product', productSchema);
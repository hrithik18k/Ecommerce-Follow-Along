const mongoose = require ("mongoose");

const productSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    description: {
        type: String,
        trim: true
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    imageUrl: {
        type: [String],
    },
    userEmail:{
        type:String,
    },
    stock: {
        type: Number,
        required: true,
        min: 0
    }
}, {timestamps: true});
const Product = mongoose.model('Product', productSchema);

module.exports = Product;
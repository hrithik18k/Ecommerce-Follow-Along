const mongoose = require ("mongoose");

const productSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    imageUrl: {
        type: String,
        required: true,
        trim: true,
        validate: {
            validator: function(v) {
                return /^(http|https):\/\/[^ "]+$/.test(v);
            },
            message: props => `${props.value} is not a valid URL!`
        }
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});
const Product = mongoose.model('Product', productSchema);

module.exports = Product;
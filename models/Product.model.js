const { Schema, module } = require("mongoose");

const productSchema = new Schema ({
    category: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    image: {
        type: String, 
        required: true
    },
    size: {
        type: String,
        default: "n/a"
    },
    price: {
        type: Number,
        required: true
    },
    quantity: {
        type: Number,
        default: 1
    },
    materials: {
        type: [String]
    },
    productsInStock: {
        type: Number,
    }, 
    addedBy: {
        type: [Schema.Types.ObjectId],
        ref: "User"
    }
},
{
    timestamps: true
}) 



const Product = model("Product", productSchema);

module.exports = Product;
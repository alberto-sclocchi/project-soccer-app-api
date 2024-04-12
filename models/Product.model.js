const { Schema, model } = require("mongoose");

const productSchema = new Schema ({
    category: {
        type: String,
        required: true,
        enum: ["accessories", "equipment", "clothing"]
    },
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    brand: {
        type: String
    },
    image: {
        type: String, 
        required: true
    },
    size: {
        type: String,
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
    colors: {
        type: [String]
    },
    productsInStock: {
        type: Number,
    }, 
    likes: {
        type: [Schema.Types.ObjectId],
        ref: "User"
    },
    addedBy: {
        type: Schema.Types.ObjectId,
        ref: "User"
    }
},
{
    timestamps: true
}) 



const Product = model("Product", productSchema);

module.exports = Product;
const { Schema, model } = require("mongoose");

const storeSchema = new Schema ({
    name: {
        type: String,
    },
    description: {
        type: String,
    },
    logo: {
        type: String, 
    },
    city: {
        type: String
    },
    state: {
        type: String
    },
    address: {
        type: String
    },
    colorBanner: {
        type: String,
        enum: ["white", "red", "lightgreen", "green", "lightblue", "blue", "pink", "purple"]
    },
    sponsor: {
        type: String
    },
    products: {
        type: [Schema.Types.ObjectId],
        ref: "Product"
    },
    manager: {
        type: Schema.Types.ObjectId,
        ref: "User"
    }, 
    date: {
        type: Date,
        default: Date.now
    }
},
{
    timestamps: true
}) 



const Store = model("Store", storeSchema);

module.exports = Store;

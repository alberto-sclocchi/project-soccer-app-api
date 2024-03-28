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
    address: {
        type: String
    },
    colorBanner: {
        type: String,
        enum: ["white", "red", "lightgreen", "green", "lightblue", "blue", "pink", "violet"]
    },
    products: {
        type: [Schema.Types.ObjectId],
        ref: "Product"
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User"
    }, 
    data: {
        type: Date,
        default: Date.Now
    }
},
{
    timestamps: true
}) 



const Store = model("Store", storeSchema);

module.exports = Store;

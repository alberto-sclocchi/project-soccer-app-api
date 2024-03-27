const { Schema, module } = require("mongoose");

const StoreSchema = new Schema ({
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
        Type: String
    },
    colorBanner: {
        type: String,
        default: "white"
    },
    items: {
        type: [Schema.Types.ObjectId],
        ref: "Item"
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User"
    }, 
    data: {
        Type: Date,
        default: Date.now
    }
},
{
    timestamps: true
}) 



const Store = model("Store", storeSchema);

module.exports = Store;

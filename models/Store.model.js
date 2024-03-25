const { Schema, module } = require("mongoose");

const StoreSchema = new Schema ({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    logo: {
        type: String, 
        required: true
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
        type: [Schema.Types.ObjectId],
        ref: "User"
    }
},
{
    timestamps: true
}) 



const Store = model("Store", storeSchema);

module.exports = Store;

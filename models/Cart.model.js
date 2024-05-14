const { Schema, model } = require("mongoose");

const CartSchema = new Schema ({
    products: {
        type: [Schema.Types.ObjectId],
        ref: "Product"
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    isClosed: {
        type: Boolean
    },
    totalPrice: {
        type: Number
    }
},
{
    timestamps: true
}) 



const Cart = model("Cart", CartSchema);

module.exports = Cart;
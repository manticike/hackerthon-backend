import mongoose from "mongoose";

const { Schema } = mongoose;

const cartSchema = new Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    items: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product",
                required: true,
            },
            quantity: {
                type: Number,
                required: true,
                default: 1,
            },
            subtotal: {
                type: Number, // the price x quantity
                required: true,
            },
        },
    ],
    totalAmount: {
        type: Number,
        required: true,
        default: 0,
    },
},
{
    timestamps: true, // The time the user added the items to cart or updated it
});

const Cart = mongoose.model('Cart', cartSchema);

export default Cart;
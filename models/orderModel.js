import mongoose from "mongoose";

const { Schema } = mongoose;

const orderSchema = new Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    quantity: Number,
    priceAtPurchase: Number,
    totalAmount: {
        type: Number,
        required: true,
    },
    status: {
        type: String,
        enum: ["pending", "paid", "failed"],
        default: "pending",
    },
    transactionRef: {
        type: String,
        required: true,
    } 
},
 {
        timestamps: true
    })

    const Order = mongoose.model('Order', orderSchema);
    export default Order;
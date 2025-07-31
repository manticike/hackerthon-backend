import mongoose from "mongoose";

const { Schema } = mongoose;

const paymentSchema = new Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    orderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order',
        required: true,
    },
    paystackRef: {
        type: String,
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    currency: {
        type: String,
        default: "GHS",
    },
    status: {
        type: String,
        enum: ["success", "failed", "pending"],
        default: "pending"
    },
    paymentResponse: {
        type: Object,
    },
},
{
    timestamps: true,
});

const Payment = mongoose.model('Payment', paymentSchema);
    export default Payment;
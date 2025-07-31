import mongoose from "mongoose";
const { Schema } = mongoose;

const productSchema = new Schema({
    name: String,
    price: Number,
    description: String,
    stock: Number,
    imageUrl: [String]
},
{
    timestamps: true
});

const Product = mongoose.model('Product', productSchema);
export default Product;
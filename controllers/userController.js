// controllers/userController.js
import mongoose from "mongoose";
import User from "../models/userModel.js";
import bcrypt from "bcrypt";

// Get
// Register User
exports.registerUser = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;
        const userExist = await User.findOne({ email });
        if (userExist) {
            return res.status(400).json({ message: 'user already exists'});
        }

        const user = new User({ name, email, password, role });
        await user.save();

        res.status(201).json({ message: 'User created', user});
    } catch (error) {
        res.status(500).json({ message: 'Error creating user', error: error.message });
    }
}
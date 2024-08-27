// Importing required modules from Mongoose
import { Schema, model } from "mongoose";

// Defining the User Schema using Mongoose Schema
const UserSchema = new Schema(
{
    // First name of the user
    firstName: {
        type: String,
        required: true,
    },
    // Last name of the user
    lastName: {
        type: String,
        required: true,
    },
    // User's username
    username: {
        type: String,
    },
    // User's email address
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    // User's password
    password: {
        type: String,
        required: true,
        trim: true,
    },
    // User's recovery email address
    recoveryEmail: {
        type: String,
        trim: true,
    },
    // User's date of birth
    DOB: {
        type: Date,
    },
    // User's mobile number
    mobileNumber: {
        type: String,
        unique: true,
    },
    // User's role (User or Company HR)
    role: {
        type: String,
        enum: ["User", "Company_HR"],
        default: "User",
    },
    // User's online/offline status
    status: {
        type: String,
        enum: ["online", "offline"],
        default: "offline",
    },
    // One-Time Password (OTP) for user authentication
    OTP: {
        type: String,
        default: "",
    },
    },
    {
    // Enabling automatic timestamps for createdAt and updatedAt
    timestamps: true,
    }
);

// Creating and exporting the User model using the defined schema
export default model("User", UserSchema);

import { Schema , model } from "mongoose";

const UserSchema = new Schema ({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    username: {
        type: String
    },
    email:{
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        trim: true
    },
    recoveryEmail: {
        type: String,
        trim: true
    },
    DOB:{
        type: Date
    },
    mobileNumber: {
        type: Number,
        unique: true
    },
    role: {
        type: String,
        enum: ['User', 'Company_HR'],
        default: 'User'
    },
    status: {
        type: String,
        enum: ['online', 'offline'],
        default: 'offline'
    },
    OTP: {
        type: String,
        default: ""
    }
},{
    timestamps: true
})



export default model('User', UserSchema)
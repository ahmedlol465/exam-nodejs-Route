import { Schema, model } from "mongoose";

const JobSchema = new Schema({
    jobTitle: {
        type: String,
        required: true
    },
    jobLocation: {
        type: String,
        enum: ['remotely', 'onsite', 'hybrid']
    },
    workingTime: {
        type: String,
        enum: ['part-time', 'Full-time']
    },
    seniorityLevel:{
        type: String,
        enum: ['Junior', 'Mid-Level', 'Senior', 'Team-Lead', 'CTO']
    },
    jobDescription: {
        type: String
    },
    technicalSkills:{
        type: String
    },
    softSkills: {
        type: String
    },
    addedBy: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
})

JobSchema.virtual("companies", {
    ref: "Company",
    foreignField: "companyHR",
    localField: "addedBy"

})


export default model('Job', JobSchema)
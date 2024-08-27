// Importing necessary modules from Mongoose
import { array } from "joi";
import { Schema, model } from "mongoose";

// Defining the schema for the Job model
const JobSchema = new Schema(
{
    // Job title is a required string field
    jobTitle: {
        type: String,
        required: true,
    },
    // Job location must be one of the specified options: 'remotely', 'onsite', 'hybrid'
    jobLocation: {
        type: String,
        enum: ["remotely", "onsite", "hybrid"],
    },
    // Working time must be one of the specified options: 'part-time', 'Full-time'
    workingTime: {
        type: String,
        enum: ["part-time", "Full-time"],
    },
    // Seniority level must be one of the specified options
    seniorityLevel: {
        type: String,
        enum: ["Junior", "Mid-Level", "Senior", "Team-Lead", "CTO"],
    },
    // Job description is a free-text field
    jobDescription: {
        type: String,
    },
    // Technical skills required for the job
    technicalSkills: {
        type: Array
    },
    // Soft skills required for the job
    softSkills: {
        type: Array,
        // required: true
    },
    // Reference to the User who added this job
    addedBy: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    },
    {
    // Enabling timestamps for created and updated fields
    timestamps: true,
    // Enabling virtuals to be included when converting to JSON
    toJSON: { virtuals: true },
    // Enabling virtuals to be included when converting to an object
    toObject: { virtuals: true },
    }
);

// Defining a virtual field for the "companies" relationship
JobSchema.virtual("companies", {
    ref: "Company",
  // Specifying the foreign field in the Company model
    foreignField: "companyHR",
  // Specifying the local field in the Job model
    localField: "addedBy",
});

// Exporting the Job model
export default model("Job", JobSchema);

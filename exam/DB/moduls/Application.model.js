// Importing necessary modules from the mongoose library
import { Schema, model } from "mongoose";

// Defining the schema for the 'application' collection
const applicationSchema = new Schema(
{
    // Job ID associated with the application, referencing the 'Job' collection
    jobId: {
        type: Schema.Types.ObjectId,
        ref: "Job",
    },
    // User ID associated with the application, referencing the 'User' collection
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    // Technical skills of the user applying for the job
    userTechSkills: {
        type: String,
    },
    // Soft skills of the user applying for the job
    userSoftSkills: {
        type: String,
    },
    // Array containing details of the user's resume, including secure URL, public ID, and folder ID
    userResume: [
        {
        secure_url: { type: String, required: true },
        public_id: { type: String, required: true },
        folderId: { type: String, required: true },
        },
    ],
    },
  // Including timestamps for automatic creation of 'createdAt' and 'updatedAt' fields
    {
    timestamps: true,
    }
);

// Creating and exporting the 'Application' model based on the defined schema
export default model("application", applicationSchema);

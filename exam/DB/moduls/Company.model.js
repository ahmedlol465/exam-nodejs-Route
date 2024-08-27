// Importing necessary modules from Mongoose
import { Schema, model } from "mongoose";

// Defining the schema for the Company model
const CompanySchema = new Schema(
{
    // Name of the company
    companyName: {
        type: String,
      Unique: true, // Should be unique
      required: true, // Required field
      max: 30, // Maximum length of 30 characters
    },
    // Description of the company
    description: {
        type: String,
      max: 5000, // Maximum length of 5000 characters
    },
    // Industry in which the company operates
    industry: {
        type: String,
    },
    // Physical address of the company
    address: {
        type: String,
    },
    // Number of employees in the company
    numberOfEmployees: {
        type: Number,
    },
    // Email address of the company
    companyEmail: {
        type: String,
      Unique: true, // Should be unique
      required: true, // Required field
    },
    // Reference to the HR user associated with the company
    companyHR: {
        type: Schema.Types.ObjectId,
      ref: "User", // Reference to the 'User' model
    },
    },
    {
    timestamps: true, // Automatically add createdAt and updatedAt timestamps
    toJSON: { virtuals: true }, // Include virtuals when converting to JSON
    toObject: { virtuals: true }, // Include virtuals when converting to object
    }
);

// Define a virtual field for the 'jobs' associated with the company
CompanySchema.virtual("jobs", {
  ref: "Job", // Reference to the 'Job' model
  localField: "companyHR", // Field in this model
  foreignField: "addedBy", // Field in the referenced model
});

// Export the Company model with the defined schema
export default model("Company", CompanySchema);

import CompanyModel from '../../../DB/models/Company.model.js';
import jobSchema from '../../../DB/models/job.model.js'
import applicationModel from '../../../DB/models/Application.model.js'
import generateUniqueString from "../../uitils/generateUniqeString.js";
import cloudnaryConnection from "../../uitils/cloudnary.js";
import  xlsx  from 'exceljs';
import  exceljs  from 'exceljs';
import  fs  from 'fs';

//================== add job ==================
export const addJob = async (req, res, next) => {
    // Extract user ID from authentication data
    const { _id } = req.authUser;

    // Extract job data from request body
    const {
        jobTitle,
        jobLocation,
        workingTime,
        seniorityLevel,
        jobDescription,
        technicalSkills,
        softSkills
    } = req.body;

    // Create a new job document in the database
    const add = await jobSchema.create({
        jobTitle,
        jobLocation,
        workingTime,
        seniorityLevel,
        jobDescription,
        technicalSkills,
        softSkills,
        addedBy: _id,
    });

    // Handle errors during job creation
    if (!add) {
        return next(new Error('Error adding this job', { cause: 409 }));
    }

    // Respond with success message and added job data
    res.status(200).json({ message: 'Created job', add });
}

// ====================  update job ================= 
export const UpdateJob = async (req, res, next) => {
    // Extract job data from request body and job ID from parameters
    const {
        jobTitle,
        jobLocation,
        workingTime,
        seniorityLevel,
        jobDescription,
        technicalSkills,
        softSkills
    } = req.body;
    const { jobId } = req.params;

    // Extract user role from authentication data
    const { role } = req.authUser;

    // Check if user has the required role for updating jobs
    if (role !== 'Company_HR') {
        return res.status(403).json({ message: 'Unauthorized', success: false });
    }

    // Update the job document in the database
    const updating = await jobSchema.findByIdAndUpdate(jobId, {
        jobTitle,
        jobLocation,
        workingTime,
        seniorityLevel,
        jobDescription,
        technicalSkills,
        softSkills,
    }, { new: true });

    // Handle errors during job update
    if (!updating) {
        return next(new Error('Error updating data', { cause: 409 }));
    }

    // Respond with success message and updated job data
    res.status(200).json({ message: 'Updated job', updating });
}

// ====================  delete job ================= 
export const DeleteJob = async (req, res, next) => {
    // Extract job ID from parameters
    const { jobId } = req.params;

    // Delete the job document from the database
    const deleting = await jobSchema.findByIdAndDelete(jobId);

    // Handle errors during job deletion
    if (!deleting) {
        return next(new Error('Error deleting the job', { cause: 409 }));
    }

    // Respond with success message
    res.status(200).json({ message: 'Deleted' });
}

// ====================  get job for company ================= 
export const GetJobs = async (req, res, next) => {
    // Retrieve all jobs from the database and populate with company information
    const jobs = await jobSchema.find().populate('companies');

    // Handle errors during job retrieval
    if (!jobs) {
        return next(new Error('Error getting the jobs', { cause: 409 }));
    }

    // Respond with success message and job data
    res.status(200).json({ message: 'The jobs', jobs });
}

// ====================  get job specific for company ================= 
export const GetspecificJobs = async (req, res, next) => {
    // Extract company name from query parameters
    const { companyName } = req.query;

    // Find the company document in the database
    const findcompany = await CompanyModel.findOne(companyName);

    // Handle errors during company retrieval
    if (!findcompany) {
        return next(new Error('Error getting the jobs', { cause: 409 }));
    }

    // Retrieve jobs specific to the company from the database
    const getjob = await jobSchema.find({ addedBy: findcompany.companyHR });

    // Respond with success message and job data
    res.status(200).json({ message: 'The jobs', getjob });
}

// ===========  get jobs filter ===============
export const filterJob = async (req, res, next) => {
    // Extract filter criteria from request body
    const { workingTime, jobLocation, seniorityLevel, jobTitle, technicalSkills } = req.body;

    // Create a query object based on the provided filters
    const query = {};
    if (workingTime) query.workingTime = workingTime;
    if (jobLocation) query.jobLocation = jobLocation;
    if (seniorityLevel) query.seniorityLevel = seniorityLevel;
    if (jobTitle) query.jobTitle = new RegExp(jobTitle, "i");
    if (technicalSkills) query.technicalSkills = { $in: technicalSkills };

    // Retrieve jobs from the database based on the applied filters
    const filtering = await jobSchema.find(query);

    // Handle errors during job retrieval
    if (!filtering) {
        return next(new Error('Error getting the jobs', { cause: 409 }));
    }

    // Respond with success message and filtered job data
    res.status(200).json({ message: 'The jobs', filtering });
}

// ===================  apply job ==============
export const applyingJobs = async (req, res, next) => {
    // Extract job ID and user ID from parameters and authentication data
    const { jobId } = req.params;
    const { _id } = req.authUser;

    // Extract user skills from request body
    const { userTechSkills, userSoftSkills } = req.body;

    // Check if user has uploaded any resume files
    if (!req.files?.length) {
        return next(new Error('Please upload your resume', { cause: 409 }));
    }

    // Initialize arrays to store uploaded resume details
    let userResume = [];
    let publicIdsArr = [];
    const folderId = generateUniqueString(4);

    // Upload each resume file to Cloudinary
    for (const file of req.files) {
        const { secure_url, public_id } = await cloudnaryConnection().uploader.upload(file.path, {
            folder: `userResume/applications/${_id}/${folderId}`
        });
        publicIdsArr.push(public_id);
        userResume.push({ secure_url, public_id, folderId });
    }

    // Create a new application document in the database
    const addDataApplication = await applicationModel.create({
        jobId,
        userId: _id,
        userResume,
        userTechSkills,
        userSoftSkills,
    });

    // Handle errors during application creation
    if (!addDataApplication) {
        for (const resume of userResume) {
        const data = await cloudnaryConnection().api.delete_all_resources(
            publicIdsArr
        ); // alot photo
        console.log(data);
        }
        res.json({ message: "errooooooor", success: false });
    } 
    // Respond with success message and application data
    res.json({ message: 'Added successfully', success: true, data: addDataApplication });
}












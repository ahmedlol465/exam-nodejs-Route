// Importing necessary modules and dependencies
import { Router } from "express";
import * as jobcontroller from "./job.controller.js";
import expressAsynchandler from "express-async-handler";
import { auth } from "../../middleware.js/auth.middleware.js";
import { multermiddleHost } from "../../middleware.js/multer.js";
import { allowedExetintion } from "../../uitils/allowedExtentions.js";
import { endPointsRoles } from "../model.endPoint.roles.js";

// Creating an Express router instance
const router = Router();

// Defining routes for job-related operations with authentication and role-based access control

// Add a job to a specific company
router.post(
    "/addJob/:companyId",
    auth(endPointsRoles.HR_ONLY),
    expressAsynchandler(jobcontroller.addJob)
);

// Update job details by job ID
router.put(
    "/updateJob/:jobId",
    auth(endPointsRoles.HR_ONLY),
    expressAsynchandler(jobcontroller.UpdateJob)
);

// Delete a job by job ID
router.delete(
    "/deleteJob/:jobId",
    auth(endPointsRoles.HR_ONLY),
    expressAsynchandler(jobcontroller.DeleteJob)
);

// Get a list of jobs with JOB role access
router.get(
    "/getJob",
    auth(endPointsRoles.JOB),
    expressAsynchandler(jobcontroller.GetJobs)
);

// Get specific job details with JOB role access
router.get(
    "/getspacificJob",
    auth(endPointsRoles.JOB),
    expressAsynchandler(jobcontroller.GetspecificJobs)
);

// Filter jobs based on criteria with JOB role access
router.get(
    "/fillterjobs",
    auth(endPointsRoles.JOB),
    expressAsynchandler(jobcontroller.filterJob)
);

// Apply for a job with USER role access and resume upload
router.post(
    "/applyjobs/:jobId",
    auth(endPointsRoles.USER_ONLY),
    multermiddleHost({
    extensions: allowedExetintion.document,
}).array("resume", 1),
    expressAsynchandler(jobcontroller.applyingJobs)
);


// Exporting the router for use in the main application
export default router;

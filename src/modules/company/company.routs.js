// Importing necessary modules and dependencies
import { Router } from "express";
import * as companycontroller from "./company.controller.js";
import expressAsynchandler from "express-async-handler";
import { auth } from "../../middleware.js/auth.middleware.js";
import { endPointsRoles } from "../model.endPoint.roles.js";

// Creating an Express router instance
const router = Router();

// Defining routes for company-related operations with authentication and role-based access control
router.post(
    "/addCompany",
    auth(endPointsRoles.HR_ONLY),
    expressAsynchandler(companycontroller.addCompant)
);
router.post(
    "/updateCompany",
    auth(endPointsRoles.HR_ONLY),
    expressAsynchandler(companycontroller.Updatecompanydata)
);
router.delete(
    "/deleteCompany",
    auth(endPointsRoles.HR_ONLY),
    expressAsynchandler(companycontroller.Deletecompanydata)
);
router.get(
    "/getCompany/:companyId",
    auth(endPointsRoles.HR_ONLY),
    expressAsynchandler(companycontroller.getcompanydata)
);
router.get(
    "/searchCompany",
    auth(endPointsRoles.COMPANY),
    expressAsynchandler(companycontroller.searchcompanydata)
);
router.get(
    "/getCompanyApplications/:jobId",
    auth(endPointsRoles.HR_ONLY),
    expressAsynchandler(companycontroller.getcompanyapplications)
);

// Create an Excel sheet with job data
router.get(
  "/createExelSheat/:companyId",
  expressAsynchandler(companycontroller.addExallData)
);


// Exporting the router for use in the main application
export default router;

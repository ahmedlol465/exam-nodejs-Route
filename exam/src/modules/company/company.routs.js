import { Router } from "express";
import * as companycontroller from "./company.controller.js";
import expressAsynchandler from "express-async-handler";
import { auth } from "../../middleware.js/auth.middleware.js";
import { endPointsRoles } from "../model.endPoint.roles.js";

const router = Router();


router.post('/addCompany', auth(endPointsRoles.HR_ONLY), expressAsynchandler(companycontroller.addCompant))
router.post('/updateCompany', auth(endPointsRoles.HR_ONLY), expressAsynchandler(companycontroller.Updatecompanydata))
router.delete('/deleteCompany', auth(endPointsRoles.HR_ONLY), expressAsynchandler(companycontroller.Deletecompanydata))
router.get('/getCompany/:companyId', auth(endPointsRoles.HR_ONLY), expressAsynchandler(companycontroller.getcompanydata))
router.get('/searchCompany',auth(endPointsRoles.COMPANY), expressAsynchandler(companycontroller.searchcompanydata))
router.get('/getCompanyApplications/:jobId',auth(endPointsRoles.HR_ONLY), expressAsynchandler(companycontroller.getcompanyapplications))




export default router
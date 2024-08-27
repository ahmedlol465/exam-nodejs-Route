import { Router } from "express";
import * as jobcontroller from "./job.controller.js";
import expressAsynchandler from "express-async-handler";
import { auth } from "../../middleware.js/auth.middleware.js";
import { multermiddleHost } from "../../middleware.js/multer.js";
import { allowedExetintion } from "../../uitils/allowedExtentions.js";
import {endPointsRoles} from '../model.endPoint.roles.js'
const router = Router();

router.post('/addJob/:companyId', auth(endPointsRoles.HR_ONLY), expressAsynchandler(jobcontroller.addJob))
router.put('/updateJob/:jobId', auth(endPointsRoles.HR_ONLY), expressAsynchandler(jobcontroller.UpdateJob))
router.delete('/deleteJob/:jobId', auth(endPointsRoles.HR_ONLY), expressAsynchandler(jobcontroller.DeleteJob))
router.get('/getJob', auth(endPointsRoles.JOB), expressAsynchandler(jobcontroller.GetJobs))
router.get('/getspacificJob', auth(endPointsRoles.JOB), expressAsynchandler(jobcontroller.GetspecificJobs))
router.get('/fillterjobs', auth(endPointsRoles.JOB), expressAsynchandler(jobcontroller.filterJob))


router.post('/applyjobs/:jobId', auth(endPointsRoles.USER_ONLY), multermiddleHost({
    extensions: allowedExetintion.document,
}).array('resume', 1) ,expressAsynchandler(jobcontroller.applyingJobs))



router.get('/createExelSheat', expressAsynchandler(jobcontroller.addExallData))
export default router;

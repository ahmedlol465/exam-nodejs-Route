import { Router } from "express";
import * as usercontroller from "./user.controller.js";
import expressAsynchandler from "express-async-handler";
import { auth } from "../../middleware.js/auth.middleware.js";
import { validmiddleware } from "../../middleware.js/validationMiddleware.js";
import { siginUpSchema } from "./user.validationSchema.js";
import { endPointsRoles } from "../model.endPoint.roles.js";

const router = Router();


router.post('/signUp', validmiddleware(siginUpSchema), expressAsynchandler(usercontroller.Signup))
router.post('/signIn', expressAsynchandler(usercontroller.SignIn))
router.put('/update', auth(endPointsRoles.USER) ,expressAsynchandler(usercontroller.UpdateUser))
router.delete('/delete', auth(endPointsRoles.USER) ,expressAsynchandler(usercontroller.deleteUser))
router.get('/getData', auth(endPointsRoles.USER) ,expressAsynchandler(usercontroller.getData))
router.get('/getDataanotherUser', auth(endPointsRoles.HR_ONLY) ,expressAsynchandler(usercontroller.getotherDataUser))
router.post('/updatePassword', auth(endPointsRoles.USER) ,expressAsynchandler(usercontroller.UpdatePassword))
router.post('/forgetPassword',expressAsynchandler(usercontroller.forgetPassword))
router.post('/resetpassword',expressAsynchandler(usercontroller.resetpassword))
router.get('/accountWithRecavaryEmail', auth(endPointsRoles.HR_ONLY) ,expressAsynchandler(usercontroller.accountWithRecavaryEmail))



export default router
// Importing necessary modules and dependencies
import { Router } from "express";
import * as usercontroller from "./user.controller.js";
import expressAsynchandler from "express-async-handler";
import { auth } from "../../middleware.js/auth.middleware.js";
import { validmiddleware } from "../../middleware.js/validationMiddleware.js";
import { siginUpSchema } from "./user.validationSchema.js";
import { endPointsRoles } from "../model.endPoint.roles.js";

// Creating an Express router instance
const router = Router();

// Defining routes for user-related operations with authentication and role-based access control

// User signup route with validation middleware
router.post(
    "/signUp",
    validmiddleware(siginUpSchema),
    expressAsynchandler(usercontroller.Signup)
);

// User signin route
router.post("/signIn", expressAsynchandler(usercontroller.SignIn));

// Update user details route with USER role access
router.put(
    "/update",
    auth(endPointsRoles.USER),
    expressAsynchandler(usercontroller.UpdateUser)
);

// Delete user account route with USER role access
router.delete(
    "/delete",
    auth(endPointsRoles.USER),
    expressAsynchandler(usercontroller.deleteUser)
);

// Get user data route with USER role access
router.get(
    "/getData",
    auth(endPointsRoles.USER),
    expressAsynchandler(usercontroller.getData)
);

// Get data of another user with HR role access
router.get(
    "/getDataanotherUser",
    auth(endPointsRoles.HR_ONLY),
    expressAsynchandler(usercontroller.getotherDataUser)
);

// Update user password route with USER role access
router.post(
    "/updatePassword",
    auth(endPointsRoles.USER),
    expressAsynchandler(usercontroller.UpdatePassword)
);

// Forget password route for initiating the reset process
router.post(
    "/forgetPassword",
    expressAsynchandler(usercontroller.forgetPassword)
);

// Reset password route after receiving the reset token
router.post(
    "/resetpassword",
    expressAsynchandler(usercontroller.resetpassword)
);

// Get accounts with recovery email for HR role access
router.get(
    "/accountWithRecavaryEmail",
    auth(endPointsRoles.HR_ONLY),
    expressAsynchandler(usercontroller.accountWithRecavaryEmail)
);

// Exporting the router for use in the main application
export default router;

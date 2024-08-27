// Importing necessary modules and models
import User from "../../../DB/models/user.model.js";
import jwt from "jsonwebtoken";
import generateUniqueString from "../../uitils/generateUniqeString.js";
import bcrypt from "bcrypt";

// 1. SignUp
export const Signup = async (req, res, next) => {
  // Extracting data from req.body
    const {
    firstName,
    lastName,
    email,
    password,
    recoveryEmail,
    DOB,
    mobileNumber,
    role,
    statue,
    } = req.body;

  // Checking for duplicate email
    const isEmailDuplicate = await User.findOne({ email }, {mobileNumber});
    if (isEmailDuplicate) {
    return next(new Error("Email is already exist", { cause: 409 }));
    }

  // Hashing password
    const hashpassword = bcrypt.hashSync(password, +process.env.SALT_ROUNDS);

  // Creating a new user
    const createValidUser = await User.create({
    firstName,
    lastName,
    username: `${firstName} ${lastName}`,
    email,
    password: hashpassword,
    recoveryEmail,
    DOB,
    mobileNumber,
    role,
    statue,
    });

  // Handling success or error response
    if (!createValidUser) {
    return res.json({ message: "Create user failed", statue: 400 });
    }
  // Success creation user
    return res.json({
    message: "Create user successful",
    status: 200,
    createValidUser,
    });
};

// 2. SignIn
export const SignIn = async (req, res, next) => {
    const { email, password, mobileNumber, recoveryEmail } = req.body;

  // Check if email, mobileNumber, or recoveryEmail is provided
    if (email || mobileNumber ) {
    const user = await User.findOne({
        $or: [{ email }, { mobileNumber }],
    });

    if (!user) {
        res.json({ message: "Invalid information", statue: 400 });
    }

    // Compare password
    const isPasswordMatch = bcrypt.compareSync(password, user.password);
    if (!isPasswordMatch) {
        return next(new Error("Invalid password", { cause: 409 }));
    }

    // Log in process
    const token = jwt.sign(
        {
        id: user.id,
        userEmail: user.email || user.mobileNumber
        },
        process.env.LOGUN_SIGNATURE,
        {
        expiresIn: "1D",
        }
    );
    await User.findByIdAndUpdate(user.id, { status: "online" });

    return res.json({ message: "Login successfully", statue: 200, token });
    }
};

// 3. Update User
export const UpdateUser = async (req, res, next) => {
    const { email, mobileNumber, recoveryEmail, DOB, lastName, firstName } =
    req.body;
    const { _id } = req.authUser;

    if (email || mobileNumber ) {
      // Check for duplicate email, mobileNumber, or recoveryEmail
    const isqueryDuplicate = await User.findOne({
        $or: [{ email }, { mobileNumber }],
    });

    if (isqueryDuplicate) {
        return res.json({ message: "Email already exist or mobileNumber ", status: 400 });
    }
    await isqueryDuplicate.save()
  }


    // Update user data
    const update = await User.findOneAndUpdate(
        _id,
        {
        email,
        mobileNumber,
        recoveryEmail,
        DOB,
        lastName,
        firstName,
        },
        { new: true }
    );

    if (!update) {
        return next(new Error("Invalid update"));
    }
    res.status(200).json({ message: "Updated", update });
};

// 4. Delete User
export const deleteUser = async (req, res, next) => {
    const { _id } = req.authUser;

  // Delete user data
    const deleting = await User.findByIdAndDelete(_id);

    if (!deleting) {
    return next(new Error("Invalid deleting"));
    }
    res.status(200).json({ message: "Deleted", deleting });
};

// 5. Get User Account Data
export const getData = async (req, res, next) => {
    const { _id } = req.authUser;

  // Get user data excluding sensitive information
    const data = await User.findById(
    _id,
    "email password -_id mobileNumber firstName lastName"
    );
    if (!data) {
    return next(new Error("Invalid id"));
    }
    res.status(200).json({ message: "Your data", data });
};

// 6. Get Profile Data for Another User
export const getotherDataUser = async (req, res, next) => {
    const { userId } = req.query;

  // Get user data excluding sensitive information for another user
    const data = await User.findById(
    userId,
    "email password -_id mobileNumber firstName lastName"
    );
    if (!data) {
    return next(new Error("Invalid userId"));
    }
    res.status(200).json({ message: "User data", data });
};

// 7. Update Password
export const UpdatePassword = async (req, res, next) => {
    const { password } = req.authUser;
    const { old_password, new_password } = req.body;

  // Compare old password
    const compareOldPassword = bcrypt.compareSync(old_password, password);
    if (!compareOldPassword) {
    return next(new Error("Invalid old password", { cause: 409 }));
    }

  // Compare new password with old password
    const compareNewPassword = bcrypt.compareSync(new_password, password);
    if (compareNewPassword) {
    return next(
        new Error(
        "Please set a different password, it cannot be the same as the old password",
        { cause: 409 }
        )
    );
    }

  // Hash the new password
    const hashNewpassword = bcrypt.hashSync(
    new_password,
    +process.env.SALT_ROUNDS
    );

  // Update password
    const updatepass = await User.updateOne({ password: hashNewpassword });
    if (!updatepass) {
    return next(new Error("Error updating password", { cause: 409 }));
    }
    return res.status(200).json({ message: "Updated password", success: true });
};

// 8. Forget Password
export const forgetPassword = async (req, res, next) => {
    const { email } = req.body;

  // Check if email exists
    const isEmailExist = await User.findOne({ email });
    if (!isEmailExist) return next(new Error("Email not found", { cause: 401 }));

  // Generate OTP
    const generate_OTP = generateUniqueString(4);

  // Add OTP to user data
    const addOTP = await User.updateOne({ OTP: generate_OTP });
    if (!addOTP)
    return next(new Error("Error, please try again", { cause: 401 }));

    return res
    .status(200)
    .json({ message: "Your OTP", success: true, generate_OTP });
};

// 9. Get all accounts associated with a specific recovery Email
export const accountWithRecoveryEmail = async (req, res, next) => {
    const accounts = await User.find({
    recoveryEmail: { $exists: true, $ne: null },
    });
    if (!accounts) {
    return next(new Error("Error getting accounts", { cause: 409 }));
    }
    return res.status(200).json({ message: "Accounts", success: true, accounts });
};

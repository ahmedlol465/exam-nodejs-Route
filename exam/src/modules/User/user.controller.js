// 1. SignUp
// 2. SignIn
//     - SignIn using  (email or mobileNumber or recovery email)  and password
//     - don’t forget to update the status to online after SignIn
// 3. update account date 
//     - you can update ( email , mobileNumber , recoveryEmail , DOB , lastName , firstName)
//     - if user update the email , mobileNumber , recoveryEmail make sure that the new data doesn’t conflict with any existing data in your  database
//     - User must be loggedIn
//     - only the owner of the account can update his account data
// 4. Delete account
//     - only the owner of the account can delete his account data
//     - User must be loggedIn
// 5. Get user account data 
//     - only the owner of the account can get his account data
//     - User must be loggedIn
// 6. Get profile data for another user 
//     - send the userId in params or query
// 7. Update password 
// 8. Forget password ( without sending any email , make sure of your data security specially the OTP and the newPassword )
// 9. Get all accounts associated to specific recovery Email


import User from '../../../DB/moduls/user.model.js'
import jwt from "jsonwebtoken";
import generateUniqueString from '../../uitils/generateUniqeString.js';
import bcrypt from "bcrypt";


//*************************sign up*********
export const Signup = async(req,res,next) => {
    // distract data from req.body
    const { firstName, lastName, email, password, recoveryEmail, DOB, mobileNumber, role, statue } = req.body
    // email check 
    const isEmailDuplicate = await User.findOne({ email });
    if (isEmailDuplicate) {
    return next(new Error("email is already exist", { cause: 409 }));
    }
    // hashing password
        const hashpassword = bcrypt.hashSync(password, +process.env.SALT_ROUNDS);
        // salt rounds  = 9 
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
        // if error in create the user
        if(!createValidUser){
            return res.json({message: 'creatd user fail', statue: 400})
        }
        // success creation user
    return res.json({message: 'creatd user succes', status: 200 , createValidUser})
}



// ************* sign in **************8
export const SignIn = async (req, res, next) =>{
    const { email, password, mobileNumber, recoveryEmail } = req.body;
        // check if email or mobile 
        if(email || mobileNumber || recoveryEmail){
        const user = await User.findOne({
            $or: [
                {email}, 
                {mobileNumber},
                {recoveryEmail}
            ]
        })

            if (!user) {
                res.json({ message: "invaild information", statue: 400 });
            }    

    // compare password
    const isPasswordMatch = bcrypt.compareSync(password, user.password);
    if(!isPasswordMatch){
    return next(new Error("error password", { cause: 409 }));
    }
  //===========  log in proccess ========
    const token = jwt.sign(
        {id: user.id, userEmail: user.email || user.mobileNumber || user.recoveryEmail},
        process.env.LOGUN_SIGNATURE,
        {
            expiresIn: '1D'
        }
        )
    await User.findByIdAndUpdate(user.id, { status: "online" });
    return res.json({message: 'login succefully', statue: 200, token})
        }
}




//================  update User =================
export const UpdateUser = async (req, res, next) => {
    const { email , mobileNumber , recoveryEmail , DOB , lastName , firstName } = req.body
    const { _id } = req.authUser

    if(email || mobileNumber || recoveryEmail || firstName || DOB || lastName){
        const isqueryDuplicate = await User.findOne({
            $or: [
                {email},
                {mobileNumber},
                {recoveryEmail}
            ]
        })
    if (isqueryDuplicate) {
        return res.json({ message: "email already exist", status: 400 });
    }


    const update = await User.findOneAndUpdate(_id , {
        email , mobileNumber , recoveryEmail , DOB , lastName , firstName
    }, {new: true});

        if (!update) {
        return next(new Error ("Invalid update"));
    }
        res.status(200).json({ message: " updated", update });
}
}




//================  delete User =================
export const deleteUser = async (req, res, next) => {
    const { _id } = req.authUser

    const deleting = await User.findByIdAndDelete(_id);

        if (!deleting) {
        return next(new Error ("Invalid deleting"));
    }
        res.status(200).json({ message: " deleted", deleting });
}


// =================== Get User ==============

export const getData = async(req,res,next) => {
    const { _id } = req.authUser

    const data = await User.findById(_id, 'email password -_id mobileNumber firstName lastName')
    if(!data) 
    return next(new Error ("Invalid id"));
    
    res.status(200).json({ message: " your data", data });
    
}


// =================== Get onother Data User ==============

export const getotherDataUser = async(req,res,next) => {
    const { userId } = req.query

    const data = await User.findById(userId, 'email password -_id mobileNumber firstName lastName')
    if(!data) 
    return next(new Error ("Invalid userId"));
    
    res.status(200).json({ message: " your data", data });
    
}


// =====================  update password ===============
export const UpdatePassword = async(req,res,next) => {
    const { password} = req.authUser
    const { old_password, new_password } = req.body

    const compareOldPassword =  bcrypt.compareSync(old_password, password)
        if (!compareOldPassword) {
            return next(new Error("error old password", { cause: 409 }));
        }

    const compareNewPassword =  bcrypt.compareSync(new_password, password)
        if (compareNewPassword) {
            return next(new Error("please set deffrent password it like old password", { cause: 409 }));
        }

        const hashNewpassword = bcrypt.hashSync(new_password, +process.env.SALT_ROUNDS);

        const updatepass = await User.updateOne({password: hashNewpassword})
            if(!updatepass){
                return next(new Error("error updating password", { cause: 409 }));
}
return res.status(200).json({message: 'updated password', success: true})
}






// ==============  Forget password ==================
export const forgetPassword = async(req,res,next) => {
    const { email} = req.body


    const isEmailExist = await User.findOne({email})
    if(!isEmailExist) return next(new Error('not found email', {cause: 401}))

    const generate_OTP = generateUniqueString(4);

    const addOTP = await User.updateOne({OTP: generate_OTP})
    if(!addOTP) return next(new Error("error please try again", { cause: 401 }));

return res.status(200).json({message: 'your OTP', success: true, generate_OTP})


}



// ========   reset api ============

export const resetpassword = async(req,res,next) => {
    const { New_Password, OTP } = req.body

    const compareOTP = await User.find({OTP: OTP})

    if(!compareOTP?.length) return next (new Error('not valid OTP', {cause: 409}))

    // hash the password
    const hashNewpassword = bcrypt.hashSync(New_Password, +process.env.SALT_ROUNDS);
    const createpassword = await User.updateOne({
        password: hashNewpassword
    })

    // delete OTP from data base 
    const deleteOTP = await User.deleteOne({OTP})

    if(!createpassword) return next (new Error('error creating password please try again', {cause: 409}))
    res.json('changed password succefully')
    
}



// =================  get all acount has recavary Email
export const accountWithRecavaryEmail = async(req,res,next) => {
        const accounts = await User.find({ recoveryEmail: { $exists: true, $ne: null }})
            if(!accounts){
                return next(new Error("error getting accounts", { cause: 409 }));
}
return res.status(200).json({message: 'accounts', success: true, accounts})
}










// // ================  get expireird deadline=================
// export const deadlineDone = async(req,res,next) => {
//     const cuurentDate = new Date()
//     // console.log(cuurentDate)
//     const gettask = await Task.find({
//         status: {$ne: 'done'},  // not =
//         deadline: {$lt: cuurentDate} // $gte (= or grater than), $lt(lower or =)
//     })
//     if (!gettask) return next(new Error("error getting task "));
//     res.json({ message: "succefully", gettask });
// }


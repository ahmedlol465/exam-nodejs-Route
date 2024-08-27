import Joi from 'joi'

// const ageRule = (value, helper) => {
//     if(value == 4 ){
//         throw new Error('age must greater than 4')
//     }
//     return value
// }

export const siginUpSchema = {
    body: Joi.object({
    email: Joi.string().email({ tlds: { allow: ["com", "org"] }, minDomainSegments: 1 }).required(), 
    recoveryEmail: Joi.string().optional(),
    password: Joi.string().required(),
    DOB: Joi.date(),
    mobileNumber: Joi.string(),
    role: Joi.string(),
    status: Joi.string(),
    firstName: Joi.string(),
    lastName: Joi.string()
    }).with('email', 'password')    
    .options({presence: 'required'}), 

};

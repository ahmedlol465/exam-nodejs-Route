import Joi from 'joi'

// const ageRule = (value, helper) => {
//     if(value == 4 ){
//         throw new Error('age must greater than 4')
//     }
//     return value
// }

export const siginUpSchema = {
    body: Joi.object({
    companyName: Joi.string().required(), 
    description: Joi.string(),
    industry: Joi.string().required(),
    address: Joi.string().required(),
    numberOfEmployees: Joi.number().required().min(1).max(10000).integer(),
    companyEmail: Joi.string().email({ tlds: { allow: ["com", "org"] }, minDomainSegments: 1 }),
    companyHR: Joi.string().required(),
    }).with('companyName', 'companyEmail', ) // make companyName with companyEmail validate
    .options({presence: 'required'}),  // make all required

};l

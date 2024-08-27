import Joi from 'joi'

// const ageRule = (value, helper) => {
//     if(value == 4 ){
//         throw new Error('age must greater than 4')
//     }
//     return value
// }

export const siginUpSchema = {
    body: Joi.object({
    jobTitle: Joi.string().required(), 
    jobLocation: Joi.string(),
    workingTime: Joi.string().required(),
    seniorityLevel: Joi.string().required(),
    jobDescription: Joi.string().required(),
    technicalSkills: Joi.string(),
    softSkills: Joi.string().required(), 
    addedBy: Joi.string().required()
    }).options({presence: 'required'}),  // make all required

};

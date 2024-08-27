import Joi from "joi";
import { Types } from "mongoose";

const objectIdValidation = (value, helper) => {
    const isValid = Types.ObjectId.isValid(value);
    return {
    isValid: isValid ? value : helper.message("invalid objecct id ")
    };
} 

export const generateRules = { 
    dbId: Joi.string().custom(objectIdValidation),


    headersRules: Joi.object({
        accesstoken: Joi.string().required(),
        'content-type': Joi.string(),
        'content-length': Joi.string(),
        'user-agent': Joi.string().required(),
        host: Joi.string().required(),
        'accept-encoding': Joi.string(),
        'postman-token': Joi.string(),
        "cache-control": Joi.string(),
        "connection": Joi.string(),
        "accept": Joi.string(),

})
}
 // 1. Add company 
//     - apply authorization with role ( Company_HR )
// 2. Update company data
//     - only the company owner can update the data
//     - apply authorization with role (  Company_HR )
// 3. Delete company data
//     - only the company owner can delete the data
//     - apply authorization with role ( Company_HR)
// 4. Get company data 
//     - send the companyId in params to get the desired company data
//     - return all jobs related to this company
//     - apply authorization with role ( Company_HR)
// 5. Search for a company with a name. 
//     - apply authorization with the role ( Company_HR and User)
// 6. Get all applications for specific Jobs
//     - each company Owner can take a look at the applications for his jobs only, he has no access to other companies’ application
//     - return each application with the user data, not the userId
//     - apply authorization with role (  Company_HR )

import CompanyModel from "../../../DB/moduls/Company.model.js"
import applicationModel from "../../../DB/moduls/Application.model.js"

// ============  add company =================
export const addCompant = async(req,res,next) => {
    const { companyName, description, industry, address, numberOfEmployees, companyEmail, companyHR } = req.body
    const {_id} = req.authUser;


    const isCompanyNameDublicate = await CompanyModel.findOne({companyName})
    if(isCompanyNameDublicate) return next(new Error("company is already exist", { cause: 409 }));

    const add = await CompanyModel.create({
        companyName,
        description,
        industry,
        address,
        numberOfEmployees,
        companyEmail,
        companyHR: _id
    });
    if(!add) return next(new Error("error adding", { cause: 409 }));
    return res.status(200).json({message: "created", success: true, add})
    
}


// =============== Update company data ===========
export const Updatecompanydata = async (req,res,next) => {
        const { companyName, description, industry, address, numberOfEmployees, companyEmail } = req.body
        const { _id} = req.authUser;


    const isCompanyNameDublicate = await CompanyModel.findOne({companyName})
    if(isCompanyNameDublicate) {return next(new Error("company Name is already exist", { cause: 409 }));}

    const updating = await CompanyModel.findOneAndUpdate(
        {companyHR: _id},
        { companyName, description, industry, address, numberOfEmployees, companyEmail },
        {new: true}
        )

if (!updating) {
    return next(new Error("Failed to update data", { cause: 409 }));
}
    res.status(200).json({message: 'updated'})
}


// =============== delete company data ===========
export const Deletecompanydata = async (req,res,next) => {
    const { companyId } = req.params


    const deleting = await CompanyModel.findOneAndDelete(companyId);

if (!deleting) {
    return next(new Error("Failed to delete data", { cause: 409 }));
}
    res.status(200).json({ message: "deleted" });
}



// =============== get company data ===========////////////////////////////////////////////////////////////////
export const getcompanydata = async (req,res,next) => {
    const { companyId } = req.params


    const get = await CompanyModel.findById(companyId).populate('jobs')

if (!get) {
    return next(new Error("Failed to get data", { cause: 409 }));
}
    res.status(200).json({ message: "data" , get});
}


// =============== search company data ===========
export const searchcompanydata = async (req,res,next) => {
    const { companyName } = req.body
    const search = await CompanyModel.find({companyName})
if (!search) {
    return next(new Error("Failed to get company", { cause: 409 }));
}
    res.status(200).json({ message: "Company search successful", search });
}




// =============== get appliction company data ===========////////////////////////////////////////////////////////////////
export const getcompanyapplications = async (req,res,next) => {
    const { jobId } = req.params

    const get = await applicationModel.find({jobId}).populate("userId");

if (!get) {
    return next(new Error("Failed to get data", { cause: 409 }));
}
    res.status(200).json({ message: "data" , get});
}




// collect all applications from this company inb spaccific date
// =============== end point ===========////////////////////////////////////////////////////////////////
export const exelDataSheet = async (req,res,next) => {
    const { specificcompanyName, specificdate } = req.params  

    const findAplicaionsInExall = await applicationModel.find(specificcompanyName).populate(jobs)

if (!get) {
    return next(new Error("Failed to get data", { cause: 409 }));
}
    res.status(200).json({ message: "data" , get});
}



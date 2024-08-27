// 1. Add Job
//     - apply authorization with the role ( Company_HR )
// 2. Update Job
//     - apply authorization with the role ( Company_HR )
// 3. Delete Job
//     - apply authorization with the role ( Company_HR )
// 4. Get all Jobs with their company’s information.
//     - apply authorization with the role ( User , Company_HR )
// 5. Get all Jobs for a specific company.
//     - apply authorization with the role ( User , Company_HR )
//     - send the company name in the query and get this company jobs.
// 6. Get all Jobs that match the following filters
//     - allow user to filter with workingTime , jobLocation , seniorityLevel and jobTitle,technicalSkills
//     - one or more of them should applied
//     **Exmaple** : if the user selects the
//     **workingTime** is **part-time** and the **jobLocation** is **onsite**
//     , we need to return all jobs that match these conditions
//     - apply authorization with the role ( User , Company_HR )
// 7. Apply to Job
//     - This API will add a new document in the application Collections with the new data
//     - apply authorization with the role ( User )



import CompanyModel from '../../../DB/moduls/Company.model.js';
import jobSchema from '../../../DB/moduls/job.model.js'
import applicationModel from '../../../DB/moduls/Application.model.js'
import generateUniqueString from "../../uitils/generateUniqeString.js";
import cloudnaryConnection from "../../uitils/cloudnary.js";
import  xlsx  from 'exceljs';
import  exceljs  from 'exceljs';
import  fs  from 'fs';


//================== add job ==================
export const addJob = async(req,res,next) => {
    const { _id } = req.authUser

        const {
            jobTitle,
            jobLocation,
            workingTime,
            seniorityLevel,
            jobDescription,
            technicalSkills,
            softSkills
        } = req.body;



    const add = await jobSchema.create({
        jobTitle,
        jobLocation,
        workingTime,
        seniorityLevel,
        jobDescription,
        technicalSkills,
        softSkills,
        addedBy: _id,
    });
    if(!add) return next (new Error ('error adding this job', {cause: 409}))
    res.status(200).json({message: 'created job', add})
}


// ====================  update job ================= 
export const UpdateJob = async(req,res,next) => {
        const {
            jobTitle,
            jobLocation,
            workingTime,
            seniorityLevel,
            jobDescription,
            technicalSkills,
            softSkills
        } = req.body;
        const { jobId } = req.params
        const {role} = req.authUser;
        if (role !== 'Company_HR') {
            return res.status(403).json({ message: 'Unauthorized', success: false });
    }

    const updating = await jobSchema.findByIdAndUpdate(jobId, {
        jobTitle,
        jobLocation,
        workingTime,
        seniorityLevel,
        jobDescription,
        technicalSkills,
        softSkills,
    }, {new: true});
    if(!updating) return next (new Error ('error update data', {cause: 409}))
    res.status(200).json({message: 'updated job', updating})
}


// ====================  delete job ================= 
export const DeleteJob = async(req,res,next) => {
    const { jobId } = req.params

    const deleting = await jobSchema.findByIdAndDelete(jobId);
    if(!deleting) return next (new Error ('error delete the job', {cause: 409}))
    res.status(200).json({message: 'deleted'})
}




// ====================  get job for company ================= 
export const GetJobs = async(req,res,next) => {
    const jobs = await jobSchema.find().populate('companies')
    if(!jobs) return next (new Error ('error getting the jobs', {cause: 409}))
    res.status(200).json({message: 'the jobs', jobs})
}



// ====================  get job spacific for company ================= 
export const GetspecificJobs = async(req,res,next) => {
    const {companyName} = req.query 

    const findcompany = await CompanyModel.findOne(companyName)
    if(!findcompany) return next (new Error ('error getting the jobs', {cause: 409}))

    const getjob = await jobSchema.find({ addedBy: findcompany.companyHR });

    res.status(200).json({ message: "the jobs", getjob });
}


// ===========  get jobs fillter ===============
export const filterJob = async(req,res,next) => {
    const { workingTime , jobLocation , seniorityLevel , jobTitle, technicalSkills } = req.body
            const query = {};
            if (workingTime) query.workingTime = workingTime;
            if (jobLocation) query.jobLocation = jobLocation;
            if (seniorityLevel) query.seniorityLevel = seniorityLevel;
            if (jobTitle) query.jobTitle = new RegExp(jobTitle, "i");
            if (technicalSkills) query.technicalSkills = { $in: technicalSkills };

    const filltering = await jobSchema.find(query);
        if(!filltering) return next (new Error ('error getting the jobs', {cause: 409}))

    res.status(200).json({ message: "the jobs", filltering });
}



// ===================  apply job ==============
export const applyingJobs = async(req,res,next) => {
    // get application mole to create
    const { jobId } = req.params
    const { _id } = req.authUser

    const { userTechSkills, userSoftSkills } = req.body

    if(!req.files?.length) {return next(new Error('please upload your resume', { causer: 409 }))}

    let userResume = [];
    let publicIdsArr = []
    const folderId = generateUniqueString(4)

    for (const file of req.files) {  // make block on one loop
        const { secure_url, public_id } = await cloudnaryConnection().uploader.upload(file.path, {
            folder: `userResume/applications/${_id}/${folderId}`
        })
        // console.log(imageData)
        publicIdsArr.push(public_id)
        userResume.push({ secure_url, public_id, folderId });
    }

  // create application
    const addDataApplication = await applicationModel.create({
        jobId,
        userId: _id,
        userResume,
        userTechSkills,
        userSoftSkills,
        
    });

console.log(addDataApplication);

    if(!addDataApplication) {
        for (const resume of userResume) {
        const data = await cloudnaryConnection().api.delete_all_resources(publicIdsArr)  // alot photo
            console.log(data)
        }
            res.json({message: 'errooooooor', success: false})
    }

    res.json({message: 'added succrfully', success: true, data: addDataApplication})

}






export const addExallData = async(req,res,next) => {

try {

let data = {
    name: "ahmed"
}
    // let workbook = new exceljs.Workbook()

    // const sheet = workbook.addWorksheet("book")
    // sheet.columns = [
    //     {header: 'isbn', key: 'isbn', width: 25}
    // ]

  const workbook = new exceljs.Workbook();
  const worksheet = workbook.addWorksheet('Sheet 1');

  // Add headers to the worksheet
  worksheet.addRow(['Name', /* Add other headers as needed */]);

  // Add data to the worksheet
  data.forEach((item) => {
    worksheet.addRow([item.name /* Add other data fields as needed */]);
  });

  // Save the workbook to a file
  workbook.xlsx.writeFile('output.xlsx')
    .then(() => {
      console.log('Excel file created successfully');
    })
    }  catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
    }
}
// Importing CompanyModel and applicationModel from their respective modules
import CompanyModel from "../../../DB/models/Company.model.js";
import applicationModel from "../../../DB/models/Application.model.js";
import xlsx from 'xlsx';
import exceljs from "exceljs";


export const addCompant = async (req, res, next) => {
  // Extracting necessary data from the request body and authenticated user
    const {
    companyName,
    description,
    industry,
    address,
    numberOfEmployees,
    companyEmail,
    companyHR,
    } = req.body;
    const { _id } = req.authUser;

  // Checking for duplicate company names
    const isCompanyNameDublicate = await CompanyModel.findOne({ companyName });
    if (isCompanyNameDublicate)
    return next(new Error("Company is already exist", { cause: 409 }));

  // Creating a new company
    const add = await CompanyModel.create({
    companyName,
    description,
    industry,
    address,
    numberOfEmployees,
    companyEmail,
    companyHR: _id,
    });

  // Handling success or error response
    if (!add) return next(new Error("Error adding company", { cause: 409 }));
    return res
    .status(200)
    .json({ message: "Company created", success: true, add });
};

// ========== 2. Update company data ==========
export const Updatecompanydata = async (req, res, next) => {
  // Extracting necessary data from the request body and authenticated user
    const {
    companyName,
    description,
    industry,
    address,
    numberOfEmployees,
    companyEmail,
    } = req.body;
    const { _id } = req.authUser;

  // Checking for duplicate company names
    const isCompanyNameDublicate = await CompanyModel.findOne({ companyName });
    if (isCompanyNameDublicate) {
    return next(new Error("Company Name is already exist", { cause: 409 }));
    }

  // Updating company data
    const updating = await CompanyModel.findOneAndUpdate(
    { companyHR: _id },
    {
        companyName,
        description,
        industry,
        address,
        numberOfEmployees,
        companyEmail,
    },
    { new: true }
    );

  // Handling success or error response
    if (!updating) {
    return next(new Error("Failed to update company data", { cause: 409 }));
    }
    res.status(200).json({ message: "Company data updated" });
};

// ========== 3. Delete company data ==========
export const Deletecompanydata = async (req, res, next) => {
  // Extracting companyId from request parameters
    const { companyId } = req.params;

  // Deleting company data
    const deleting = await CompanyModel.findOneAndDelete(companyId);

  // Handling success or error response
    if (!deleting) {
    return next(new Error("Failed to delete company data", { cause: 409 }));
    }
    res.status(200).json({ message: "Company data deleted" });
};

// ========== 4. Get company data ==========
export const getcompanydata = async (req, res, next) => {
  // Extracting companyId from request parameters
    const { companyId } = req.params;

  // Getting company data and populating jobs
    const get = await CompanyModel.findById(companyId).populate("jobs");

  // Handling success or error response
    if (!get) {
    return next(new Error("Failed to get company data", { cause: 409 }));
    }
    res.status(200).json({ message: "Company data retrieved", get });
};

// ========== 5. Search company data ==========
export const searchcompanydata = async (req, res, next) => {
  // Extracting companyName from request body
    const { companyName } = req.body;

  // Searching for companies with the given name
    const search = await CompanyModel.find({ companyName });

  // Handling success or error response
    if (!search) {
    return next(new Error("Failed to get company data", { cause: 409 }));
    }
    res.status(200).json({ message: "Company search successful", search });
};

// ========== 6. Get applications for specific Jobs ==========
export const getcompanyapplications = async (req, res, next) => {
  // Extracting jobId from request parameters
    const { jobId } = req.params;

  // Getting applications for the specified job and populating userId
    const get = await applicationModel.find({ jobId }).populate("userId");

  // Handling success or error response
    if (!get) {
    return next(new Error("Failed to get applications data", { cause: 409 }));
    }
    res.status(200).json({ message: "Applications data retrieved", get });
};








// Function to add data to Excel file
export const addExallData = async (req, res, next) => {
    try {
        const {companyId } = req.params
        // Sample data to be added to the Excel file
        // let data = [
        //     { name: "ahmed" },
        //     // Add other data objects as needed
        // ];

            const data = await CompanyModel.findById(companyId).lean()
        
            console.log(data)

        // Create a new Excel workbook and worksheet
        const workbook = new exceljs.Workbook();
        const worksheet = workbook.addWorksheet('Sheet 1');

        // Add headers to the worksheet
        worksheet.addRow(['Name', " email"]);

        // Add data to the worksheet
        // data.forEach((item) => {
            worksheet.addRow([
              data.companyName /* Add other data fields as needed */,
            ]);
        // });

        // Save the workbook to a file
        await workbook.xlsx.writeFile("output.xlsx");

        // Send a success response
        res.status(200).json({ message: 'Excel file created successfully' });

    } catch (error) {
        console.error(error);
        // Send an error response
        res.status(500).json({ error: 'Internal server error' });
    }
};

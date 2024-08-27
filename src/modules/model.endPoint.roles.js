// Importing systemRoles utility for defining role-based access control
import { systemRoles } from "../uitils/system.role.js";

// Defining roles for various endpoints in the application
export const endPointsRoles = {
    JOB: [systemRoles.Company_HR, systemRoles.USER],
    COMPANY: [systemRoles.Company_HR, systemRoles.USER],
    USER: [systemRoles.Company_HR, systemRoles.USER],
    USER_ONLY: [systemRoles.USER],
    HR_ONLY: [systemRoles.Company_HR],
};

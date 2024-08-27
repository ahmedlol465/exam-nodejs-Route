import { systemRoles } from "../uitils/system.role.js";

export const endPointsRoles = {
    JOB : [systemRoles.Company_HR, systemRoles.USER],
    COMPANY: [systemRoles.Company_HR, systemRoles.USER],
    USER: [systemRoles.Company_HR, systemRoles.USER],
    USER_ONLY: [ systemRoles.USER],
    HR_ONLY: [ systemRoles.Company_HR],

};

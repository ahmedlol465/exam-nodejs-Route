// Importing necessary modules and dependencies
import express from "express";
import userRouter from "./src/modeles/User/user.routs.js";
import companyRouter from "./src/modeles/company/company.routs.js";
import JobRouter from "./src/modeles/Job/job.routs.js";
import db_connection from "./DB/connection/connection.js";
import { config } from "dotenv";
import { globalResponse } from "./src/middleware.js/globalResponse.js";

// Configuring environment variables
config({ path: "./config/dev.config.env" });

// Creating an Express application instance
const app = express();

// Setting up middleware to parse JSON requests
app.use(express.json());

// Extracting port from environment variables
const port = process.env.port;

// Routing for user, company, and job modules
app.use("/user", userRouter);
app.use("/company", companyRouter);
app.use("/Job", JobRouter);

// Establishing database connection
db_connection();

// Adding global response middleware
app.use(globalResponse);

// Starting the server on the specified port
app.listen(port, () => console.log("App is running on port:", port));

// HTTP Status Codes:
// 200 Success
// 201 Created
// 204 No success with no data

// 400 Wrong data
// 401 Unauthorized
// 409 Conflict - Already exists
// 404 Not found
// 403 Forbidden - Not allowed

// 500 Internal server error
// 502 Bad gateway

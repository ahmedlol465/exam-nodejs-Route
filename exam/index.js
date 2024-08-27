import express from 'express'
import userRouter from './src/modules/User/user.routs.js'
import companyRouter from './src/modules/company/company.routs.js'
import JobRouter from './src/modules/Job/job.routs.js'
import db_connection from './DB/connection/connection.js'
import {config} from 'dotenv'
import { globalResponse } from './src/middleware.js/globalResponse.js';
config({path:'./config/dev.config.env'})
const app = express()
app.use(express.json())
const port = process.env.port




app.use('/user', userRouter)  
app.use('/company', companyRouter)  
app.use('/Job', JobRouter)  

db_connection ()
app.use(globalResponse)
app.listen(port, ()=> console.log('app is work'))





// 200 sucess
// 201 created
// 204 no succese with no data 

// 400 wrong data
// 401 unezurized
// 409 comflect already exist 
// 404  not found 
// 403 forbiden  not found 

// 500 internet server error 
// 502 bad getwar
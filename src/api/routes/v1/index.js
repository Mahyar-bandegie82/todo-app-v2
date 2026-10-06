import express from 'express'
import adminRoute from './admin/admin.route.js'
import taskRoute from './tasks/task.route.js'
import userRoute from './users/auth.route.js'
import cookieParser from 'cookie-parser';



function V1Loader(){
    const app = express.Router()
    app.use(cookieParser())
    app.use('/admin', adminRoute)
    app.use('/tasks', taskRoute)
    app.use('/users',  userRoute)

    return app
}

export default V1Loader
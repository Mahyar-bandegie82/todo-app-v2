import express from 'express'
import { validatorMIddleware } from './api/middleware/userSchemaValidation.js';
import userRoute from './api/routes/V1/users/auth.route.js'
import taskRoute from './api/routes/v1/tasks/task.route.js'
import adminRoute from './api/routes/V1/admin/admin.route.js';


const app = express();
const port = process.env.PORT || 8080;

app.use(express.json());

app.use('/api/v1/users', userRoute);
app.use('/api/v1/tasks', taskRoute);
app.use('/api/v1/admin', adminRoute);

app.listen(port, () => {
    console.log(`app is runing http://localhost:${port}`);
});
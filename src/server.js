import express from 'express'
import {validatorMIddleware} from './api/middleware/userSchemaValidation.js';
import userRoute from './api/routes/v1/users/auth.js'


const app = express();
const port = process.env.PORT || 8080;

app.use(express.json());
app.use(userRoute)

app.get('/', (req, res) => {
    res.send('healthy root');
});

app.listen(port, () => {
    console.log(`app is runing http://localhost:${port}`);
});
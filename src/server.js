import express from 'express'
import routeLoader from './api/routes/index.js';


const app = express();
const port = process.env.PORT || 8080;

app.use(express.json());

app.use('/api', routeLoader())



app.listen(port, () => {
    console.log(`app is runing http://localhost:${port}`);
});
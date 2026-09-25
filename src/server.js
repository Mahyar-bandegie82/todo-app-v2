import express from 'express'

const app = express();
const port = process.env.PORT || 8080;

app.get('/', (req, res) => {
    res.send('healthy root');
});

app.listen(port, () => {
    console.log(`app is runing http://localhost:${port}`);
});
import  JsonWebToken  from "jsonwebtoken";

export default function validateJWT(req, res, next) {
    const incomingToken = req.headers.authorization
    const validToken = incomingToken ? incomingToken.split(' ')[1] : ''
    if (!validToken) return res.status(401).json({ error: 'No token provided' });

    JsonWebToken.verify(validToken , process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if(err) return res.status(402).json({ error: 'Invalid token' });
        req.user = user.userId;
        next()
    })
}
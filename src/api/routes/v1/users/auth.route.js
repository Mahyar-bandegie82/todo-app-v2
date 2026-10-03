import express from 'express';
import { validatorMIddleware } from '../../../middleware/userSchemaValidation.js';
import { signupSchema } from '../../../../validation/users/userDatavalidation.js';
import { loginSchema } from '../../../../validation/users/userDatavalidation.js';
import { editUserSchema } from '../../../../validation/users/userDatavalidation.js';
import { signUpUser } from '../../../../services/users/auth.js'
import { loginUser } from '../../../../services/users/auth.js'
import { editUser } from '../../../../services/users/auth.js'
import jsonwebtoken from 'jsonwebtoken';
import validateJWT from '../../../middleware/jwtvalidation.js'

const router = express.Router()

router.post('/signup', async (req, res) => {
    try {
        const data = req.body;
        const { error, value } = signupSchema.validate(data, { abortEarly: false });
        if (error) {
            return res.status(402).json({error: error.details.map(err => err.message)})
        }
        const newUser = await signUpUser(value);
        const jwt = jsonwebtoken.sign(
            { userId: newUser.id },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '1h' }
        );
        return res.status(201).json({
            token: jwt,
            user: data.user_name
        });

    } catch (err) {
        console.error('Signup Error:', err);
        return res.status(500).json({ message: err })
    }
})

router.post('/login', async (req, res) => {
    try {
        const data = req.body;
        const { error, value } = loginSchema.validate(data, { abortEarly: false });
        if (error) {
            return res.status(402).json({error: error.details.map(err => err.message)})
        }
        const newUser = await loginUser(data);
        const jwt = jsonwebtoken.sign(
            { userId: newUser.id },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '24h' }
        );
        return res.status(200).json({
            token: jwt,
            user: data.user_name
        });
    } catch (err) {
        console.error('Login Error:', err);
        return res.status(401).json({ message: 'Invalid username or password' });
    }
});

router.put('/edituser', validateJWT, async (req, res) => {
    try {
        const data = req.body;
        const userId = req.user; 
        const { error, value } = editUserSchema.validate(data, {abortEarly : false});
        if (error) {
            return res.status(402).json({ error: error.details.map(err => err.massage) })
        }
        const updatedUser = await editUser(userId, value);
        return res.status(200).json({
            message: 'User updated successfully',
            user: updatedUser.user_name
        });
    } catch (err) {
        console.error('Edit User Error:', err);
        return res.status(500).json({ message: 'Internal server error' });
    }
});

export default router;
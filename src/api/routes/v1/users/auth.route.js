import express from 'express';
import { validatorMIddleware } from '../../../middleware/userSchemaValidation.js';
import { signupSchema } from '../../../../validation/users/userDatavalidation.js';
import { loginSchema } from '../../../../validation/users/userDatavalidation.js';
import { editUserSchema } from '../../../../validation/users/userDatavalidation.js';
import { signUpUser } from '../../../../services/users/auth.js'
import { loginUser } from '../../../../services/users/auth.js'
import { editUser } from '../../../../services/users/auth.js'
import jsonwebtoken from 'jsonwebtoken';

const router = express.Router()

router.post('/api/v1/auth/signup', validatorMIddleware(signupSchema), async (req, res) => {
    try {
        const data = req.body;
        const newUser = await signUpUser(data);
        const jwt = jsonwebtoken.sign(
            { userId: newUser.id },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '30s' }
        );
        return res.status(201).json({
            token: jwt,
            user: data.user_name
        });

    } catch (err) {
        console.error('Signup Error:', err);
        return res.status(500).json({ message: 'Internal server error' })
    }
})

router.post('/api/v1/auth/login', validatorMIddleware(loginSchema), async (req, res) => {
    try {
        const data = req.body;
        const newUser = await loginUser(data);
        const jwt = jsonwebtoken.sign(
            { userId: newUser.id },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '30s' }
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

router.put('/api/v1/auth/edituser', validatorMIddleware(editUserSchema), async (req, res) => {
    try {
        const data = req.body;
        if (!data.user_name) {
            return res.status(400).json({ message: 'user_name is required to edit user' });
        }
        const updatedUser = await editUser(data);
        return res.status(200).json({
            message: 'User updated successfully',
            user: updatedUser
        });
    } catch (err) {
        console.error('Edit User Error:', err);
        return res.status(500).json({ message: 'Internal server error' });
    }
});

export default router;
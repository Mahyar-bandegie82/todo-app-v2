import express from 'express';
import { validatorMIddleware } from '../../../middleware/userSchemaValidation.js';
import { signupSchema } from '../../../../validation/users/userDatavalidation.js';
import { loginSchema } from '../../../../validation/users/userDatavalidation.js';
import {signUpUser} from '../../../../services/users/auth.js'

const router = express.Router()

router.post('/api/v1/auth/signup', validatorMIddleware(signupSchema), async (req, res) => {
    try {
        const data = req.body;
        const newUser = await signUpUser(data);

        return res.status(200).json({
            massage : 'it works',
            user : newUser
        });
    } catch (err) {
        console.error('Signup Error:', err);
        return res.status(500).json({ message: 'Internal server error' })
    }
})

export default router;
import express from 'express';
import { validatorMIddleware } from '../../../middleware/userSchemaValidation.js';
import { signupSchema } from '../../../../validation/users/userDatavalidation.js';
import { loginSchema } from '../../../../validation/users/userDatavalidation.js';

const router = express.Router()

router.post('/api/v1/auth/signup', validatorMIddleware(signupSchema), async (req, res) => {
    try {
        const data = req.body;
        res.status(200).json({
            message: 'Validation passed successfully!',
            validatedData: data,
        });
    } catch (err) {
        console.log(err);
        throw err;
    }
})

export default router;
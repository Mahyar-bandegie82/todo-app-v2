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
import cookieParser from 'cookie-parser';
import crypto from 'node:crypto';
import { getRefreshTokenByHash, addRefreshToken, revokeRefreshToken } from '../../../../services/users/auth.js'

const router = express.Router()
export function generateAccessToken(userId) {
    return jsonwebtoken.sign({ userId }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '30s' });
}

export function generateRefreshToken(userId) {
    return jsonwebtoken.sign({ userId }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '1m' });
}

router.post('/refresh', async (req, res) => {
    const refreshToken = req.cookies?.refreshToken;
    if (!refreshToken) {
        return res.status(401).json({ message: 'Refresh token cookie missing' });
    }
    try {
        const decoded = jsonwebtoken.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
        const hashedToken = crypto.createHash('sha256').update(refreshToken).digest('hex');
        const refreshTokenData = await getRefreshTokenByHash(hashedToken);
        if (!refreshTokenData || refreshTokenData.is_revoked) {
            await revokeRefreshToken(hashedToken);
            return res.status(403).json({ message: 'Invalid or revoked refresh token' });
        }
        if (new Date() > refreshTokenData.expires_at) {
            await revokeRefreshToken(hashedToken);
            return res.status(403).json({ message: 'Refresh token has expired' });
        }
        await revokeRefreshToken(hashedToken);
        const newRefreshToken = generateRefreshToken(decoded.userId);
        await addRefreshToken(decoded.userId, newRefreshToken);

        const newAccessToken = generateAccessToken(decoded.userId);
        res.cookie('refreshToken', newRefreshToken, { httpOnly: true, secure: true, sameSite: 'Strict', maxAge: 24 * 60 * 60 * 1000 });
        return res.status(200).json({ accessToken: newAccessToken });
    }
    catch (err) {
        console.error('Refresh Token Error:', err);
        return res.status(403).json({ message: 'Invalid refresh token' });
    }
})

router.post('/logout', async (req, res) => {
    const refreshToken = req.cookies?.refreshToken;
    if (!refreshToken) {
        return res.status(400).json({ message: 'Refresh token cookie missing' });
    }
    try {
        const hashedToken = crypto.createHash('sha256').update(refreshToken).digest('hex');
        await revokeRefreshToken(hashedToken);
        res.clearCookie('refreshToken');
        return res.status(200).json({ message: 'Logged out successfully' });
    } catch (err) {
        console.error('Logout Error:', err);
        return res.status(500).json({ message: 'Internal server error' });
    }
});

router.post('/signup', async (req, res) => {
    try {
        const data = req.body;
        const { error, value } = signupSchema.validate(data, { abortEarly: false });
        if (error) {
            return res.status(402).json({ error: error.details.map(err => err.message) })
        }
        const newUser = await signUpUser(value);
        const accessToken = generateAccessToken(newUser.id);
        const refreshToken = generateRefreshToken(newUser.id);
        await addRefreshToken(newUser.id, refreshToken);
        res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: true, sameSite: 'Strict', maxAge: 24 * 60 * 60 * 1000 });

        return res.status(201).json({
            token: accessToken,
            refreshToken: refreshToken,
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
            return res.status(402).json({ error: error.details.map(err => err.message) })
        }
        const newUser = await loginUser(data);
        const accessToken = generateAccessToken(newUser.id);
        const refreshToken = generateRefreshToken(newUser.id);
        await addRefreshToken(newUser.id, refreshToken);
        res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: true, sameSite: 'Strict', maxAge: 24 * 60 * 60 * 1000 });

        return res.status(201).json({
            token: accessToken,
            refreshToken: refreshToken,
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
        const { error, value } = editUserSchema.validate(data, { abortEarly: false });
        if (error) {
            return res.status(402).json({ error: error.details.map(err => err.message) })
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
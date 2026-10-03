import express from 'express'
import isAdmin from '../../../middleware/isadmin.js'
import validateJWT from '../../../middleware/jwtvalidation.js'
import { validatorMIddleware } from '../../../middleware/userSchemaValidation.js'
import { loginAdmin, createUserSchema, createTasks, loginuser, updateUserCredentials, deleteUserSchema, editTask, deleteTaskSchema } from '../../../../validation/admin/admin.validation.js'
import { adminLogin, adminSignupUser, adminUserLogin, deleteUser, editUserCred, getAllTasks, getAllUsers, createTaskAdmin, updateTasks, deleteTaskAdmin } from '../../../../services/admin/CRUD.js'
import jsonwebtoken from 'jsonwebtoken';


const router = express.Router();


router.post('/login', async (req, res) => {
    try {
        const data = req.body;
        const { error, value } = loginAdmin.validate(data, { abortEarly: false });
        if (error) {
            return res.status(402).json({ error: error.details.map(err => err.message) })
        }

        const newUser = await adminLogin(value);
        const jwt = jsonwebtoken.sign(
            { userId: newUser.id },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '24h' }
        );
        return res.status(200).json({
            token: jwt,
            user: data.user_name
        });
    }
    catch (err) {
        console.error('Login Error:', err);
        return res.status(401).json({ message: 'Invalid username or password' });
    }

})

router.use(validateJWT)
router.use(isAdmin)

router.post('/signupUser', validatorMIddleware(createUserSchema), async (req, res) => {
    const data = req.body;
    const { error, value } = createUserSchema.validate(data, { abortEarly: false });
    if (error) {
        return res.status(402).json({ error: error.details.map(err => err.message) })
    }
    const user = req.user

    if (!user) {
        throw new Error("invalid admin id")
    }

    const newUser = await adminSignupUser(value)
    if (!newUser) {
        res.status(400).json({ massage: "invalid cred" })
    }
    res.sendStatus(200).json({
        massage: 'user added',
        user: newUser
    })
})

router.post('/loginUser', async (req, res) => {
    try {
        const data = req.body;
        const { error, value } = loginuser.validate(data, { abortEarly: false });
        if (error) {
            return res.status(402).json({ error: error.details.map(err => err.message) })
        }
        const adminuser = req.user
        if (!data || !adminuser) {
            return res, sendStatus(404).json({ massage: 'somthing went wrong' })
        }
        const loggedinUser = await adminUserLogin(value)
        res.status(200).json({ masage: 'logged in ', loggedinUser })
    }
    catch (err) {
        throw err
    }
})

router.put('/editUser', validatorMIddleware(updateUserCredentials), async (req, res) => {
    try {
        const data = req.body;
        const { error, value } = updateUserCredentials.validate(data, { abortEarly: false });
        if (error) {
            return res.status(402).json({ error: error.details.map(err => err.message) })
        }
        const adminuser = req.user
        if (!value || !adminuser) {
            return res, sendStatus(404).json({ massage: 'somthing went wrong' })
        }

        const editedUser = await editUserCred(value)

        res.status(202).json({ massage: "user updated was a success", user: editedUser })
    }
    catch (err) {
        console.log(err)
        throw err
    }

})

router.get('/getUsers', async (req, res) => {
    try {
        const admin = req.user
        if (!admin) { return res.sendStatus(404).json({ massage: "somthing went wrong" }) }

        const allUsers = await getAllUsers()
        return res.status(202).json({ massage: allUsers })
    }
    catch (err) {
        console.log(err)
        throw err
    }
})

router.delete('/deleteUsers', validatorMIddleware(deleteUserSchema), async (req, res) => {
    try {
        const data = req.body;
        const { error, value } = deleteUserSchema.validate(data, { abortEarly: false });
        if (error) {
            return res.status(402).json({ error: error.details.map(err => err.message) })
        }
        if (!value || !req.user) {
            res.sendStatus(500)
        }
        const deleted = deleteUser(value)
        res.status(200).json({ massage: ' user delted', data: deleted })
    }
    catch (err) {
        throw err
    }
})

router.get('/readTasks', async (req, res) => {
    try {
        const admin = req.user
        if (!admin) { return res.sendStatus(404).json({ massage: "somthing went wrong" }) }

        const alltodos = await getAllTasks()
        return res.status(202).json({ massage: alltodos })
    }
    catch (err) {
        console.log(err)
        throw err
    }
})

router.post('/createTask', async (req, res) => {
    const admin = req.user;
    const data = req.body;
    const { error, value } = createTasks.validate(data, { abortEarly: false });
    if (error) {
        return res.status(402).json({ error: error.details.map(err => err.message) })
    }
    if (!admin) { return res.sendStatus(404).json({ massage: "somthing went wrong" }) }

    const task = await createTaskAdmin(value)
    if (!task) { return res.send(500) }

    return res.status(200).json({ massage: "task created", task: task })
})


router.put('/editTasks', async (req, res) => {
    try {
        const data = req.body;
        const { error, value } = editTask.validate(data, { abortEarly: false });
        if (error) {
            return res.status(402).json({ error: error.details.map(err => err.message) })
        }
        const admin = req.user
        if (!admin) { return res.sendStatus(404).json({ massage: "somthing went wrong" }) }
        const task = await updateTasks(value);
        return res.status(200).json({ massage: "updated", task: task })
    }
    catch (err) {
        throw err
    }
})

router.delete('/deleteTask', validatorMIddleware(deleteTaskSchema), async (req, res) => {
    try {
        const data = req.body;
        const { error, value } = deleteTaskSchema.validate(data, { abortEarly: false });
        if (error) {
            return res.status(402).json({ error: error.details.map(err => err.message) })
        }
        const admin = req.user
        if (!admin) { return res.sendStatus(404).json({ massage: "somthing went wrong" }) }
        const delted = await deleteTaskAdmin(value);
        res.status(200).json({ massage: 'deleted', task: delted })
    } catch (err) {
        throw err
    }

})
export default router
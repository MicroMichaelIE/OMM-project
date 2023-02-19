import express from 'express'
import { getUser, login, signUp } from '../services/user.js'
import { authenticateJWT } from '../services/auth/authentication.js'

const router = express.Router()

// POST api/users/login
router.post('/login', login)

// POST api/users/signup
router.post('/signup', signUp)

// GET api/users
router.get('/', authenticateJWT, getUser)

// verify token
router.post('/verify', authenticateJWT, (req, res) => {
    res.status(200).json({
        message: 'Token verified',
    })
})

export default router

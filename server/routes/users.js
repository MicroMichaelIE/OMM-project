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

export default router

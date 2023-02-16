import User from '../models/user.js'
import { generateJWT } from '../services/auth/authentication.js'
import { compareHash, generateHash } from '../services/auth/hashing.js'

export const login = async (req, res) => {
    console.log('login')
    const body = req.body
    const email = body.email
    const password = body.password

    try {
        const user = await User.findOneAndUpdate(
            { email: email },
            { $set: { lastLogin: Date.now() } },
            { new: true, upsert: true }
        )
        console.log(user)
        if (user != null) {
            if (await compareHash(password, user.password)) {
                const token = generateJWT(user)
                res.status(201).json({ token: token })
            } else {
                throw new Error('Either email or password are incorrect')
            }
        } else {
            throw new Error('Either email or password are incorrect')
        }
    } catch (error) {
        res.status(403).json({ message: error.message })
    }
}

export const signUp = async (req, res) => {
    const body = req.body
    const email = body.email
    console.log(body)
    const password = body.password

    try {
        const hashedPassword = await generateHash(password)
        const newUser = new User({
            email: email,
            password: hashedPassword,
        })
        await newUser.save()
        const token = generateJWT(newUser)
        res.status(201).json({ token: token })
    } catch (error) {
        res.status(409).json({ message: error.message })
    }
}

export const getUser = async (req, res) => {
    const id = req.user_id
    try {
        const user = await User.findById(id)
        res.status(200).json({ user: user })
    } catch (error) {
        res.status(404).json({ message: error.message })
    }
}

import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config()

// This line is here so that if there's no .env file, it will use the default value. This is for testing purposes.
const accessTokenSecret =
    process.env.ACCESS_TOKEN_SECRET || '0F78EDF1-1E5E-47F9-A47E-0A115AFD19DD'

/**
 * @description Generate JWT token
 * @param {Object} userAuth userAuth is type from frontend (username, password)
 * @returns {string} token
 * @returns {null} if error
 * @example const token = generateJWT(userAuth)
 */

export const generateJWT = (userAuth) => {
    try {
        const token = jwt.sign(
            {
                _id: userAuth._id,
                username: userAuth.email,
                password: userAuth.password,
            },
            process.env.ACCESS_TOKEN_SECRET
        )

        return token
    } catch (err) {
        console.log(err)
        return null
    }
}

/**
 * Verify JWT token
 * @description Verify JWT token and next if valid
 * @param {Object} req
 * @param {Object} res
 * @param {Object} next
 * @returns {Object} res
 * @returns {Object} next
 * @example router.get('/getMemesUser', authenticateJWT, getMemesByUserId)
 */

export const authenticateJWT = (req, res, next) => {
    const authHeader = req.headers.authorization
    if (authHeader) {
        const token = authHeader.split(' ')[1]
        try {
            const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
            req.user_id = decoded._id
            next()
        } catch (err) {
            if (err) {
                return res.sendStatus(403)
            }
        }
    } else {
        res.sendStatus(401)
    }
}

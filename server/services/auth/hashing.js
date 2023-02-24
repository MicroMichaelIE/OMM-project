import bcrypt from 'bcrypt'
const saltRounds = 10

/**
 * @description Generate hash from password
 * @param {string} password
 * @returns {string} hash
 * @returns {null} if error
 */

export const generateHash = async (password) => {
    try {
        const salt = await bcrypt.genSalt(saltRounds)
        const hash = await bcrypt.hash(password, salt)
        return hash
    } catch (e) {
        console.log(e)
        return null
    }
}

/**
 * @description Compare password with hash
 * @param {string} entryPassword
 * @param {string} hashedPassword
 * @returns {boolean} result
 * @returns {null} if error
 */

export const compareHash = async (entryPassword, hashedPassword) => {
    let result = null
    try {
        result = await bcrypt.compare(entryPassword, hashedPassword)
    } catch (e) {
        console.log(e)
        return null
    }
    return result
}

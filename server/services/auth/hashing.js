import bcrypt from 'bcrypt'
const saltRounds = 10

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

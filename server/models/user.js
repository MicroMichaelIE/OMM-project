import mongoose from 'mongoose'

// define a mongoose schema for item
const userSchema = mongoose.Schema({
    username: {
        type: String,
        unique: true,
    },
    password: { type: String, required: true },
    email: {
        type: String,
        unique: true,
        required: true,
    },
    userFirstName: { type: String },
    userlastName: { type: String },
    profilePicture: { type: String },
    creationDate: { type: Date, default: Date.now },
    lastLogin: { type: Date, default: Date.now },
})

// construct an item model, using the item schema
const User = mongoose.model('User', userSchema)

export default User

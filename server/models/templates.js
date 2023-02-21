import mongoose from 'mongoose'

// define a mongoose schema for item
const templateSchema = mongoose.Schema({
    name: { type: String, required: true },
    givenName: { type: String, required: true },
    owner: { type: String, ref: 'User', required: true },
    date: { type: Date, default: Date.now },
    imageLocation: { type: String, required: true },
    published: { type: Boolean, default: false },
})

const MemeTemplate = mongoose.model('Template', templateSchema)
export default MemeTemplate

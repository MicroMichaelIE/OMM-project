import mongoose from 'mongoose'

// define a mongoose schema for item
const templateSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: { type: String, required: true },
    owner: { type: String, ref: 'User', required: true },
    date: { type: Date, default: Date.now },
    imageLocation: { type: String, required: true },
    published: { type: Boolean, default: false },
})

const Template = mongoose.model('Template', templateSchema)
export default Template

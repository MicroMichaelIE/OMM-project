import mongoose from 'mongoose'

// define a mongoose schema for item
const memeSchema = mongoose.Schema({
    givenName: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    owner: { type: String, ref: 'User', required: true },
    imageLocation: { type: String, required: true },
    uploadDate: { type: Date, default: Date.now },
    private: { type: Boolean, default: false },
    draft: { type: Boolean, default: true },
})

// construct an item model, using the item schema
const Meme = mongoose.model('Meme', memeSchema)

export default Meme

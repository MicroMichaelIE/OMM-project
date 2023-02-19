import mongoose from 'mongoose'

// define a mongoose schema for item
const memeSchema = mongoose.Schema({
    givenName: { type: String, required: true },
    description: { type: String },
    owner: { type: String, ref: 'User', required: true },
    imageLocation: { type: String, required: true },
    uploadDate: { type: Date, default: Date.now },
    private: { type: Boolean, default: false },
    draft: { type: Boolean, default: true },
    likes: [{ type: String, ref: 'User' }],
    comments: [
        {
            _id: mongoose.Schema.Types.ObjectId,
            owner: { type: String, ref: 'User' },
            date: { type: Date, default: Date.now },
            text: { type: String, required: true },
        },
    ],
})

// construct an item model, using the item schema
const Meme = mongoose.model('Meme', memeSchema)

export default Meme

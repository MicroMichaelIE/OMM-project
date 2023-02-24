import mongoose from 'mongoose'

// define a mongoose schema for item
const memeSchema = mongoose.Schema({
    givenName: { type: String, required: true },
    description: { type: String },
    owner: { type: String, ref: 'User', required: true },
    usedTemplate: { type: String, ref: 'Template', required: true },
    fileFormat: { type: String },
    imageLocation: { type: String, required: true },
    longerDescription: { type: String },
    captions: [
        {
            text: { type: String, required: true },
            x: { type: Number, required: true },
            y: { type: Number, required: true },
        },
    ],
    uploadDate: { type: Date, default: new Date() },
    private: { type: Boolean, default: false },
    draft: { type: Boolean, default: true },
    likes: [{ type: String, ref: 'User' }],
    comments: [
        {
            _id: mongoose.Schema.Types.ObjectId,
            owner: { type: String, ref: 'User' },
            postedDate: { type: Date, default: Date.now },
            text: { type: String, required: true },
        },
    ],
})

// construct an item model, using the item schema
const Meme = mongoose.model('Meme', memeSchema)

export default Meme

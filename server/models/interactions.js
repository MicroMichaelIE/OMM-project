import mongoose from 'mongoose'

// define a mongoose schema for item
const commentSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    comment: { type: String, required: true },
    commentMeme: { type: String, ref: 'Meme', required: true },
    commentOwner: { type: String, ref: 'User', required: true },
    commentDate: { type: Date, default: Date.now },
})
export const Comment = mongoose.model('Comment', commentSchema)


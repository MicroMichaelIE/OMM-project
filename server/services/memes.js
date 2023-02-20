import Meme from '../models/memes.js'
import mongoose from 'mongoose'

// Allows us to get all memes, or just ones by a specific user
export const getMemes = async (req, res) => {
    const query = req.query
    const { memeOwner } = query

    let payload = {}

    if (memeOwner) {
        payload.memeOwner = memeOwner
    }

    try {
        const memes = await Meme.find(payload, { draft: false })
            .sort({ _id: 1 })
            .populate('owner', '_id, username')
            .populate('comments', '_id, text, date, owner')
            .populate('comments.owner', '_id, username')
        res.status(200).json({ memes: memes })
    } catch (error) {
        res.status(404).json({ message: error })
    }
}

export const getMeme = async (req, res) => {
    const id = req.params.id

    try {
        const meme = await Meme.findOne({
            _id: mongoose.Types.ObjectId(id),
        })
            .populate('comments', '_id, text, date, owner')
            .populate('comments.owner', '_id, username')
            .populate('owner', '_id, username')

        res.status(200).json(meme)
    } catch (e) {
        res.status(404).json({ message: e.message })
    }
}

export const createMeme = async (req, res) => {
    const file = req.file
    // block adding other users memes
    if (file) {
        try {
            const meme = req.body.meme
            let parsedMeme = JSON.parse(meme)
            parsedMeme = {
                ...parsedMeme,
                owner: req._id,
                imageLocation: file.path,
                likes: [],
                comments: [],
            }
            const newMeme = new Meme(parsedMeme)
            await newMeme.save()
            res.status(201).json({ memes: newMeme })
        } catch (error) {
            console.log(error)
            return res.status(409).json({ message: error.message })
        }
    }
}

export const deletememe = async (req, res) => {
    const _id = req.params.id
    try {
        await Meme.findByIdAndDelete(_id)
        res.status(200).json({ message: 'Successfully deleted meme: ' + id })
    } catch (error) {
        res.status(404).json({ message: error.message })
    }
}

export const updateMeme = async (req, res) => {
    const id = req.params.id
    const meme = req.body

    try {
        const updatedMeme = await Meme.findByIdAndUpdate(id, meme)
        res.status(200).json(updatedMeme)
    } catch (error) {
        res.status(404).json({ message: error.message })
    }
}

export const getMemesByUserId = async (req, res) => {
    const userId = req._id
    try {
        // const memes = await helperGetMemesByUserId(userId)
        // this was creating error if not memes
        const memes = await Meme.find({
            memeOwner: userId,
            // maybe we need limit of memes here!
        })
        console.log(memes)
        res.status(200).json({ memes: memes })
    } catch (error) {
        res.status(404).json({ message: error.message })
    }
}

export const likeMeme = async (req, res) => {
    const id = req.params.id
    const userId = req._id

    try {
        await Meme.findOneAndUpdate(
            id,
            {
                $push: { likes: userId },
            },
            { new: true }
        )
        res.status(200)
    } catch (error) {
        res.status(404).json({ message: error.message })
    }
}

export const unlikeMeme = async (req, res) => {
    const id = req.params.id
    const userId = req._id

    try {
        await Meme.findOneAndUpdate(
            id,
            {
                $pull: { likes: userId },
            },
            { new: true }
        )
        res.status(200)
    } catch (error) {
        res.status(404).json({ message: error.message })
    }
}

export const commentMeme = async (req, res) => {
    const id = req.params.id
    const userId = req._id
    const { text } = req.body

    try {
        await Meme.findOneAndUpdate(
            id,
            {
                $push: {
                    comments: {
                        text: text,
                        owner: userId,
                    },
                },
            },
            { new: true }
        )
        res.status(200)
    } catch (error) {
        res.status(404).json({ message: error.message })
    }
}

export const deleteCommentMeme = async (req, res) => {
    const id = req.params.id
    const commentId = req.params.commentid

    try {
        await Meme.findOneAndUpdate(
            id,
            {
                $pull: {
                    comments: {
                        _id: commentId,
                    },
                },
            },
            { new: true }
        )
        res.status(200)
    } catch (error) {
        res.status(404).json({ message: error.message })
    }
}

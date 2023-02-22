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
                uploadDate: new Date(),
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

export const getMemeAPI = async (req, res) => {
    const query = req.query
    const { sort, limit, name, url, id, fileformat } = query

    let params = {}
    if (name) {
        params.givenName = name
    }

    if (url) {
        params.imageLocation = url
    }

    if (id) {
        params._id = id
    }

    if (fileformat) {
        params.fileFormat = `.${fileformat}`
    }

    try {
        const memes = await Meme.find(params)
            .populate('owner', '_id, username')
            .populate('comments', '_id, text, date, owner')
            .populate('comments.owner', '_id, username')
            .sort({ uploadDate: sort })
            .limit(limit)

        if (memes.length === 0) {
            return res.status(200).json({ memes: [] })
        }

        res.status(200).json({ memes: memes })
    } catch (error) {
        res.status(404).json({ message: error.message })
    }
}

export const likeMeme = async (req, res) => {
    const id = req.params.id
    const userId = req.user_id

    try {
        const meme = await Meme.findOne({ _id: id, likes: { $ne: userId } })
        if (meme) {
            meme.likes.push(userId)
            const newMeme = await meme.save()
            res.status(200).json({ updatedMeme: newMeme })
        } else {
            res.status(206).json({ message: 'Meme already liked' })
        }
    } catch (error) {
        res.status(404).json({ message: error.message })
    }
}

export const unlikeMeme = async (req, res) => {
    const id = req.params.id
    const userId = req.user_id
    try {
        const meme = await Meme.findOne({ _id: id, likes: { $in: userId } })
        if (meme) {
            meme.likes.pull(userId)
            const newMeme = await meme.save()
            res.status(200).json({ updatedMeme: newMeme })
        } else {
            res.status(206).json({ message: 'Meme not yet liked' })
        }
    } catch (error) {
        res.status(404).json({ message: error.message })
    }
}

export const commentMeme = async (req, res) => {
    const id = req.params.id
    const userId = req.user_id
    const body = req.body

    try {
        const updatedMeme = await Meme.findOneAndUpdate(
            { _id: id },
            {
                $push: {
                    comments: {
                        text: body.text,
                        owner: userId,
                    },
                },
            },
            { returnOriginal: false, new: true }
        ).populate('comments', '_id, text, date, owner')
        res.status(200).json({ updatedMeme: updatedMeme })
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

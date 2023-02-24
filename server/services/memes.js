import Meme from '../models/memes.js'
import mongoose from 'mongoose'

// Allows us to get all memes, or just ones by a specific user

/**
  Gets all memes, optionally filtered by memeOwner.
 * @param {object} req - Request object.
 * @param {object} res - Response object.
 * @returns {object} - Memes object containing an array of memes.
 */
export const getMemes = async (req, res) => {
    const query = req.query
    const { memeOwner } = query

    let payload = {}

    if (memeOwner) {
        payload.memeOwner = memeOwner
    }

    payload.draft = false
    payload.private = false

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

/**
 * Gets a single meme by ID.
 * @param {object} req - Request object.
 * @param {object} res - Response object.
 * @returns {object} - Meme object.
 */

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

/**
 * CURRENTLY UNUSED
 * Creates a new meme.
 * @description File is contained in the request body
 * @param {object} req. - Request object.
 * @param {object} res - Response object.
 * @returns {object} - New meme object.
 */

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

/**
 * Deletes a meme by ID.
 * @description Id is contained in the request params
 * @param {object} req - Request object.
 * @param {object} res - Response object.
 * @returns {object} - Success message.
 */
export const deletememe = async (req, res) => {
    const _id = req.params.id
    try {
        await Meme.findByIdAndDelete(_id)
        res.status(200).json({ message: 'Successfully deleted meme: ' + id })
    } catch (error) {
        res.status(404).json({ message: error.message })
    }
}

/**
 * Updates a meme by ID.
 * @param {object} req - Request object.
 * @param {object} res - Response object.
 * @returns {object} - Updated meme
 */

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

/**

Retrieve memes by user ID
* @description Get all memes uploaded by a user
* @param {Object} req - Express request object containing user ID
* @param {Object} res - Express response object
* @returns {Object} - Response object containing memes belonging to the user
* @throws {Object} - Response object containing error message
*/

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

/**
 * Retrieve meme by ID
 * @description Get a single meme by ID and populate with owner's user ID and username
 * @param {Object} req - Express request object containing meme ID
 * @param {Object} res - Express response object
 * @returns {Object} - Response object containing requested meme
 * @throws {Object} - Response object containing error message
 */

export const getMemesById = async (req, res) => {
    const id = req.params.id
    try {
        const meme = await Meme.findById(id).populate('owner', '_id, username')
        res.status(200).json({ memes: [meme] })
    } catch {
        res.status(404).json({ message: error.message })
    }
}

/**
 * Retrieve memes via API
 * Solves task 7 advanced.
 * @description Get memes by name, image location, ID, or file format, and sort by upload date, with optional limit
 * @param {Object} req - Express request object containing query parameters for filtering and sorting memes
 * @param {Object} res - Express response object
 * @returns {Object} - Response object containing requested memes
 * @throws {Object} - Response object containing error message
 */

// {{URL}}/memes?name=YaBOY&sort=asc&limit=4
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

    params.private = false
    params.draft = false

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

/**
 * Like a meme
 * @description Add the user's ID to the list of likes for a meme
 * @param {Object} req - Express request object containing meme ID and user ID
 * @param {Object} res - Express response object
 * @returns {Object} - Response object containing updated meme with the user's ID added to the list of likes
 * @throws {Object} - Response object containing error message
 */

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

/**
 * Unlike a meme
 * @description Remove the user's ID from the list of likes for a meme
 * @param {Object} req - Express request object containing meme ID and user ID
 * @param {Object} res - Express response object
 * @returns {Object} - Response object containing updated meme with the user's ID removed from the list of likes
 * @throws {Object} - Response object containing error message
 */

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

/**
 * Comment on a meme
 * @description Add a comment to a meme with the user's ID as the owner
 * @param {Object} req - Express request object containing meme ID, user ID, and comment text
 * @param {Object} res - Express response object
 * @returns {Object} - Response object containing updated meme with the comment added
 * @throws {Object} - Response object containing error message
 * @todo - Add validation for comment text
 * @todo - Add validation for comment length
 * @todo - Add validation for comment owner
 */

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

/**
 * Delete a comment on a meme
 * @description Remove a comment from a meme with the user's ID as the owner
 * @param {Object} req - Express request object containing meme ID, user ID, and comment ID
 * @param {Object} res - Express response object
 * @returns {Object} - Response object containing updated meme with the comment removed
 * @throws {Object} - Response object containing error message
 */

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

export const MakeMemePrivate = async (req, res) => {
    const id = req.params.id
    const userId = req.user_id

    try {
        const meme = await Meme.findById(id)
        if (meme) {
            if (meme.owner === userId) {
                if (meme.private === true) {
                    meme.private = false
                } else {
                    meme.private = true
                }

                const newMeme = await meme.save()
                res.status(200).json({ updatedMeme: newMeme })
            }
        } else {
            res.status(403)
        }
    } catch (error) {
        res.status(404).json({ message: error.message })
    }
}

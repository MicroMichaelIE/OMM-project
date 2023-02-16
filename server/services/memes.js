import Meme from '../models/memes.js'
import mongoose from 'mongoose'
import fs from 'fs'

export const getMemes = async (req, res) => {
    const query = req.query
    const { memeOwner } = query

    if (memeOwner) {
        payload.memeOwner = memeOwner
    }

    try {
        const memes = await Meme.find(payload).sort({ _id: 1 }).limit(20)
        res.status(200).json(memes)
    } catch (error) {
        res.status(404).json({ message: error })
    }
}

export const getMeme = async (req, res) => {
    const id = req.params.id

    try {
        const meme = await Meme.find({
            _id: mongoose.Types.ObjectId(id),
            published: true,
        })
        res.status(200).json(meme)
    } catch (e) {
        res.status(404).json({ message: e.message })
    }
}

export const createMeme = async (req, res) => {
    const files = req.files
    let imagesUrls = []
    // block adding other users memes
    if (files) {
        for (const file of files) {
            let buffer = file.buffer
            try {
                imagesUrls.push(blobName)
            } catch (error) {
                console.log(error)
                return res.status(409).json({ message: error.message })
            }
        }
    }

    const meme = req.body.meme
    const parsedMeme = JSON.parse(meme)
    parsedMeme.images = imagesUrls
    const newMeme = new Meme(parsedMeme)
    try {
        await newMeme.save()
        res.status(201).json({ memes: newMeme })
    } catch (error) {
        res.status(409).json({ message: error.message })
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
    const userId = req.firebase_uid
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

export const memeInteraction = async (req, res) => {
    const { memeId, interactonType } = req.body
    const meme = await Meme.findById(id)

    if (interaction === 'like') {
        if (meme.likes.includes(userId)) {
            meme.likes = meme.likes.filter((id) => id !== userId)
        } else {
            meme.likes.push(userId)
        }
    } else if (interaction === 'dislike') {
        if (meme.dislikes.includes(userId)) {
            meme.dislikes = meme.dislikes.filter((id) => id !== userId)
        } else {
            meme.dislikes.push(userId)
        }
    }

    try {
        await meme.save()
        res.status(200).json({ meme: meme })
    } catch (error) {
        res.status(404).json({ message: error.message })
    }
}

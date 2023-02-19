import Template from '../models/templates.js'
import {checkUserItemAuth} from './auth/authentication.js'
import fs from 'fs'
import path from 'path'

export const getMemeTemplates = async (req, res) => {
    const pathToTemplates = path.join(__dirname, './templates')
    const files = fs.readdirSync(pathToTemplates)
    res.status(200).json({ templates: files })
}

export const uploadMemeTemplate = async (req, res) => {
    console.log('got here')
    const tempPath = req.file.path
    const targetPath = path.join(
        __dirname,
        `./templates/${req.file.originalname}`
    )

    if (path.extname(req.file.originalname).toLowerCase() === '.png') {
        fs.rename(tempPath, targetPath, (err) => {
            if (err) return handleError(err, res)

            res.status(200).send()
        })
    } else {
        fs.unlink(tempPath, (err) => {
            if (err) return handleError(err, res)

            res.status(403)
                .contentType('text/plain')
                .end('Only .png files are allowed!')
        })
    }
}

export const makeTemplatePrivate = async (req, res) => {
    const id = req.params.id;
    try {
        const item = await Template.findById(id);
        if (!checkUserItemAuth(item, req.id)) {
            return res.status(401).json({ message: 'User is not authorized to edit this item' });
        }
        item.published = !item.published;
        await item.save();
        const message = 'ok';
        res.status(200).json({ message: message });
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

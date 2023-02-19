import Template from '../models/templates.js'

import fs from 'fs'
import path from 'path'

const pathToTemplates = path.join(__dirname, '.public/templates')
const pathToFont = path.join(__dirname, './public/fonts/')

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

export const createMemeAPI = async (req, res) => {
    const templateId = req.params.id
    const template = Template.findById(templateId)

    const { fontName, x, y, x2, y2, text, text2 } = req.query

    const imagePath = path.join(pathToTemplates, imageName)
    const imageOutPath = path.join(
        pathToTemplates,
        `${path.basename(imageName)}_out${path.extname(imageName)}`
    )

    const img = await Jimp.read(imagePath)
    const font = await Jimp.loadFont(pathToFont + { fontName })

    const image = {
        data: img.scale(2),
        width: img.getWidth(),
        height: img.getHeight(),
    }

    const upperCaption = {
        text: text || '',
        x:
            (image.width - Jimp.measureText(font, text || '')) / 2 +
            (parseInt(x) || 0),
        y: 50 + (parseInt(y) || 0),
    }
    const lowerCaption = {
        text: text2 || '',
        x:
            (image.width - Jimp.measureText(font, text2 || '')) / 2 +
            (parseInt(x2) || 0),
        y:
            image.height -
            Jimp.measureTextHeight(font, text2 || '') -
            50 +
            (parseInt(y2) || 0),
    }

    const imageWithText = image.data
        .print(font, upperCaption.x, upperCaption.y, upperCaption.text)
        .print(font, lowerCaption.x, lowerCaption.y, lowerCaption.text)

    await imageWithText.writeAsync(imageOutPath)

    res.contentType = 'image/png'
    res.sendFile(imageOutPath)
}

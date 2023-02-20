import MemeTemplate from '../models/templates.js'
import Meme from '../models/memes.js'
import Jimp from 'jimp'

import fs from 'fs'
import path from 'path'

import multer from 'multer'

const __dirname = path.resolve()

const pathToPublic = path.join(__dirname, 'server/public')
const pathToFont = path.join(__dirname, 'server/public/fonts/')

export const getMemeTemplates = async (req, res) => {
    try {
        const templates = await MemeTemplate.find()
        res.status(200).json(templates)
    } catch (error) {
        res.status(404).json({ message: error.message })
    }
}

export const createMemeAPI = async (req, res) => {
    const templateId = req.params.id
    const template = await MemeTemplate.findById(templateId)

    const { fontName, x, y, x2, y2, text, text2 } = req.query

    const imageName = template.imageLocation

    const imagePath = path.join(pathToPublic, imageName)
    const imageOutPath = path.join(
        pathToPublic,
        'memes',
        `${path.basename(imageName)}${path.extname(imageName)}`
    )

    const fullFontName = `${fontName}.fnt`

    const img = await Jimp.read(imagePath)
    const font = await Jimp.loadFont(
        path.join(pathToFont, fontName, fullFontName)
    )

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

    const meme = new Meme({
        givenName: template.name,
        owner: req.user_id,
        imageLocation: path.join(
            'memes',
            `${path.basename(imageName)}${path.extname(imageName)}`
        ),
        uploadDate: Date.now(),
        private: false,
        draft: false,
        likes: [],
        comments: [],
    })

    const savedMeme = await meme.save()

    res.contentType = 'image/png'
    res.sendFile(imageOutPath)
}

// export const uploadTemplates = async (req, res, next) => {
//   try {
//     const { files } = req;
//     const templates = await Promise.all(files.map(async (file) => {
//       const newTemplate = new Template({
//         //name: file.originalname,
//         name: req.body.name,
//         data: file.buffer,
//       });
//       return await newTemplate.save();
//     }));
//     res.status(201).json({ templates });
//   } catch (error) {
//     next(error);
//   }
// };
// const upload = multer({ dest: 'uploads/' })

export const uploadTemplates = async (req, res, next) => {
    console.log('I GET HERE')
    try {
        const { files } = req
        const templatePaths = []

        await Promise.all(
            files.map(async (file) => {
                const { originalname } = file
                const name = originalname.split('.')[0]
                console.log(file.filename)
                // const location = path.join('templates', file.filename)

                const newTemplate = new MemeTemplate({
                    name: name,
                    owner: req.user_id,
                    date: Date.now(),
                    imageLocation: path.join('templates', file.filename),
                    published: false,
                })

                const savedTemplate = await newTemplate.save()

                templatePaths.push(savedTemplate._id.toString())
            })
        )

        res.status(201).json({ templatePaths })
    } catch (error) {
        return res.status(500).json({ error: error.message })
    }
}

export const getTemplates = async (req, res, next) => {
    try {
        const templates = await MemeTemplate.find()
        res.status(200).json({ templates: templates })
    } catch (error) {
        res.status(404).json({ message: error.message })
    }
}

// export const getTemplates = async (req, res, next) => {
//   try {
//     // Get the list of files in the public folder
//     const files = await fs.promises.readdir('./public');

//     // Filter the list to only include image files
//     const imageFiles = files.filter((file) => /\.(jpg|jpeg|png|gif)$/i.test(file));

//     // Create an array of objects containing the file name
//     const templates = imageFiles.map((fileName) => ({
//       name: fileName
//     }));

//     res.json({ templates });
//   } catch (error) {
//     next(error);
//   }
// };

export const getTemplateById = async (req, res, next) => {
    try {
        const template = await Template.findById(req.params.id)
        if (!template) {
            return res.status(404).json({ error: 'Template not found' })
        }
        res.json({ template })
    } catch (error) {
        next(error)
    }
}

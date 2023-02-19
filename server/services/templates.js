import Template from '../models/templates.js'
import { checkUserItemAuth } from './auth/authentication.js'
import fs from 'fs'
import path from 'path'

import multer from 'multer'

const __dirname = path.resolve()

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

const upload = multer()

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

export const uploadTemplates = async (req, res, next) => {
    try {
        const { files } = req
        const templatePaths = []

        files.forEach((file) => {
            const name = req.body.name
            const ext = file.originalname.split('.').pop()
            const fileName = `${name}-${Date.now()}.${ext}`
            const path = `./public/${fileName}`

            fs.writeFileSync(path, file.buffer)

            templatePaths.push(path)
        })

        res.status(201).json({ templatePaths })
    } catch (error) {
        next(error)
    }
}

export const getTemplates = async (req, res, next) => {
    try {
        const templates = await Template.find()
        res.json({ templates })
    } catch (error) {
        next(error)
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

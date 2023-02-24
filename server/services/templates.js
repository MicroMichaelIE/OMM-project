import MemeTemplate from '../models/templates.js'
import Meme from '../models/memes.js'
import Jimp from 'jimp'
import path from 'path'

let __dirname = path.resolve()

if (__dirname.includes('server')) {
    __dirname = path.resolve(__dirname, '../')
}

const pathToPublic = path.join(__dirname, 'server/public')
const pathToFont = path.join(__dirname, 'server/public/fonts/')

/**
 * @description This function is used to get all the templates from the database
 * @param {Express.Request}req the request object
 * @param {Express.Response}res the response object
 * @returns {MemeTemplate[]} an array of all the templates in the database
 * @returns {404} if the request failed
 */

export const getMemeTemplates = async (req, res) => {
    try {
        const templates = await MemeTemplate.find()
        res.status(200).json(templates)
    } catch (error) {
        res.status(404).json({ message: error.message })
    }
}

/**
 * SOURCED: code from tutorials adapted to fit the project
 * @description This function is used to create a meme from a given template and a given parameters
 * This is a helper function for the createMemeAPI functions to not duplicate code
 * @param {string} imagePath: the path to the image that will be used as a template
 * @param {string} imageOutPath: the path to the image that will be created
 * @param {string} fontName: the name of the font that will be used
 * @param {string} fullFontName: the name of the font that will be used with the extension
 * @param {[{text: string, x: number, y: number}]} caption: an array of strings that will be used as captions
 * @returns {boolean} true if the image was created successfully, false otherwise

    */
const createImageLocally = async (
    imagePath,
    imageOutPath,
    fontName,
    fullFontName,
    caption
) => {
    try {
        const img = await Jimp.read(imagePath)
        const font = await Jimp.loadFont(
            path.join(pathToFont, fontName, fullFontName)
        )

        const image = {
            data: img.scale(2),
            width: img.getWidth(),
            height: img.getHeight(),
        }

        await Promise.all(
            caption.map(async (capt) => {
                const { text, x, y } = capt
                const c = {
                    text: text || '',
                    x:
                        (image.width - Jimp.measureText(font, text || '')) / 2 +
                        (parseInt(x) || 0),
                    y:
                        image.height -
                        Jimp.measureTextHeight(font, text || '') -
                        50 +
                        (parseInt(y) || 0),
                }

                const imageWithText = image.data.print(font, c.x, c.y, c.text)

                await imageWithText.writeAsync(imageOutPath)
            })
        )
        return true
    } catch (error) {
        console.log(error)
        return false
    }
}

/**
 * This function is used to create a meme from a template image and a given parameters via query
 * This solves Task6 intermediate. Also allowing creation directly from the browser no UI needed.
    @param   {Express.Request} req: the request object
    @param    {Express.Response} res: the response object
    @queries  fontName? x?    y? x2? y2? text? text2? givenName?
*/
export const createMemeAPI = async (req, res) => {
    const templateId = req.params.id

    let template
    try {
        template = await MemeTemplate.findById(templateId)
    } catch {
        res.status(404).json({ message: 'Error in Tempalte' })
    }

    try {
        const { fontName, x, y, x2, y2, text, text2, givenName } = req.query

        const imageName = template.imageLocation

        const imagePath = path.join(pathToPublic, imageName)

        const fullFontName = `${fontName}.fnt`

        const captions = [
            [
                {
                    text: text || '',
                    x: x || 0,
                    y: y || 0,
                },
                {
                    text: text2 || '',
                    x: x2 || 0,
                    y: y2 || 0,
                },
            ],
        ]
        const savedMemes = await Promise.all(
            captions.map(async (caption, index) => {
                const realImageName =
                    path.basename(imageName).split('.')[0] +
                    Date.now() +
                    index +
                    '.' +
                    path.basename(imageName).split('.')[1]

                const imageOutPath = path.normalize(
                    path.join(
                        pathToPublic,
                        'memes',
                        `${path.basename(realImageName)}`
                    )
                )
                const response = await createImageLocally(
                    imagePath,
                    imageOutPath,
                    fontName,
                    fullFontName,
                    caption
                )

                if (!response) {
                    res.status(404).json({
                        message: 'Error with Meme Creation',
                    })
                }

                const meme = new Meme({
                    givenName: givenName || template.name,
                    owner: req.user_id,
                    usedTemplate: templateId,
                    fileFormat: `${path.extname(imageName)}`,
                    // saving the relative path to the image so that frontend can run on a production server not just "localhost:3001"
                    imageLocation: path.normalize(
                        path.join('memes', `${path.basename(realImageName)}`)
                    ),
                    captions: caption,
                    uploadDate: new Date(),
                    private: false,
                    draft: false,
                    likes: [],
                    comments: [],
                })

                const savedMeme = await meme.save()
                return savedMeme
            })
        )
        res.status(201).json(savedMemes)
    } catch (error) {
        res.status(404).json({ message: 'Error with Meme Creation' })
    }
}

/**
    *This function is used to create multiple memes from a template image and a given parameters via body
    *This solves Task6 advanced. allowing creation from Postman or similar, no frontend UI.
    @param  templateId: the id of the template that will be used
*
    @param  {string} req.params.id: the template id
    @param  {[[ {string, number, number} ]]} req.body.captions: an array of strings that will be used as captions
    @param {string} req.body.givenName: the name of the meme
    @param {string} req.body.fontName: the name of the font that will be used
    @returns {[Meme]} the list of memes that were created
*/
export const createMultipleMemeAPI = async (req, res) => {
    const templateId = req.params.id
    const body = req.body

    let template
    try {
        template = await MemeTemplate.findById(templateId)
    } catch {
        res.status(404).json({ message: 'Error in Tempalte' })
    }

    try {
        const imageName = template.imageLocation

        const imagePath = path.join(pathToPublic, imageName)

        const { fontName, captions, givenName } = body

        const fullFontName = `${fontName}.fnt`

        const savedMemes = await Promise.all(
            captions.map(async (caption, index) => {
                const realImageName =
                    path.basename(template.imageLocation).split('.')[0] +
                    Date.now() +
                    index +
                    '.' +
                    path.basename(template.imageLocation).split('.')[1]

                const imageOutPath = path.normalize(
                    path.join(
                        pathToPublic,
                        'memes',
                        `${path.basename(realImageName)}`
                    )
                )
                const response = await createImageLocally(
                    imagePath,
                    imageOutPath,
                    fontName,
                    fullFontName,
                    caption
                )

                if (!response) {
                    return res.status(404).json({
                        message: 'Error with Meme Creation',
                    })
                }

                const meme = new Meme({
                    givenName: givenName || template.name,
                    owner: req.user_id,
                    usedTemplate: templateId,
                    fileFormat: `${path.extname(template.imageLocation)}`,
                    // saving the relative path to the image so that frontend can run on a production server not just "localhost:3001"
                    imageLocation: path.normalize(
                        path.join('memes', `${path.basename(realImageName)}`)
                    ),
                    captions: caption,
                    uploadDate: new Date(),
                    private: false,
                    draft: false,
                    likes: [],
                    comments: [],
                })

                const savedMeme = await meme.save()
                return savedMeme
            })
        )
        res.status(201).json(savedMemes)
    } catch (error) {
        res.status(404).json({ message: 'Error with Meme Creation' })
    }
}

/**
 * @description This function is used to create a template image and a given parameters via body
 * This solves Task1 advanced. allowing creation from frontnd UI via 5 different input types.
 * @param {Object} req.files the image file that will be used as a template
 * @param {string} req.body.givenName the name of the template that will be created
 * @returns {Object} the template that was created
 * @throws 500 if there is an error with the creation of the template
 */

export const uploadTemplates = async (req, res, next) => {
    console.log('I GET HERE')
    try {
        const { files } = req
        const templatePaths = []
        const givenName = req.body.givenName
        const longerDescription = req.body.longerDescription

        await Promise.all(
            files.map(async (file) => {
                const { originalname } = file
                const name = originalname.split('.')[0]
                console.log(file.filename)
                // const location = path.join('templates', file.filename)

                const newTemplate = new MemeTemplate({
                    givenName: givenName || name,
                    name: name,
                    owner: req.user_id,
                    date: Date.now(),
                    fileFormat: `${path.extname(file.filename)}`,
                    longerDescription: longerDescription,
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

/**
 * @description Get all memes templates from database
 * @param {Express.Request} req
 * @param {Express.Response} res
 * @param {Function} next
 * @returns {Object} { templates: [] } */

export const getTemplates = async (req, res, next) => {
    try {
        const templates = await MemeTemplate.find()
        res.status(200).json({ templates: templates })
    } catch (error) {
        res.status(404).json({ message: error.message })
    }
}

/**
 * @description Get a meme template by id from database
 * @param {Express.Request} req
 * @param {Express.Response} res
 * @param {Function} next
 * @returns {Object} { template: {} } */

export const getTemplateById = async (req, res, next) => {
    try {
        const template = await Template.findById(req.params.id)
        if (!template) {
            return res.status(404).json({ error: 'Template not found' })
        }
        res.status(200).json({ template: template })
    } catch (error) {
        res.status(404).json({ message: error.message })
    }
}

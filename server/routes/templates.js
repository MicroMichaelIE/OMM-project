import express from 'express'
import multer from 'multer'
import {
    uploadTemplates,
    getTemplates,
    getTemplateById,
} from '../services/templates.js'

import { upload } from '../config/multer.js'
import { authenticateJWT } from '../services/auth/authentication.js'

const router = express.Router()

const arrayUpload = upload.array('template', 12)

router.post(
    '/upload',
    authenticateJWT,
    (req, res, next) => {
        arrayUpload(req, res, function (err) {
            if (err instanceof multer.MulterError) {
                console.log('We got a multer error boys')
                console.log(err)
                return res.send('Error with multer')
            } else if (err) {
                console.log('Error - not caused by multer... but during upload')
                return res.status(500).json({ error: err.message })
            }
            // Always null here?!?!
            next()
        })
    },
    uploadTemplates
)
// router.use(express.static('server/public'))
router.get('/', getTemplates)
router.get('/:id', getTemplateById)

export default router

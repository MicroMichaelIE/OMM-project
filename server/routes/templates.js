import { Router } from 'express'
import { upload } from '../config/multer.js'
import { authenticateJWT } from '../services/auth/authentication.js'
import { getMemeTemplates, uploadMemeTemplate } from '../services/templates.js'

const router = Router()

router.get('/', authenticateJWT, getMemeTemplates)
// router.get('/:id', authenticateJWT, getTemplate)
router.post(
    '/upload',
    authenticateJWT,
    upload.array('files'),
    uploadMemeTemplate
)

export default router

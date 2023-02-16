import { Router } from 'express'
import {
    createMeme,
    getMeme,
    getMemes,
    getMemesByUserId,
    getOneMemeUser,
    uploadMemeTemplate,
} from '../services/memes.js'
import { upload } from '../config/multer.js'
import { authenticateJWT } from '../services/auth/authentication.js'
const router = Router()

router.get('/getMeme/:id', getMeme)
router.get('/getMemes', getMemes)
router.get('/getMeme/:user/:id', getOneMemeUser)
router.get('/getMemesUser', authenticateJWT, getMemesByUserId)
// router.delete('/deleteitem/:id', deleteitem)
// router.put('/updateitem/:id', updateitem)
router.post(
    '/template',
    authenticateJWT,
    upload.array('files'),
    uploadMemeTemplate
)
router.post('/saveImage', (req, res) => {
    upload(req, res, callBackHandling(createMeme))
})

export default router

import { Router } from 'express'
import {
    createMeme,
    likeMeme,
    unlikeMeme,
    commentMeme,
    getMemes,
    getMemesByUserId,
    getMemeAPI,
    // getOneMemeUser,
    // uploadMemeTemplate,
} from '../services/memes.js'
import { upload } from '../config/multer.js'
import { authenticateJWT } from '../services/auth/authentication.js'
import { createMemeAPI } from '../services/templates.js'

const router = Router()

// router.get('/', getMemes)
// router.get('/getMeme/:user/:id', getOneMemeUser)
router.get('/getMemesUser', authenticateJWT, getMemesByUserId)
// router.delete('/deleteitem/:id', deleteitem)
// router.put('/updateitem/:id', updateitem)
// router.post(
//     '/template',
//     authenticateJWT,
//     upload.array('files'),
//     uploadMemeTemplate
// )
router.post('/saveImage', (req, res) => {
    upload(req, res, callBackHandling(createMeme))
})
router.post('/:id', authenticateJWT, createMemeAPI)
router.get('/', getMemeAPI)

// Meme interaction
router.put('/:id/like', authenticateJWT, likeMeme)
router.put('/:id/unlike', authenticateJWT, unlikeMeme)
router.put('/:id/comment', authenticateJWT, commentMeme)
// router.put('/:id/comment/:commentid/delete', authenticateJWT, deleteCommentMeme)

export default router

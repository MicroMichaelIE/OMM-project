import { Router } from 'express'
import {
    createMeme,
    likeMeme,
    unlikeMeme,
    commentMeme,
    getMemes,
    getMemesByUserId,
    deleteCommentMeme,
} from '../services/memes.js'
import { upload } from '../config/multer.js'
import { authenticateJWT } from '../services/auth/authentication.js'

const router = Router()

router.get('/', getMemes)
router.get('/getMemesUser', authenticateJWT, getMemesByUserId)
// router.delete('/deleteitem/:id', deleteitem)
// router.put('/updateitem/:id', updateitem)
router.post('/meme', authenticateJWT, upload.single('file'), createMeme)

// Meme interaction
router.put('/:id/like', authenticateJWT, likeMeme)
router.put('/:id/unlike', authenticateJWT, unlikeMeme)
router.put('/:id/comment', authenticateJWT, commentMeme)
router.put('/:id/comment/:commentid/delete', authenticateJWT, deleteCommentMeme)

export default router

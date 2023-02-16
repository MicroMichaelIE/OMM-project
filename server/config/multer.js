import multer from 'multer'
import path from 'path'
import fs from 'fs'

function checkFileType(file, callback) {
    // Allowed extensions
    const filetypes = /jpeg|jpg|png|gif/
    // Checks the extension againts the allowed extensions
    const extname = filetypes.test(
        path.extname(file.originalname).toLowerCase()
    )
    // Checks the media types of the file against the allowed file types.
    const mimetype = filetypes.test(file.mimetype)

    if (mimetype && extname) {
        return cb(null, true)
    } else {
        return cb('Error: Images Only!')
    }
}

export const upload = multer({
    limits: {
        fileSize: 1000000,
    },
    fileFilter(req, file, cb) {
        checkFileType(file, cb)
    },

    storage: multer.diskStorage({
        destination(req, file, cb) {
            cb(null, '/')
        },
        filename(req, file, cb) {
            cb(
                null,
                `${file.fieldname}-${Date.now()}${path.extname(
                    file.originalname
                )}`
            )
        },
    }),
    onError: function (err, next) {
        console.log('error', err)
        next(err)
    },
})

export const uploadMiddleWare = (req, res, next) => {
    upload(req, res, function (err) {
        if (err) {
            next(err)
        } else {
            if (req.file === undefined) {
                const fileErr = new Error('No file selected')
                next(fileErr)
            } else {
                next()
            }
        }
    })
}

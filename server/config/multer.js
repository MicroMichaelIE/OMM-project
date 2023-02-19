import multer from 'multer'
import path from 'path'
import fs from 'fs'

export function checkFileType(file, cb) {
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
        return 'Error: Images Only!'
    }
}

export const upload = multer({
    dest: `./public/uploads/templates`,
    onFileUploadStart(file) {
        console.log(file.originalname + ' is starting ...')
    },
    onFileUploadComplete(file) {
        console.log(file.fieldname + ' uploaded to  ' + file.path)
        done = true
    },
    // limits: {
    //     fileSize: 10000000,
    // },
    // fileFilter(req, file, cb) {
    //     checkFileType(file, cb)
    // },

    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, `server/public/templates`)
        },
        filename: (req, file, cb) => {
            cb(
                null,
                `${file.originalname.split('.')[0]}-${Date.now()}${path.extname(
                    file.originalname
                )}`
            )
        },
    }),
    onError: (err, next) => {
        console.log('error', err)
        next(err)
    },
})

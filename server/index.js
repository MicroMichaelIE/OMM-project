import createError from 'http-errors'
import express, { json } from 'express'
import cookieParser from 'cookie-parser'
import logger from 'morgan'
import path from 'path'
import cors from 'cors'
import bodyParser from 'body-parser'
import mongoose from 'mongoose'

import memesRouter from './routes/memes.js'
import usersRouter from './routes/users.js'

// ##### IMPORTANT
// ### Your backend project has to switch the MongoDB port like this
// ### Thus copy paste this block to your project
const MONGODB_PORT = process.env.DBPORT || '27017'
// const db = monk(`127.0.0.1:${MONGODB_PORT}/omm-ws2223`) // connect to database omm-2021
const connectionOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: 'omm-ws2223',
}
mongoose.set('strictQuery', true)
mongoose
    .connect(
        `mongodb://127.0.0.1:${MONGODB_PORT}/omm-ws2223`,
        connectionOptions
    )
    .then(() => {
        console.log('Connected to MongoDB')
    })
    .catch((err) => {
        console.log('Error connecting to MongoDB', err)
    })

const PORT = process.env.PORT || 3001

const app = express()
const __dirname = path.resolve()

app.use(logger('dev'))
app.use(cors())
app.use(json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cookieParser())

app.use('/api/users', usersRouter)
app.use('/api/memes', memesRouter)
    next()

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404))
})
app.use(express.static(path.join(__dirname, '../client/public')))

app.listen(PORT, () => {
    console.log('')
    console.log('Server is running on', PORT)
})

app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message
    res.locals.error = req.app.get('env') === 'development' ? err : {}

    // render the error page
    res.status(err.status || 500)
})

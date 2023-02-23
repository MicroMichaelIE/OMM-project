import createError from 'http-errors'
import express from 'express'
import cookieParser from 'cookie-parser'
import logger from 'morgan'
import path from 'path'
import cors from 'cors'
import mongoose from 'mongoose'

import memesRouter from './routes/memes.js'
import usersRouter from './routes/users.js'
import templatesRouter from './routes/templates.js'
import * as dotenv from 'dotenv'

var __dirname = path.resolve()

dotenv.config({
    path: path.resolve(__dirname, '../.env'),
})

// ##### IMPORTANT
// ### Your backend project has to switch the MongoDB port like this
// ### Thus copy paste this block to your project
const MONGODB_PORT = process.env.MONGODB_PORT || 65535
console.log('MONGODB_PORT ' + MONGODB_PORT)
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
        console.log('Connected to MongoDB on port', MONGODB_PORT, '')
    })
    .catch((err) => {
        console.log('Error connecting to MongoDB', err)
    })

const PORT = process.env.PORT || 3001

const app = express()

app.use(logger('dev'))
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

app.use('/api/users', usersRouter)
app.use('/api/memes', memesRouter)
app.use('/api/templates', templatesRouter)

app.get('/api/*', (req, res) => {
    res.status(404).json({
        message: 'Not found',
    })
})

app.use(
    '/templates',
    express.static(path.join(__dirname, 'server', 'public', 'templates'))
)

app.use(
    '/memes',
    express.static(path.join(__dirname, 'server', 'public', 'memes'))
)

app.use(express.static(path.join(__dirname, '/client/dist')))

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '/client/index.html'))
})
// error handler
// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404))
})

app.listen(PORT, () => {
    console.log('Server is running on', PORT)
})

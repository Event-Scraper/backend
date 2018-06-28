'use strict'

const express = require('express')
const debug = require('debug')('scraper:server')
const dotenv = require('dotenv')
dotenv.load()
const morgan = require('morgan')
const cors = require('cors')
const util = require('util')

const stanford = require('./routes/stanford-routes')
const eventbrite = require('./routes/eventbrite-routes')
const meetup = require('./routes/meetup-routes')
const app = express()
const PORT = process.env.PORT || 3000
const CORS_ORIGINS = process.env.CORS_ORIGINS
app.use(
	cors({
		origin: CORS_ORIGINS.split(' '),
		credentials: true
	})
)
app.use(morgan('dev'))

app.use(stanford)
app.use(eventbrite)
app.use(meetup)

app.listen(PORT, () => {
	debug(`server on ${PORT}`)
})

'use strict'

const Router = require('express').Router
var request = require('request')
const jsonParser = require('body-parser').json()
const debug = require('debug')('scraper:eventbrite-router')
let cheerio = require('cheerio')

var options = {
	url: 'https://www.eventbrite.com',
	headers: {
		'User-Agent': 'request'
	}
}

const eventbriteRouter = (module.exports = new Router())

eventbriteRouter.get('/api/events/eventbrite/all', function(req, res, next) {
	debug('GET: /api//events/eventbrite/all')
	request(options, function(err, resp, html) {
		if (!err) {
			let $ = cheerio.load(html)
			console.log(html)

			let eventList = []
			$('.js-events-list .g-cell .poster-card').each(function(index, element) {
				eventList[index] = {}

				eventList[index]['title'] = $(element).attr('data-share-name')
				console.log(eventList)
			})
			res.json(eventList)
		}
	})
})

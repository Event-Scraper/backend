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

			let eventList = []
			$('.js-events-list .g-cell .poster-card').each(function(index, element) {
				eventList[index] = {}

				eventList[index]['url'] = $(element).attr('data-share-url')
				eventList[index]['imgUrl'] = $(element)
					.find('a .poster-card__header .poster-card__image .js-poster-image')
					.attr('src')
				eventList[index]['title'] = $(element).attr('data-share-name')

				eventList[index]['time'] = $(element)
					.find('a .poster-card__body .poster-card__date')
					.text()
				eventList[index]['location'] = $(element)
					.find('a .poster-card__body .poster-card__venue')
					.text()
			})
			res.json(eventList)
		}
	})
})

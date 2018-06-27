'use strict'

const Router = require('express').Router
var request = require('request')
const jsonParser = require('body-parser').json()
const debug = require('debug')('scraper:stanford-router')
let cheerio = require('cheerio')

const stanfordRouter = (module.exports = new Router())

stanfordRouter.get('/api/stanford/all', function(req, res, next) {
	debug('GET: /api/events/stanford/all')
	console.log('HELLO')
	request('http://events.stanford.edu/', function(err, resp, html) {
		if (!err) {
			let $ = cheerio.load(html)

			let eventList = []
			$('#main-content .postcard-link').each(function(index, element) {
				eventList[index] = {}

				eventList[index]['url'] =
					'http://events.stanford.edu' + $(element).attr('href')

				let mainDiv = $(element).find('.postcard-left')
				let imgDiv = $(mainDiv).find('.postcard-image')
				eventList[index]['imgUrl'] =
					'http://events.stanford.edu' +
					$(imgDiv)
						.find('img')
						.attr('src')

				let mainDiv = $(element).find('.postcard-text')
			})
			res.json(eventList)
		}
	})
})

'use strict'

const Router = require('express').Router
var request = require('request')
const jsonParser = require('body-parser').json()
const debug = require('debug')('scraper:stanford-router')
let cheerio = require('cheerio')

var options = {
	url: 'http://events.stanford.edu/',
	headers: {
		'User-Agent': 'request'
	}
}

const stanfordRouter = (module.exports = new Router())

stanfordRouter.get('/api/events/stanford/all', function(req, res, next) {
	debug('GET: /api/events/stanford/all')
	request(options, function(err, resp, html) {
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

				let text = $(mainDiv).find('.postcard-text')
				eventList[index]['title'] = $(text)
					.find('h3')
					.text()
					.replace(/(\r\n|\n|\r|\t)/gm, '')
					.replace(/(\s+)/gm, ' ')
					.trim()

				eventList[index]['time'] = $(text)
					.find('p')
					.find('strong')
					.text()
					.replace(/(\r\n|\n|\r|\t|\.)/gm, '')
					.replace(/(\s+)/gm, ' ')

				let location = $(text)
					.find('p')
					.find('strong')
					.remove()

				eventList[index]['location'] = $(text)
					.find('p')
					.text()
					.replace(/(\r\n|\n|\r|\t)/gm, '')
					.replace(/(\s+)/gm, ' ')
			})
			res.json(eventList)
		}
	})
})

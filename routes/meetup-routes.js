'use strict'

const Router = require('express').Router
var request = require('request')
const jsonParser = require('body-parser').json()
const debug = require('debug')('scraper:meetup-router')
let cheerio = require('cheerio')

var options = {
	url:
		'https://www.meetup.com/find/events/?allMeetups=true&radius=5&userFreeform=Seattle%2C+Washington%2C+USA&mcId=c98101&change=yes&eventFilter=mysugg',
	headers: {
		'User-Agent': 'request'
	}
}

const meetupRouter = (module.exports = new Router())

meetupRouter.get('/api/events/meetup/all', function(req, res, next) {
	debug('GET: /api/events/meetup/all')
	request(options, function(err, resp, html) {
		if (!err) {
			let $ = cheerio.load(html)

			console.log(html)

			// let eventList = []
			// $('#main-content .postcard-link').each(function(index, element) {
			// 	eventList[index] = {}

			// 	eventList[index]['url'] =
			// 		'http://events.stanford.edu' + $(element).attr('href')

			// 	let mainDiv = $(element).find('.postcard-left')
			// 	let imgDiv = $(mainDiv).find('.postcard-image')
			// 	eventList[index]['imgUrl'] =
			// 		'http://events.stanford.edu' +
			// 		$(imgDiv)
			// 			.find('img')
			// 			.attr('src')

			// 	let text = $(mainDiv).find('.postcard-text')
			// 	eventList[index]['title'] = $(text)
			// 		.find('h3')
			// 		.text()
			// 		.replace(/(\r\n|\n|\r|\t)/gm, '')
			// 		.replace(/(\s+)/gm, ' ')
			// 		.trim()

			// 	eventList[index]['time'] = $(text)
			// 		.find('p')
			// 		.find('strong')
			// 		.text()
			// 		.replace(/(\r\n|\n|\r|\t|\.)/gm, '')
			// 		.replace(/(\s+)/gm, ' ')

			// 	let location = $(text)
			// 		.find('p')
			// 		.find('strong')
			// 		.remove()

			// 	eventList[index]['location'] = $(text)
			// 		.find('p')
			// 		.text()
			// 		.replace(/(\r\n|\n|\r|\t)/gm, '')
			// })
			// res.json(eventList)
		}
	})
})

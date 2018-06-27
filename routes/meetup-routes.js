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
			let indexArr = []
			let $ = cheerio.load(html)

			let eventList = []
			$('.event-listing-container .event-listing').each(function(
				index,
				element
			) {
				let url = $(element)
					.find('.row-item a')
					.attr('href')

				let optionsTwo = {
					url: url,
					headers: {
						'User-Agent': 'request'
					}
				}
				eventList[index] = {}
				eventList[index]['url'] = url
				eventList[index]['title'] = $(element)
					.find('.event span[itemprop="name"]')
					.text()

				eventList[index]['icon'] = 'fab fa-meetup'

				request(optionsTwo, function(err, resp, html) {
					if (!err) {
						let $ = cheerio.load(html)

						let time = $(html)
							.find('.eventTimeDisplay time .eventTimeDisplay-startDate-time')
							.first()
							.text()

						let date = $(html)
							.find('.eventTimeDisplay time .eventTimeDisplay-startDate')
							.first()
							.text()

						let timeIdx = date.indexOf(time)
						date = date.substring(0, timeIdx)
						date = (date + ' ' + time).replace(/(\s+)/gm, ' ')

						eventList[index]['time'] = date
						eventList[index]['imgUrl'] = $(html)
							.find('.photoCarousel-photoContainer')
							.first()
							.attr('style')
							? $(html)
									.find('.photoCarousel-photoContainer')
									.first()
									.attr('style')
									.replace(/^background-image:url\(["']?/, '')
									.replace(/["']?\)$/, '')
							: 'https://www.gumtree.com/static/1/resources/assets/rwd/images/orphans/a37b37d99e7cef805f354d47.noimage_thumbnail.png'

						eventList[index]['location'] = $(html)
							.find('.venueDisplay-venue-address')
							.text()
							? $(html)
									.find('.venueDisplay-venue-address')
									.text()
							: 'Needs a Location'
					}
					indexArr.push(index)

					if (
						indexArr.length ===
							$('.event-listing-container .event-listing').length &&
						indexArr.length === eventList.length
					) {
						res.json(eventList)
					}
				})
			})
		}
	})
})

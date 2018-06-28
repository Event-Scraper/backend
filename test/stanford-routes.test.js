const expect = require('chai').expect
const request = require('superagent')
const Promise = require('bluebird')

require('../server.js')
const url = `http://localhost:${process.env.PORT}`

describe('stanford Routes', function() {
	describe('GET: /api/events/stanford/all', () => {
		it('should return an array', done => {
			request.get(`${url}/api/events/stanford/all`).end((err, res) => {
				if (err) return done(err)
				expect(res.body).to.be.an('array')
				done()
			})
		}).timeout(100000)
	})
})

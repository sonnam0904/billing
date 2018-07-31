'use strict'
const View = use('View')
const Logger = use('Logger')

class HomeController {
    index () {
		var name = 'tester'
		Logger.debug('request details %j', {
		  url: name,
		  user: name
		})
        return View.render('global.layout', {my_name: name})
    }
}

module.exports = HomeController

'use strict'
const View = use('View')

class HomeController {
    index () {
        return View.render('global.layout', {my_name: 'sonnn'})
    }
}

module.exports = HomeController

'use strict'
const View = use('View')
const Logger = use('Logger')

class UserController {

    /**
     * index action user controller
     */
    index () {
        return 'user'
    }

    /**
     * show form login action
     */
    login () {
        
        return View.render('auth.login',{});
    }
    
    
    /**
     * sign action
     */
    sign () {
        return 'sign'
    }
    
    register(request){
        return request.all();
    }

    /**
     * fetch user by id
     */
    detail ( {request} ) {
        return request
    }
}

module.exports = UserController

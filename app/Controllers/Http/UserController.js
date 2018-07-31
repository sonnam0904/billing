'use strict'
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
    login ({view}) {

        return view.render('auth.login');
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

'use strict'

class UserController {

    /**
     * index action user controller
     */
    index () {
        return 'user'
    }

    /**
     * login action
     */
    login () {
        return 'login'
    }

    /**
     * fetch user by id
     */
    detail ( {request} ) {
        return request
    }
}

module.exports = UserController

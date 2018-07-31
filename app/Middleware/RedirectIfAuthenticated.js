'use strict'

class RedirectIfAuthenticated {
  async handle ({auth, request, response }, next) {
    try {
      await auth.check()
      await next()
    } catch(e){
      return response.redirect('/user/login')
    }   
  }
}

module.exports = RedirectIfAuthenticated

'use strict'

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URL's and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.1/routing
|
*/
/*************************************************** web route *******************************************************/
const Route = use('Route')

Route.get('/', 'HomeController.index')

Route.group(() => {
        Route.get('/', 'UserController.index').as('user.user.index')
        Route.get('login', 'UserController.login').as('user.user.login')
        Route.post('sign', 'UserController.sign').as('user.user.sign');
        Route.post('register', 'UserController.register').as('user.user.register');
        Route.get('logout', 'UserController.logout').as('user.user.logout')
        //Route.get('/:id', 'UserController.detail').as('user.user.detail').middleware('auth');
        
    })
    .prefix('user')
    // .middleware(['auth'])
    // .domain('muare.vn') // only apply for this domain



/*************************************************** api route *******************************************************/

/**
 * @see Api/v1/UserController
 */
Route.group(() => {
        Route.any('/user', 'UserController.index').as('api.v1.user.index')
    })
    .prefix('api/v1')
    .namespace('Api/v1')
    .formats(['json'])
'use strict'
const View = use('View')
const Logger = use('Logger')
const OAuth2 = require('../../Libary/VietID/lib/vietid')()

class HomeController {
  index () {
		return View.render('welcome')		
	}
	
	async loginVietId({request, response}){
		OAuth2.redirectRegister(request, response)
	}

	async callback({request, response}){
		OAuth2.getAccessToken(request, response, saveToken);
		function saveToken(error, token){
				console.log('zzzzzzzzzzzzzzzzzz');
				console.log(token);
				console.log('zzzzzzzzzzzzzzzzzz');
				if (error) {
						console.log('Access Token Error', error.message);
						return;
				}
				OAuth2.getUserInfo(token.token.accessToken, function(error, user){
						console.log('+++++++++++++++++++++++++++++++++');
						console.log(user);
						console.log('+++++++++++++++++++++++++++++++++');
						res.send(JSON.stringify(user));
				});
		}
	}

	async logout(request, response){
			const url = OAuth2.getUrlLogout('http://linkhay.com/logout');
			response.redirect(url);
	}

	async admin({view}){
		return view.render('admin.home.index');
	}
}

module.exports = HomeController

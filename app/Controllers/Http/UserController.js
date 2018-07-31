'use strict'
const Logger = use('Logger')
const { validate } = use('Validator')
const User = use('App/Models/User')

class UserController {

    /**
     * index action user controller
     */
    index ({view, session}) {
        return 'user'
    }

    /**
     * show form login action
     */
    async login ({view, auth, response}) { 

        if(auth.user){                        
            response.redirect('/admin')
        }                
        return view.render('auth.login')
    }
    
    
    /**
     * sign action
     */
    async sign ({request, auth, response, session}) {
        const rules = {
            email : 'required',
            password: 'required',                    
        }
        const validation = await validate(request.all(), rules)
        if(validation.fails()){                        
            return validation.messages();                  
        }
        
        const {email, password } = request.all()        
        await auth.attempt(email, password)
        session.flash({success: 'Đăng nhập thành công. Chào mừng ' + auth.user.name + ' đến với tool bizfly'})        
        response.redirect('/admin')
    }

    async logout({auth, response, session}){
        if(auth.user){
            await auth.logout()                        
            response.redirect('/user/login')
        }     
        response.redirect('/admin')        
    }
    
    async register({auth, request, session, response}){
        const data = request.only(['email','password','username','name','password_confirm'])
        
        const rules = {
            email : 'required|email|unique:users,email',
            password: 'required',
            username: 'required|unique:users',
            name: 'required',
            password_confirm: 'required_if:password|same:password',           
        }
        const validation = await validate(data, rules)
        if(validation.fails()){                        
            return validation.messages();                    
        }
        delete data.password_confirm
        const user = await User.create(data)
        // Authenticate the user
        await auth.login(user)
        session.flash({success: 'Đăng ký thành công. Chào mừng ' + data.name + ' đến với tool bizfly'});
        return response.redirect('/admin')

    }

    /**
     * fetch user by id
     */
    detail ( {request} ) {
        return request
    }
}

module.exports = UserController

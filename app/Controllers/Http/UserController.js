'use strict'
const Logger = use('Logger')
const { validate } = use('Validator')
const User = use('App/Models/User')

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
    async login ({view, auth, response}) {        
        if(await auth.check()){
            //return auth.user;
            //response.send("you are logined!");           
            return 123;
        }      
        return view.render('auth.login');                
    }
    
    
    /**
     * sign action
     */
    async sign ({request, auth, session}) {
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
        return "login ok";
    }

    async logout({auth, session}){
        await auth.logout()
        return "Logout"
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
            //session.withErrors(validation.messages()).flashExcept(['password']);
            return validation.messages();        
            //return 'Chưa nhập đầy đủ thông tin';
        }
        delete data.password_confirm
        const user = await User.create(data)
        // Authenticate the user
        await auth.login(user)

        return response.redirect('/')

    }

    /**
     * fetch user by id
     */
    detail ( {request} ) {
        return request
    }
}

module.exports = UserController

const User = require('../../models/user');
const bcrypt = require('bcrypt');
const passport = require('passport');

const _getRedirectUrl = (req) => {
    return req.user.role === 'admin' ? '/admin/orders' : '/customers/orders'
}

class authController{
    static async login(req, res){
        res.render('auth/login');
    }
    static async loginDo(req, res, next){
        const {email, password} = req.body;

        // Validating Request
        if(!email || !password){
            req.flash('error','All fields are required!');       
            return res.redirect('/login');
        }

        passport.authenticate('local', (err, user, info)=>{
            if(err){
                req.flash('error', info.message)
                return next(err);
            }
            if(!user){
                req.flash('error', info.message)
                return res.redirect('/login');
            }
            req.login(user, (err)=>{
                if(err){
                    req.flash('error', info.message);
                    return next(err);
                }
                return res.redirect(_getRedirectUrl(req));
               // return res.redirect('/');
            });
        })(req,res,next);
    }

    static async logoutDo(req,res){
        req.logout();
        return res.redirect('/');
    }

    static async register(req, res){
        res.render('auth/register');
    }

    static async registerDo(req, res){
        const {name, email, password} = req.body;

        // Validating Request
        if(!name || !email || !password){
            req.flash('error','All fields are required!');
            req.flash('name',name);
            req.flash('email',email);            
            return res.redirect('/register');
        }

        // Check if email exists 
        User.exists({ email: email }, (err, result) => {
            if(result) {
               req.flash('error', 'Email already taken')
               req.flash('name', name)
               req.flash('email', email) 
               return res.redirect('/register')
            }
        })
        

        // Hash password
        const hashPassword = await bcrypt.hash(password, 10);

        // Create a user account
        const user = new User({
            name,
            email,
            password: hashPassword
        });
        user.save().then((user)=>{
            // auto login after register
            return res.redirect('/'); 
        }).catch(err=>{
            req.flash('error','Something went wrong!');           
            return res.redirect('/register');
        })

    }

}

// exports.authController = authController
 module.exports = authController
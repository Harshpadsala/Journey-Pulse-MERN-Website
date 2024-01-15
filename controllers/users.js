const User = require('../models/user')

module.exports.renderSignupForm = (req,res)=>{
    res.render('users/signup.ejs');
};
module.exports.signup = async(req,res)=>{
    try{
        let {username,email,password} = req.body;
        let newUser = new User({email,username});
        let registeredUser = await User.register(newUser,password);
        console.log(registeredUser);

        req.login(registeredUser,(err)=>{
            if (err) {
                return next(err);
            }
            req.flash('success','Welcome to Journey-Pulse !');
            res.redirect('/listings');
        });
    } catch (err){
        req.flash('error',err.message);
        res.redirect('/signup');
    }
};

module.exports.renderLoginForm = (req,res)=>{
    res.render('users/login.ejs');
}

module.exports.login = (req,res)=>{
    req.flash('success','welcome to Journey Pulse !');
    let redirectUrl = res.locals.redirectUrl || '/listings';
    res.redirect(redirectUrl);        
};

module.exports.logout = (req,res,next)=>{
    req.logout((err)=>{
        if (err){
            return next(err);
        }
        req.flash('success','you are logged out');
        res.redirect('/listings');
    })
};

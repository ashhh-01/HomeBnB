const User=require("../models/user")

module.exports.renderRegister=(req,res)=>{
    res.render("user/register")
}

module.exports.register=async (req,res) => {
    try{
        const {username, email, password} = req.body;
        const user = new User({email, username});
        const registeredUser = await User.register(user, password);
        req.login(registeredUser,err=>{
            if(err) return next(err)
            req.flash("success", "Welcome to HomeBnB!");
            res.redirect("/houses");    
        })
    } catch(e) {
        req.flash("error", `${e.message}.`, "Please try again!");
    
        res.redirect("/register")
    }
}

module.exports.renderLogin=(req,res)=>{
    res.render("user/login")
}

module.exports.login=(req,res)=>{
    req.flash("success","Welcome Back!")
    res.redirect("/houses")
}
module.exports.logout=(req, res) => {
    req.logout(function (err) {
    // if (err) { return next(err); }
    req.flash('success', "Goodbye!");
    res.redirect('/houses');
    });
}
const express= require("express")
const router=express.Router()
const User=require("../models/user")
const catchAsync=require("../utils/catchAsync")
const passport = require("passport")
// const storeReturnTo=require("../middleware")

const users=require("../controllers/users")

router.route("/register")
    .get(users.renderRegister)
    .post(catchAsync(users.register));

router.route("/login")
    .get(users.renderLogin)
    .post(passport.authenticate("local",{failureFlash:true,failureRedirect:"/login"}) ,users.login)  
    
//Doesnt work

// router.post('/login',storeReturnTo, passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), (req, res) => {
//     req.flash('success', 'welcome back!');
//     const redirectUrl = req.session.returnTo || '/campgrounds';
//     delete req.session.returnTo;
//     res.redirect(redirectUrl);
// })

router.get('/logout', users.logout)
module.exports=router


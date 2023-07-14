if(process.env.NODE_ENV!=="production"){
    require("dotenv").config()
}

const express=require("express");
const app=express()
const path=require("path")
const mongoose=require("mongoose");
const methodOverride=require("method-override")
const ejsMate=require("ejs-mate")
const ExpressError=require("./utils/ExpressError")
const flash=require("connect-flash")
const passport=require("passport")
const localStrategy=require("passport-local")
const User=require("./models/user")
const mongoSanitize = require('express-mongo-sanitize');
const helmet=require("helmet")

const session=require("express-session")
const MongoStore = require('connect-mongo');


const houseRoutes=require("./routes/houseRoutes")
const reviewRoutes=require("./routes/reviews");
const userRoutes=require("./routes/user")
const db_urlAtlas=process.env.DB_URLATLAS
const db_url=process.env.MONGODB


const store = MongoStore.create({
    mongoUrl: db_urlAtlas,
    touchAfter: 24 * 60 * 60,
    crypto: {
        secret: process.env.STOREKEY
    }
});

store.on("error",function(e){
    console.log("Session Store Error",e)
})
mongoose.connect(db_urlAtlas)

const db=mongoose.connection
db.on("error",console.error.bind(console,"Connection error:"))
db.once("open",()=>{
    console.log("Database connected")
})
app.engine("ejs",ejsMate)
app.set("view engine","ejs")
app.set("views",path.join(__dirname,"views"))
app.use(express.urlencoded({extended:true}))
app.use(methodOverride("_method"))
app.use(express.static(path.join(__dirname,"public")))
app.use(mongoSanitize());

const scriptSrcUrls = [
    "https://api.tiles.mapbox.com/",
    "https://api.mapbox.com/",
    "https://cdn.jsdelivr.net",
];
const styleSrcUrls = [
    "https://cdn.jsdelivr.net/",
    "https://api.mapbox.com/",
    "https://api.tiles.mapbox.com/",
    "https://unicons.iconscout.com/",
    "https://api.unsplash.com/photos/random"
];
const connectSrcUrls = [
    "https://api.mapbox.com/",
    "https://a.tiles.mapbox.com/",
    "https://b.tiles.mapbox.com/",
    "https://events.mapbox.com/",
    "https://api.unsplash.com/photos/random"
    
];
app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: [],
            connectSrc: ["'self'", ...connectSrcUrls],
            scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
            styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
            workerSrc: ["'self'", "blob:"],
            objectSrc: [],
            imgSrc: [
                "'self'",
                "blob:",
                "data:",
                "https://res.cloudinary.com/ashh2021/", 
                "https://images.unsplash.com/",
            ],
        },
    })
);


const sessionConfig={
    store:store,
    name:"session",
    secret:"Secret",
    // secure:true,
    resave:false,
    saveUninitialized:true,
    cookie:{
        httpOnly:true,
        expires:Date.now()+1000*60*60*24*7,
        maxAge:1000*60*60*24*7
    }
}

app.use(session(sessionConfig ))
app.use(flash())

app.use(passport.initialize())
app.use(passport.session())
passport.use(new localStrategy(User.authenticate()))


passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())


app.use((req,res,next)=>{
    res.locals.currentUser=req.user
    res.locals.success=req.flash("success")
    res.locals.error=req.flash("error")
    next()
})
app.use("/houses",houseRoutes)
app.use("/houses/:id/reviews",reviewRoutes)
app.use("/",userRoutes)

app.get("/homeBnB",(req,res)=>{
    res.render("home")
})

app.all("*",(req,res,next)=>{
    next(new ExpressError("Page Not Found",404))
})
app.use((err,req,res,next)=>{
    const {statusCode=500}=err
    if(!err.message) err.message="Oh No, Something Went Wrong!"
    res.status(statusCode).render("error",{err})
})

const PORT=process.env.PORT 
app.listen(PORT,()=>{
    console.log(`Serving on port ${PORT}`)
})
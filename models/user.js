const mongoose=require("mongoose")
const passportLocalMongoose = require("passport-local-mongoose")
const Schema=mongoose.Schema


const UserSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    }
});
 
UserSchema.plugin(passportLocalMongoose);

UserSchema.post('save', function (error, doc, next) {
    if (error.name === 'MongoError' && error.code === 11000 && error.keyValue.email) {
        next(new Error('Email address was already taken, please choose a different one.'));
    } else {
        next(error);
    }
});
module.exports=mongoose.model("User",UserSchema)
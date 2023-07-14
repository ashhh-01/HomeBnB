const mongoose=require("mongoose")
const Review = require("./review")
const { string } = require("joi")
const Schema=mongoose.Schema

const ImageSchema=new Schema({
    url:String,
    filename:String
})
const opts={toJSON:{virtuals:true}}
ImageSchema.virtual("thumbnail").get(function(){
   return this.url.replace("/upload","/upload/w_200")
})

const HouseSchema=new Schema({
    title:String,
    images:[ImageSchema],
    ///
    carDist: {
        type: Number,
        min: 0,
        max: 1000
      },
      airDist: {
        type: Number,
        min: 0,
        max: 100
      },
      metroDist: {
        type: Number,
        min: 0,
        max: 100
      },
    ////
    geometry:{
        type:{
            type:String,
            enum:["Point"],
            required:true
        },
        coordinates:{
            type:[Number],
            required:true
        }
    },
    price:Number,
    description:String,
    location:String,
    owner:{
        type:Schema.Types.ObjectId,
        ref:"User"
    },
    reviews:[{
        type:Schema.Types.ObjectId,
        ref:"Review"
    }]
},opts)

HouseSchema.virtual('properties.popUpMarkup').get(function() {
    return `<strong><a href="/houses/${this._id}">${this.title}</a><strong>
    <p>${this.description.substring(0, 30)}...</p>`
});
 

HouseSchema.post("findOneAndDelete",async function(doc){
    if(doc){
        await Review.deleteMany({
            _id:{
                $in:doc.reviews
            }
        })
    }
})

module.exports=mongoose.model("Campground",HouseSchema)
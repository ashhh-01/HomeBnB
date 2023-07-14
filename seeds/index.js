if(process.env.NODE_ENV!=="production"){
  require("dotenv").config()
}
const mongoose=require("mongoose");
const Campground=require("../models/homeModel")
// const cities = require('country-state-city').City.getCitiesOfCountry("IN");
const {houseName,details}=require("./seedHelpers")
const cities = require('./cities');


mongoose.connect("mongodb://127.0.0.1:27017/camp-site1")
const axios=require("axios")


const db=mongoose.connection
db.on("error",console.error.bind(console,"Connection error:"))
db.once("open",()=>{
    console.log("Database connected")
})

// const sample=(array)=>array[Math.floor(Math.random()*array.length)]
const sample = (array) => array[Math.floor(Math.random() * array.length)];


async function seedImg() {
    try {
      const resp = await axios.get('https://api.unsplash.com/photos/random', {
        params: {
          client_id: process.env.UNSPLASH_KEY,
          collections: "QK3maVXw7yo",
          count: 45 
        },
      })
      return resp.data.map((a) => a.urls.small)
    } catch (err) {
      console.error(err)
    }
  }




const seedDB=async()=>{
    await Campground.deleteMany({})
    const imgs = await seedImg();
    for(let i=0;i<45;i++){
      // const randomInt = Math.floor(Math.random() * cities.length);

      const random1000 = Math.floor(Math.random() * 1000);
      const price=Math.floor(Math.random()*90)+10;
      const carDist=Math.floor(Math.random() *50) + 20;
      const airDist=Math.floor(Math.random() *4) + 2;
      const metroDist=Math.floor(Math.random() *6) + 2;

        const camp=new Campground({
            // location: `${cities[randomInt].name}, India`,
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title:`${sample(houseName)}`,
            // image: await seedImg(),
            owner:"64ab0efaa7d450f97d1661dc",
            // image:"https://images.unsplash.com/photo-1475518845976-0fd87b7e4e5d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxfDB8MXxyYW5kb218MHw0ODQzNTF8fHx8fHx8MTY4ODc0ODc0NQ&ixlib=rb-4.0.3&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=1080",
            description:`${sample(details)}`,
            price:price,
            images:[
              {
                // url: 'https://res.cloudinary.com/ashh2021/image/upload/v1688989266/Houses/n0cbfqsmy7lvtvtk0xex.jpg',
                // url:await seedImg(),
                url:sample(imgs),
                filename: 'Houses/n0cbfqsmy7lvtvtk0xex',
              },
              {
                // url: 'https://res.cloudinary.com/ashh2021/image/upload/v1688989267/Houses/wcnpjpqooayeyamjrlgf.jpg',
                // url:await seedImg(),
                url:sample(imgs),
                filename: 'Houses/wcnpjpqooayeyamjrlgf',
              }
            ],
            carDist:carDist,
            airDist:airDist,
            metroDist:metroDist,
            geometry: {
              type: "Point",
              coordinates: [
                  cities[random1000].longitude,
                  cities[random1000].latitude,
              ]
          },

        })
        await camp.save()
    }
}

seedDB().then(() => {
  mongoose.connection.close();
})
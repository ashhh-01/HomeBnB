const Campground = require('../models/homeModel');
const {cloudinary}=require("../cloudinary")
const mbxGeocoding=require("@mapbox/mapbox-sdk/services/geocoding")
const mapboxToken=process.env.MAPBOX_TOKENS
const geocoder = mbxGeocoding({accessToken:mapboxToken})

module.exports.index=async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('housePages/index', { campgrounds })
}

module.exports.renderNewForm=(req, res) => {
    res.render('housePages/new');
}
module.exports.createHouse=async (req, res, next) => {
    const geoData=await geocoder.forwardGeocode({
        query:req.body.campground.location,
        limit:1
    }).send()
    // res.send(geoData.body.features[0].geometry)
    const campground = new Campground(req.body.campground);
    campground.geometry=geoData.body.features[0].geometry
    campground.images=    req.files.map(f=>({url:f.path,filename:f.filename}))
    campground.owner = req.user._id;
    await campground.save();
    req.flash('success', 'Successfully added a house!');
    res.redirect(`/houses/${campground._id}`)
}
module.exports.showHouse=async (req, res,) => {
    const campground = await Campground.findById(req.params.id).populate({
        path: 'reviews',
        populate: {
            path: 'author',
            strictPopulate: false,
        }
    }).populate('owner');
    if (!campground) {
        req.flash('error', 'Cannot find the page!');
        return res.redirect('/houses');
    }
    res.render('housePages/show', { campground });
}
module.exports.renderEditForm=async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id)
    if (!campground) {
        req.flash('error', 'Cannot find the page!');
        return res.redirect('/houses');
    }
    res.render('housePages/edit', { campground });
}
// module.exports.updateHouse=async (req, res) => {
//     const { id } = req.params;
//     const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
//     const imgs=req.files.map(f=>({url:f.path,filename:f.filename}))
//     campground.images.push(...imgs)
//     await campground.save()
//     console.log(req.body.deleteImage)
//     if(req.body.deleteImage){
//         console.log(req.body.deleteImage)
//         for(let filename of req.body.deleteImage){
//             await cloudinary.uploader.destroy(filename)
//         }
//        await campground.updateOne({$pull:{images:{filename:{$in:req.body.deleteImage}}}},{ new: true }, )
//     }
//     req.flash('success', 'Successfully updated campground!');
//     res.redirect(`/campgrounds/${campground._id}`)
// }


module.exports.updateHouse = async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
    const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }));
    campground.images.push(...imgs);
    await campground.save();
    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }
        await campground.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } })
    }
    req.flash('success', 'Successfully updated the house!');
    res.redirect(`/houses/${campground._id}`)
}


module.exports.thanks=(req,res)=>{
    return res.render("housePages/thank")
}

module.exports.deleteHouse=async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted the post')
    res.redirect('/houses');
}
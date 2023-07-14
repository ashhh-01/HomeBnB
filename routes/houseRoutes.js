const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const { isLoggedIn, isAuthor, validateCampground } = require('../middleware');

const multer  = require('multer')
const {storage}=require("../cloudinary")
const upload = multer({ storage })

const houses=require("../controllers/houses")


router.route("/")
    .get(catchAsync(houses.index))
    .post(isLoggedIn, upload.array("images"),validateCampground, catchAsync(houses.createHouse));
    
router.get('/new', isLoggedIn, houses.renderNewForm)
router.get("/thankyou",isLoggedIn,houses.thanks)

router.route("/:id")
    .get(catchAsync(houses.showHouse))
    .put(isLoggedIn, isAuthor,upload.array("images"), validateCampground, catchAsync(houses.updateHouse))
    .delete(isLoggedIn, isAuthor, catchAsync(houses.deleteHouse));







router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(houses.renderEditForm))



module.exports = router;
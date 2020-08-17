let express		= require("express");
let router 		= express.Router();
let Campground	= require("../models/campground");
let middlewareObj= require("../middleware");


// Get all campgrounds from DB,
router.get('/', (request, response) => {
	Campground.find ( {}, function (error, allCampgrounds) {
		if (error) {
			request.flash("error", "Unable to connect to the internet")
			console.log(error);
		} else {
			response.render('../views/campground/index', {campgrounds:allCampgrounds})
		}
	})		
})

// Save new campground into DB
router.post('/', middlewareObj.isLoggedIn, (request, response) => {
	let name1 = request.body.name;
	let price1 = request.body.price;
	let image1 = request.body.image;
	let desc = request.body.description;
	let author = {
		id: request.user._id,
		username: request.user.username
	}
	let newCamp = {name:name1, price: price1, image:image1, description: desc, author:author};
	console.log(newCamp);
	// Create a new campground and save to DB
	Campground.create (newCamp, function (error, newlyCreated){
		if (error) {
			console.log(error);
			request.flash("error", "Failed to create new Campground")
		} else {
			request.flash("success", "New Campground created")
			response.redirect('/campground')
		}
	})
})

// Create new campground form
router.get('/new', middlewareObj.isLoggedIn, (request, response) => {
	response.render('../views/campground/new')
})

// Show more information of the campground
router.get("/:id", function (request, response){
	// find the campground with provided ID
	// render show templated with that campground
	Campground.findById( request.params.id).populate("comments").exec(function (error, foundCampground){
		if (error || !foundCampground) {
			request.flash("error", "Campground not found")
			response.redirect("back");
		} else {
			console.log(foundCampground)
			response.render("../views/campground/show", {campground: foundCampground})
		}
	});
})

// ======================================================
// UPDATE/ EDIT
// ======================================================

router.get('/:id/edit', middlewareObj.checkCampgroundOwnership, (request, response) => {
	Campground.findById( request.params.id, (error, foundCampground) => {
		response.render("../views/campground/edit", {currentCampground: foundCampground})
	})
})

router.put('/:id', middlewareObj.checkCampgroundOwnership, (request, response) => {
	Campground.findByIdAndUpdate(request.params.id, request.body.editedCampground, (error, editedCampground) => {
		if (error) {
			console.log("Router put error: " + error);
			response.redirect(request.params.id + "/edit");
		} else {
			request.flash("success", "Campground successfully edited")
			response.redirect(request.params.id);
		}
	})
})

// ======================================================
// DESTROY
// ======================================================
router.delete("/:id", middlewareObj.checkCampgroundOwnership, (request, response) => {
	Campground.findByIdAndDelete(request.params.id, (error) => {
		if (error) {
			console.log("router.delete error: "+error);
			response.redirect(request.params.id)
		} else {
			request.flash("success", "Campground successfully deleted")
			response.redirect("/campground")
		}
	})
})

// ======================================================
// Check Campground Ownership
// ======================================================
// function checkCampgroundOwnership(request, response, next){
// 	if (request.isAuthenticated()){
// 		Campground.findById(request.params.id, (error, foundCampground) => {
// 			if (error) {
// 				console.log("checkCampgroundOwnership error: " + error);
// 				response.redirect("back");
// 			} else {
// 				if (foundCampground.author.id.equals(request.user._id)){
// 					next();
// 				} else {
// 					response.redirect("back");
// 				}
// 			}
// 		})
// 	} else {
// 		response.redirect("back");
// 	}
// }


module.exports = router;













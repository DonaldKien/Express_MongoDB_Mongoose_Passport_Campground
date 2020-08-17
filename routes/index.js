let express		= require("express");
let router 		= express.Router();
let User		= require("../models/user");
let passport	= require("passport");


router.get('/', (request, response) => {
	response.render('landing')
})

// ======================================================
// SIGN UP
// ======================================================

router.get("/register", (request, response) => {
	response.render("register")
})

router.post("/register", (request, response) => {
	let newUser = new User({username: request.body.username});
	User.register(newUser, request.body.password, (err, user) => {
		if (err) {
			request.flash("error", err.message);
			return response.render("register");
		}
		passport.authenticate("local")(request, response, () => {
			request.flash("success", "Welcome " + user.username)
			response.redirect("/campground")
		})
	})
})

// ======================================================
// LOG IN
// ======================================================

router.get("/login", (request, response) => {
	response.render("login");
})

router.post(
	"/login", 
	passport.authenticate(
		"local", 
		{
			successRedirect:"/campground", 
			failureRedirect:"/login"
		}
	),
	(request, response) => {
})

// ======================================================
// LOG OUT
// ======================================================

router.get("/logout", (request, response) => {
	request.logout();
	request.flash("success", "Successfully logout");
	response.redirect("/campground");
})

module.exports = router;

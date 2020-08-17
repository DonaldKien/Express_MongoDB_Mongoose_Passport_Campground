let Campground		= require("../models/campground");
let Comment			= require("../models/comment");

let middlewareObj = {};

middlewareObj.checkCampgroundOwnership = function (request, response, next){
	if (request.isAuthenticated()){
		Campground.findById(request.params.id, (error, foundCampground) => {
			if (error || !foundCampground) {
				request.flash("error", "Permission denied")
				console.log("checkCampgroundOwnership error: " + error);
				response.redirect("back");
			} else {
				if (foundCampground.author.id.equals(request.user._id)){
					next();
				} else {
					request.flash("error", "Campground not found")
					response.redirect("back");
				}
			}
		})
	} else {
		request.flash("error", "Please Login")
		response.redirect("back");
	}
}

middlewareObj.checkCommentOwnership = function (request, response, next){
	if (request.isAuthenticated()){
		Comment.findById(request.params.comment_id, (error, foundComment) => {
			if (error) {
				console.log("checkCommentOwnership error: " + error)
				request.flash("error", "Comment not found")
				response.redirect("back");
			} else {
				if (foundComment.author.id.equals(request.user._id)){
					next()
				} else {
					request.flash("error", "Unable to find comment")
					response.redirect("back");
				}
			}
		})
	} else {
		request.flash("error", "Please Login")
		response.redirect("back");
	}
}

middlewareObj.isLoggedIn = function (request, response, next){
	if (request.isAuthenticated()) {
		return next();
	} else {
		request.flash("error", "Please Login, Thank you")
		response.redirect("/login");
	}
}

module.exports = middlewareObj;
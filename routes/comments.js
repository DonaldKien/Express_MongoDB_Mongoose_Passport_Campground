let express		= require("express");
let router 		= express.Router({mergeParams: true});
let Campground	= require("../models/campground");
let Comment		= require("../models/comment");
let middlewareObj= require("../middleware");
let currentTime	= require("../time")

// ======================================================
// COMMENT
// ======================================================
// Create Comment Page
router.get("/new", middlewareObj.isLoggedIn, (request, response) => {
	Campground.findById(request.params.id, (err, campgroundsId) => {
		if (err) {
			request.flash("error", "Failed to get comments")
			console.log(err)
		} else {
			response.render("comments/new", {campground:campgroundsId})
		}
	})
})

// Post Comment page
router.post("/", middlewareObj.isLoggedIn, (request, response) => {
	Campground.findById(request.params.id, (err, campgroundOfId) => {
		if (err) {
			request.flash("error", "Failed to find campground")
			console.log(err);
			response.redirect("/campground/" + request.params.id + "comments/new")
		} else {
			Comment.create(request.body.comment, (err, newComment) => {
				if (err) {
					request.flash("error", "Failed to save comment")
					console.log(err);
					response.redirect("/campground/" + request.params.id + "comments/new")
				} else {
					newComment.author.id = request.user._id;
					newComment.author.username = request.user.username;
					newComment.time = currentTime;
					newComment.save();
					campgroundOfId.comments.push(newComment);
					campgroundOfId.save();
					response.redirect("/campground/" + campgroundOfId._id)
				}
			})
		}
	})
})

// ======================================================
// EDIT COMMENT
// ======================================================
// Edit comment page
router.get("/:comment_id/edit", middlewareObj.checkCommentOwnership, function(request, response){
	Campground.findById(request.params.id, (error, foundCampground) => {
		if (error) {
			request.flash("error", "Campground not found");
			return response.redirect("back");
		}
	})
   Comment.findById(request.params.comment_id, function(err, foundComment){
      if(err || !foundComment){
		  request.flash("error", "Comment not found")
          response.redirect("back");
      } else {
        response.render("comments/edit", {campground_id: request.params.id, comment: foundComment});
      }
   });
});

// Update Comment 
router.put("/:comment_id", middlewareObj.checkCommentOwnership, (request, response) => {
	Comment.findByIdAndUpdate(request.params.comment_id, request.body.comment, (error, updatedComment) => {
		if (error) {
			request.flash("error", "Failed to update comment")
			console.log("put error: " + error);
			response.redirect("back");
		} else {
			response.redirect("/campground/" + request.params.id)
		}
	})
})

// ======================================================
// DELETE COMMENT
// ======================================================

router.delete("/:comment_id", middlewareObj.checkCommentOwnership, (request, response) => {
	Comment.findByIdAndDelete(request.params.comment_id, (error) => {
		if (error) {
			request.flash("error", "Failed to delete comment")
			console.log(error);
			response.redirect("back");
		} else {
			request.flash("success", "Comment deleted")
			response.redirect("/campground/" + request.params.id)
		}
	})
})

// ======================================================
// CHECK IS LOG IN
// ======================================================
// function isLoggedIn (request, response, next){
// 	if (request.isAuthenticated()) {
// 		return next();
// 	} else {
// 		response.redirect("/login");
// 	}
// }


// ======================================================
// Check Comment Ownership
// ======================================================
// function checkCommentOwnership(request, response, next){
// 	if (request.isAuthenticated()){
// 		Comment.findById(request.params.comment_id, (error, foundComment) => {
// 			if (error) {
// 				console.log("checkCommentOwnership error: " + error)
// 				response.redirect("back");
// 			} else {
// 				if (foundComment.author.id.equals(request.user._id)){
// 					next()
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
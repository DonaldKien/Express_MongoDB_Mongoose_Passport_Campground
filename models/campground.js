let mongoose 	= require("mongoose")

// SCHEMA SETUP
let campgroundSchema = new mongoose.Schema({
	name: String,
	price: String,
	image: String,
	description: String,
	author: {
		id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "UserCollectionV6"
		},
		username: String
	},
	comments: [
      	{	//embeding ID or reference to the comments
         	type: mongoose.Schema.Types.ObjectId,
         	ref: "Comment"
      	}
   	]
})

module.exports = mongoose.model("Campground", campgroundSchema);
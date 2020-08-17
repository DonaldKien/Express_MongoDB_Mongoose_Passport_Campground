let mongoose	= require("mongoose");

let userSchema = new mongoose.Schema({
	username: String,
	password: String
});

userSchema.plugin(require("passport-local-mongoose"))

module.exports = mongoose.model("UserCollectionV6", userSchema);
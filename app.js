let express 		= require('express'),
	app 			= express(),
	bodyParser 		= require('body-parser'),
	mongoose 		= require("mongoose"),
	seedDB 			= require("./seeds"),
	passport		= require("passport"),
	LocalStrategy	= require("passport-local"),
	User			= require("./models/user"),
	campgroundRoute = require("./routes/campground"),
	commentRoute	= require("./routes/comments"),
	indexRoute		= require("./routes/index"),
	methodOverride	= require("method-override"),
	connectFlash	= require("connect-flash"),
	currentTime		= require("./time")
// seedDB();
mongoose.connect("mongodb+srv://project_1:abc123!@cluster0.mibfu.mongodb.net/campground?retryWrites=true&w=majority", { 
	useNewUrlParser: true, useUnifiedTopology: true
});
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));

app.use(require("express-session")({
	secret: "this sentence use to encode and decode data",
	resave: false,
	saveUninitialized: false
}))
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(connectFlash());

app.use((request, response, next) => {
	response.locals.currentUser = request.user;
	response.locals.error = request.flash("error");
	response.locals.success = request.flash("success");
	response.locals.time = currentTime;
	next();
})

app.use("/campground", campgroundRoute);
app.use("/campground/:id/comments", commentRoute);
app.use("/", indexRoute);

app.listen(process.env.PORT || 3006, ()=> {
	console.log('YelpCamp Sever online')
})
































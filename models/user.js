//var mongojs = require('mongojs');
var bcrypt = require('bcryptjs');
var mongoose = require('mongoose');

// User Schema
var UserSchema = mongoose.Schema({
	activationUrl:				{	type: String,		index:true	},
	sessionToken: 				{	type: String,		index:true	},
	username: 						{	type: String,		index:true	},
	password: 						{	type: String	},
	email: 								{	type: String	},
  interiorDesignSetups: {	type: Array, index:true	},
	recentViewedDesigns:	{ type:Array},
  deviceConnections: 		{	type: Array	},
  paymentMathods: 			{	type: Array	},
  teamId: 							{	type: Number}
});

var User = module.exports = mongoose.model('User', UserSchema);

User.createUser = function(newUser, callback){
	bcrypt.genSalt(10, function(err, salt) {
	    bcrypt.hash(newUser.password, salt, function(err, hash) {
	        newUser.password = hash;
	        newUser.save(callback);
	    });
	});
}

User.getUserByUsername = function(username, callback){
	var query = {username: username};
	User.findOne(query, callback);
}

User.getUserById = function(id, callback){
	User.findById(id, callback);
}

User.comparePassword = function(candidatePassword, hash, callback){
	bcrypt.compare(candidatePassword, hash, function(err, isMatch) {
    	if(err) throw err;
    	callback(null, isMatch);
	});
}

User.updateUser = function(user, callback){
	console.log("\n User.updateUser,  user = " + user);
	User.update({username:user.username}, user, callback);
}

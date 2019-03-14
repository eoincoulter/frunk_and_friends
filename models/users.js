var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt-nodejs');
require('./util');

var usersSchema = new mongoose.Schema({
    //_id: {type: Schema.Types.ObjectId},
    user_name: { type: String, required: true },
    password: { type: String, required: true },
    email: { type: String, required: true },
    access_token: { type: String, required: true },
    friends: [{type: Schema.Types.ObjectId, ref: "Relationship"}],
    events: [{type: Schema.Types.ObjectId, ref: "EventRelationship"}],
//    eventsCreated: [{type: Schema.Types.ObjectId, ref: "Event"}]
}, {timestamps: true});

/*
 * Hashes the password for storage in the DB
 */
usersSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8));
};

// Compares passwords to determine if the user is who they say they are
usersSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
};

module.exports = mongoose.model('User', usersSchema);

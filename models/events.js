var mongoose = require('mongoose');
var Schema = mongoose.Schema;
require('./util');

var eventsSchema = new mongoose.Schema({
    //_id: Schema.Types.ObjectId,
    location: {type: String},
    description: {type: String},
    time: {type: Date, default: Date.now},
    //duration: {type: Number},
    creater: {type: Schema.Types.ObjectId, ref: "User"},
    eventStatus: {
      type: Number,
      enums: [
          0,    //'private',
          1     //"public"
      ] , default : 0
    },
    invitees:  [{type: Schema.Types.ObjectId, ref: "EventRelationship"}]
}, {timestamps: true});

module.exports = mongoose.model('Event', eventsSchema);

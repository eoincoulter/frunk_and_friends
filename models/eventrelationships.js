var mongoose = require('mongoose');
var Schema = mongoose.Schema;
require('./util');

var eventrelationshipsSchema = new mongoose.Schema({
    //_id: Schema.Types.ObjectId,
    eventID: {type: Schema.Types.ObjectId, ref: "Event"},
    requester: {type: Schema.Types.ObjectId, ref: "User"},
    recipient: {type: Schema.Types.ObjectId, ref: "User"},
    eventRelationshipStatus: {
      type: Number,
      enums: [
          0,    //'pending',
          1    //'going'
      ]
    },
}, {timestamps: true});

module.exports = mongoose.model('EventRelationship', eventrelationshipsSchema);

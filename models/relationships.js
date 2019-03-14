var mongoose = require('mongoose');
var Schema = mongoose.Schema;
require('./util');

var relationshipsSchema = new mongoose.Schema({
    //_id: Schema.Types.ObjectId,
    requester: { type: Schema.Types.ObjectId, ref: 'User'},
    recipient: { type: Schema.Types.ObjectId, ref: 'User'},
    status: {
      type: Number,
      enums: [
          0,    //'Blocked',
          1,    //'requested',
          2,    //'pending',
          3,    //'friends'
      ]
    }
}, {timestamps: true});

module.exports = mongoose.model('Relationship', relationshipsSchema);

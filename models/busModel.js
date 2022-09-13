const mongoose = require('mongoose');

const busSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.ObjectId,
      ref: 'busOwner',
    },
    routeId: {
      type: mongoose.Schema.ObjectId,
      ref: 'BusRoute',
    },
    seatNumber: {
      type: Number,
      require: [true, 'Please provide seat number'],
    },
    ac: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      default: 'Pending',
    },
  },
  { collection: 'buses' }
);

module.exports = mongoose.model('Bus', busSchema);

const mongoose = require('mongoose');
const validator = require('validator');
const baseUserModel = require('./userBaseModel');
const cryptPassword = require('../utils/cryptPass');
const extendSchema = require('mongoose-extend-schema');
const busOwnerSchema = extendSchema(baseUserModel.schema, {
  companyName: {
    type: String,
    require: false,
  },
  role: {
    type: String,
    default: 'passenger',
  },

  buses: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'Bus',
    },
  ],
});
Object.assign(busOwnerSchema.methods, baseUserModel.schema.methods);

busOwnerSchema.pre('save', cryptPassword);

module.exports = mongoose.model('busOwner', busOwnerSchema);

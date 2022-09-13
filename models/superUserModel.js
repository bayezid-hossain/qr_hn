const mongoose = require('mongoose');
const validator = require('validator');
const baseUserModel = require('./userBaseModel');
const cryptPassword = require('../utils/cryptPass');
const extendSchema = require('mongoose-extend-schema');

const superUserSchema = extendSchema(
  baseUserModel.schema,
  {},
  { collection: 'superuser' }
);
module.exports = mongoose.model('SuperUser', superUserSchema);

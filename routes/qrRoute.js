const express = require('express');
const { generateQRCode } = require('../controllers/qrController');
const {
  authorizeRoles,
  approvalStatus,

  isLoggedInUser,
  isAuthenticatedUser,
} = require('../middleware/auth');

const router = express.Router();

router
  .route('/api/v1/qr/generate/:id')
  .get(
    isLoggedInUser,
    [approvalStatus('approved'), authorizeRoles('[busOwner admin]')],
    generateQRCode
  );
module.exports = router;

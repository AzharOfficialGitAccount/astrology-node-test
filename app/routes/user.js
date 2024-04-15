const router = require('express').Router();
const controller = require('../controller/user');
const { validate } = require('../middleware/validate');
const schema = require('../validation/common');
const { verifyAuthToken } = require('../middleware/auth');

// ================================================= ADMIN_LOGIN_SECTION ==================================================

router.post('/signup', validate(schema.Signup), controller.signup);
router.post('/login', validate(schema.login), controller.login);
router.put('/update-profile', validate(schema.updateProfile), verifyAuthToken, controller.updateProfile);
router.delete('/delete-profile', verifyAuthToken, controller.deleteProfile);




module.exports = router;
const express = require('express');
const multer = require('multer')
const { registerCandidate, registerRecruiter } = require('../controllers/authController');
const { verifyOtp, resendOtp } = require('../controllers/otpControllers');


const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.post('/registerCandidate',upload.single("avatar"), registerCandidate)
router.post('/registerRecruiter',upload.single("avatar"), registerRecruiter)
router.post('/verifyOtp', verifyOtp)
router.post('/resendOtp', resendOtp);


module.exports = router;

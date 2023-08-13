const express = require('express')

const router = express.Router()
const AuthController =  require('../controller/auth_controller');

const middleware = require('../../../../middleware/headervalidator')

router.post('/signup',AuthController.signup);
router.post('/login',AuthController.login);
router.post('/socialLogin', AuthController.socialLogin);
router.post('/send_otp',AuthController.send_otp);
router.post('/verify_otp',AuthController.verify_otp);
router.post('/resend_otp',AuthController.resend_otp);
router.post('/change_password',AuthController.changepassword);
router.post('/contactus', AuthController.contact);
router.post('/profile_picture',AuthController.UploadprofilePicture)
router.post('/upload_documents',AuthController.uploadDocuments)  
router.post('/driving_lisence',AuthController.uploadDrivingLisence)
router.post('/add_address',AuthController.addAddress)
router.post('/delete_account',AuthController.deleteAccount)
router.post('/logout',AuthController.logout)
router.post('/forget_password',AuthController.forgetPassword)
router.get('/resetpassword',AuthController.resetpassword)
router.post('/edit_profile',AuthController.editProfile)
router.get('/get_profile',AuthController.getProfile)
router.post('/faqs',AuthController.AppContent)
router.post('/getfaqs',AuthController.getAppContent)
router.get('/pages/:alias',AuthController.appPages)

router.post('/decryption_demo', async (req, res) => {
     middleware.decryptionDemo(req.body, res);
});

router.post('/encryption_demo', async (req, res) => {
     middleware.encryptionDemo(req.body, res);
});


module.exports = router;
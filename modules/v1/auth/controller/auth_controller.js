// importing authenticate module
const authenticateModel = require('../models/auth_model')

// importing status codes
const Codes = require("../../../../config/status_codes");

// importing headervalidation 
const middleware = require("../../../../middleware/headervalidator");

// importing validation required rules
const validationRules = require('../../validation_rules');


// signup controller
const signup = async(req, res)=>{
    const request = await middleware.decryption(req);
    const valid = await middleware.checkValidationRules(request, validationRules.sigupValidation)
    if (valid.status) {
        return authenticateModel.signup(request, res)
    }else{
        return middleware.sendResponse(res, Codes.VALIDATION_ERROR, valid.error, null);
    }
}

const login = async(req, res)=>{
    const request = await middleware.decryption(req);

    const valid = await middleware.checkValidationRules(request, validationRules.loginValidation)

    if (valid.status) {
        return authenticateModel.login(request, res)
    }

    return middleware.sendResponse(res, Codes.VALIDATION_ERROR, valid.error, null)
}

const socialLogin = async(req, res)=>{
    const request = await middleware.decryption(req);
    const valid = await middleware.checkValidationRules(request, validationRules.socialLoginValidation)
    if (valid.status) {
        return authenticateModel.socialLogin(request, res)
    }
    return middleware.sendResponse(res, Codes.VALIDATION_ERROR, valid.error, null)
}

const send_otp = async(req, res)=>{
    const request = await middleware.decryption(req);
    const valid = await middleware.checkValidationRules(request, validationRules.otpsend)
    if (valid.status) {
        return authenticateModel.send_otp(request, res)
    }else{
        return middleware.sendResponse(res, Codes.VALIDATION_ERROR, valid.error, null);
    }
}

const verify_otp = async(req, res)=>{
    const request = await middleware.decryption(req);
    const valid = await middleware.checkValidationRules(request, validationRules.otpverify)
    if (valid.status) {
        return authenticateModel.verify_otp(request, res)
    }else{
        return middleware.sendResponse(res, Codes.VALIDATION_ERROR, valid.error, null);
    }
}

const resend_otp = async(req, res)=>{
    const request = await middleware.decryption(req);
    const valid = await middleware.checkValidationRules(request, validationRules.resend_otp)
    if (valid.status) {
        return authenticateModel.resend_otp(request, res)
    }else{
        return middleware.sendResponse(res, Codes.VALIDATION_ERROR, valid.error, null);
    }
}

const changepassword = async(req, res)=>{

    const request = await middleware.decryption(req);
    const valid = await middleware.checkValidationRules(request, validationRules.changepassword)
    request.user_id = req.user_id
    if (valid.status) {
        return authenticateModel.changepassword(request, res)
    }else{
        return middleware.sendResponse(res, Codes.VALIDATION_ERROR, valid.error, null);
    }
}

const contact = async(req, res)=>{
    const request = await middleware.decryption(req);
    const valid = await middleware.checkValidationRules(request, validationRules.contactusValidation)
    if (valid.status) {
        return authenticateModel.contactus(request, res)
    }else{
        return middleware.sendResponse(res, Codes.VALIDATION_ERROR, valid.error, null);
    }
}

const UploadprofilePicture = async(req, res)=>{
    
    const request = await middleware.decryption(req);
    const valid = await middleware.checkValidationRules(request, validationRules.profilepicture)
    if (valid.status) {
        return authenticateModel.uploadProfilePicture(request, res)
    }else{
        return middleware.sendResponse(res, Codes.VALIDATION_ERROR, valid.error, null);
    }
}

const uploadDrivingLisence = async(req, res)=>{
    
    const request = await middleware.decryption(req);
    const valid = await middleware.checkValidationRules(request, validationRules.drivingLisence)
    if (valid.status) {
        return authenticateModel.uploadDrivingLisence(request, res)
    }else{
        return middleware.sendResponse(res, Codes.VALIDATION_ERROR, valid.error, null);
    }
}

const uploadDocuments = async(req, res)=>{
    
    const request = await middleware.decryption(req);
    const valid = await middleware.checkValidationRules(request, validationRules.uploadDocument)
    if (valid.status) {
        return authenticateModel.uploadDocuments(request, res)
    }else{
        return middleware.sendResponse(res, Codes.VALIDATION_ERROR, valid.error, null);
    }
}

const addAddress = async(req, res)=>{
    
    const request = await middleware.decryption(req);
    const valid = await middleware.checkValidationRules(request, validationRules.valid_address)
    if (valid.status) {
        return authenticateModel.addAddress(request, res)
    }else{
        return middleware.sendResponse(res, Codes.VALIDATION_ERROR, valid.error, null);
    }
}

const forgetPassword = async(req, res)=>{
    const request = await middleware.decryption(req);
    const valid = await middleware.checkValidationRules(request, validationRules.fogetPass)
    if (valid.status) {
        return authenticateModel.forgetPassword(request, res)
    }else{
        return middleware.sendResponse(res, Codes.VALIDATION_ERROR, valid.error, null);
    }
}

const deleteAccount = async(req, res)=>{
    
    const request = await middleware.decryption(req);
    const valid = await middleware.checkValidationRules(request, validationRules.account_info)
    if (valid.status) {
        return authenticateModel.deleteAccount(request, res)
    }else{
        return middleware.sendResponse(res, Codes.VALIDATION_ERROR, valid.error, null);
    }
}

const logout = async(req, res)=>{
    
    const request = await middleware.decryption(req);
    const valid = await middleware.checkValidationRules(request, validationRules.logout_info)
    if (valid.status) {
        return authenticateModel.logout(request, res)
    }else{
        return middleware.sendResponse(res, Codes.VALIDATION_ERROR, valid.error, null);
    }
}

const AppContent = async(req, res)=>{
    
    const request = await middleware.decryption(req);
    const valid = await middleware.checkValidationRules(request, validationRules.faqvalidation)
    if (valid.status) {
        return authenticateModel.Faqs(request, res)
    }else{
        return middleware.sendResponse(res, Codes.VALIDATION_ERROR, valid.error, null);
    }
}

const getAppContent = async(req, res)=>{
    
    const request = await middleware.decryption(req);
    const valid = await middleware.checkValidationRules(request, validationRules.profileinfo)
    if (valid.status) {
        return authenticateModel.getFAQ(request, res)
    }else{
        return middleware.sendResponse(res, Codes.VALIDATION_ERROR, valid.error, null);
    }
}

const resetpassword = async (req, res) => {
    res.render('reset_password');
}

const getProfile = async(req, res)=>{
    
    const request = await middleware.decryption(req);
    const valid = await middleware.checkValidationRules(request, validationRules.profileinfo)
    if (valid.status) {
        return authenticateModel.getProfile(request, res)
    }else{
        return middleware.sendResponse(res, Codes.VALIDATION_ERROR, valid.error, null);
    }
}

const editProfile = async(req, res)=>{
    
    const request = await middleware.decryption(req);
    const valid = await middleware.checkValidationRules(request, validationRules.profile_obj)
    if (valid.status) {
        return authenticateModel.editProfile(request, res)
    }else{
        return middleware.sendResponse(res, Codes.VALIDATION_ERROR, valid.error, null);
    }
}

const appPages = async(req, res)=>{
    const request = await middleware.decryption(req);
    const valid = await middleware.checkValidationRules(request, validationRules.app_pages)
    if (valid.status) {
        return authenticateModel.getPageContent(request, res)
    }else{
        return middleware.sendResponse(res, Codes.VALIDATION_ERROR, valid.error, null);
    }
}



module.exports = {
    signup,login,socialLogin,send_otp,verify_otp,resend_otp,changepassword,contact,UploadprofilePicture,uploadDrivingLisence,addAddress,deleteAccount,logout,AppContent,getProfile,editProfile,forgetPassword,resetpassword,getAppContent,uploadDocuments,appPages
}
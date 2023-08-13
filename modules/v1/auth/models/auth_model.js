const moment = require('moment')
const twilio = require('twilio');
const randtoken = require('rand-token').generator();
const common = require("../../../../config/common");
const lang = require("../../../../config/language");
const Codes = require("../../../../config/status_codes");
const userSchema = require('../../../schema/user')
const contactUsSchema = require('../../../schema/contact')
const mediaSchema = require('../../../schema/media')
const notificationSchema = require('../../../schema/notification')
const appPageSchema = require('../../../schema/app_pages')
const OtpVerification = require('../../../schema/otpverification')
const userdeviceSchema = require('../../../schema/user_device_info')
const faqShema = require('../../../schema/faqs')
const middleware = require("../../../../middleware/headervalidator");
const template = require('../../../../config/template')


const authenticateModel = {
    // signup api

    async signup(req, res) {
        // check unique email
        const checkEmailUnique = await common.checkUniqueEmail(req);
        if (checkEmailUnique) {
            // if same email then through error
            return await middleware.sendResponse(res, Codes.NOT_FOUND, lang[req.language].rest_keywords_unique_email_error, null)
        } else {
            // check uniquemobile
            const checkUniqueMobile = await common.checkUniqueMobile(req);
            if (checkUniqueMobile) {
                // if same mobile number then through error
                return await middleware.sendResponse(res, Codes.NOT_FOUND, lang[req.language].rest_keywords_unique_mobilenumber_error, null)
            } else {
                // encrypted password

                if (req.password === "undefiend" && req.password === "") {
                    req.password = ""
                } else {
                    const encPass = await middleware.encryption(req.password)
                    req.password = encPass;
                }
                const newCustomer = new userSchema(req);
                newCustomer.validate()
                    .then(() => {
                        // If data is valid, save it to MongoDB
                        newCustomer.save()
                            .then(response => {
                                const token = randtoken.generate(64, "0123456789abcdefghijklnmopqrstuvwxyz");
                                req.token = token
                                const devicename = response.device_name
                                req.device_name = devicename
                                const userid = response.id
                                req.user_id = userid
                                const Customerdeviceinfo = new userdeviceSchema(req);
                                Customerdeviceinfo.save()
                                middleware.sendResponse(res, Codes.SUCCESS, lang[req.language].rest_keywords_success_signup_message, response);
                            })
                            .catch((error) => {
                                return middleware.sendResponse(res, Codes.INTERNAL_ERROR, lang[req.language].rest_keyword_something_went_wrong, error);
                            });
                    })
                    .catch((error) => {
                        // Invalid user data
                        return middleware.sendResponse(res, Codes.VALIDATION_ERROR, lang[req.language].rest_keyword_something_went_wrong, error);
                    });
            }
        }
    },


    async login(req, res) {
        // Checking if it's a social login or regu  lar login
        if (req.social_id) {
            // Social Login
            try {
                const customer = await userSchema.findOne({ social_id: req.social_id });
                if (!customer) {
                    return middleware.sendResponse(res, Codes.NOT_FOUND, lang[req.language].rest_keywords_customer_not_found,null);
                }
                const updateDeviceToken = randtoken.generate(64, "0123456789abcdefghijklnmopqrstuvwxyz");
                await userdeviceSchema.updateOne({ user_id: customer._id }, { $set: { token: updateDeviceToken } });
                return middleware.sendResponse(res, Codes.SUCCESS, lang[req.language].rest_keywords_login_success_message, customer);
            } catch (error) {
                return middleware.sendResponse(res, Codes.INTERNAL_ERROR, lang[req.language].rest_keywords_server_error,null);
            }
        } else {
            // Regular Login
            // checking email exists or not
            const checkEmailSuccess = await authenticateModel.CheckUniqueEmail(req);
            if (checkEmailSuccess !== null) {
                // encrypting password
                const encPass = await middleware.encryption(req.password);
                if (checkEmailSuccess.password === encPass) {
                    const customer = await userSchema.findOne({ email: req.email });
                    const updateDeviceToken = randtoken.generate(64, "0123456789abcdefghijklnmopqrstuvwxyz");
    
                    // Update token field in userdeviceSchema
                    await userdeviceSchema.updateOne({ user_id: customer._id }, { $set: { token: updateDeviceToken } });
    
                    return middleware.sendResponse(res, Codes.SUCCESS, lang[req.language].rest_keywords_login_success_message, customer);
                } else {
                    return middleware.sendResponse(res, Codes.VALIDATION_ERROR, lang[req.language].rest_keyword_customer_deleted, null);
                }
            } else {
                return middleware.sendResponse(res, Codes.VALIDATION_ERROR, lang[req.language].rest_keywords_customer_not_found, null);
            }
        }
    },
    

    async send_otp(req, res) {
        const { email, country_code, mobile_number } = req;
    
        // Checking email existence` 
        const checkEmailSuccess = await authenticateModel.CheckUniqueEmail(req);

        // Checking mobile number existence
        const checkMobileSuccess = await authenticateModel.checkUniqueMobile(req);

        if (checkEmailSuccess !== null) {
            const customer = await userSchema.findOne({ email });
            const otp = 1234;
            req.otp = otp;
            // Store OTP in tbl_otp
            const otpObj = {
                user_id: customer._id,
                email: (email !== "" && email !== undefined) ? email : customer.email,
                mobile_number: (mobile_number !== "" && mobile_number !== undefined) ? mobile_number : customer.mobile_number,
                country_code: (country_code !== "" && country_code !== undefined) ? country_code : customer.country_code,
                otp: req.otp
            };
            await OtpVerification.updateOne({ user_id: customer._id }, { $set: otpObj }, { upsert: true });
            common.send_email(email, 'Verify your email:', `<p><h3> Hello , <br>Please, verify your email </h3><h3>This is your OTP: ${otp}  </h3></p>`);
            return middleware.sendResponse(res, Codes.SUCCESS, lang[req.language].rest_keyword_email_sent_for_verification, customer, otpObj);
        } else if (checkMobileSuccess !== null) {
            // twilio credential
            const accountSid = process.env.SID;
            const authToken = process.env.AUTH_TOKEN;
            const client = twilio(accountSid, authToken);
    
            const customer = await userSchema.findOne({ mobile_number });
            const otp = 1234;
            req.otp = otp;
    
            const otpObj = {
                user_id         : customer._id,
                email           : (email !== "" && email !== undefined) ? email : customer.email,
                mobile_number   : (mobile_number !== "" && mobile_number !== undefined) ? mobile_number : customer.mobile_number,
                country_code    : (country_code !== "" && country_code !== undefined) ? country_code : customer.country_code,
                otp             : req.otp
            };
    
            await OtpVerification.updateOne({ user_id: customer._id }, { $set: otpObj }, { upsert: true });
    
            const messageBody = `Verify your OTP: ${otp}`;
            const messageSubject = `
                <p>
                <h3>Hello,</h3>
                <h3>Please verify your OTP.</h3>
                <h3>This is your OTP: ${otp}</h3>
                </p>
            `;

            const FROM_NO = process.env.PHONE_NUMBR
            client.messages.create({
                body: messageBody,
                from:FROM_NO,
                to: country_code + mobile_number
            })
                .then(() => {
                    common.send_sms(mobile_number, 'Verify your OTP:', messageSubject);
                    const otpverification = new OtpVerification(req);
                    otpverification.validate()
                        .then(() => {
                            otpverification.save()
                                .then((response) => {
                                    middleware.sendResponse(res, Codes.SUCCESS, lang[req.language].rest_keywords_success_message, response);
                                });
                        });
                })
                .catch((error) => {
                    return middleware.sendResponse(res, Codes.INTERNAL_ERROR, lang[req.language].rest_keyword_otp_send_error, null);
                });
        } else {
            return middleware.sendResponse(res, Codes.VALIDATION_ERROR, lang[req.language].rest_keywords_email_notvalid_message, null);
        }
    },
    

    // function for verify otp

    async verify_otp(req, res) {
        const otpverification = await OtpVerification.findOne({ $or: [{ "mobile_number": req.email_or_mobile }, { "email": req.email_or_mobile }] })
        if (otpverification && otpverification.otp === req.otp) {
            await userSchema.updateOne({ _id: otpverification.user_id }, { $set: { is_verify: req.is_verify } });
            middleware.sendResponse(res, Codes.SUCCESS, lang[req.language].rest_keywords_success_message, otpverification);
        } else {
            return middleware.sendResponse(res, Codes.VALIDATION_ERROR, lang[req.language].rest_keyword_invalid_otp, null);
        }
    },


    // Resend api

    async resend_otp(req, res) {
        // checking email exist or not 
        const checkEmailSuccess = await authenticateModel.CheckUniqueEmail(req);
        const checkMObileSuccess = await authenticateModel.checkUniqueMobile(req);
        if (checkEmailSuccess !== null) {
            const customer = await userSchema.findOne({ email: req.email });
            const otp = 5321;
            req.otp = otp;
            // Store OTP in tbl_otp
            const otpObj = {
                user_id: customer._id,
                email: (req.email !== "" && req.email !== undefined) ? req.email : customer.email,
                mobile_number: (req.mobile_number !== "" && req.mobile_number !== undefined) ? req.mobile_number : customer.mobile_number,
                country_code: (req.country_code !== "" && req.country_code !== undefined) ? req.country_code : customer.country_code,
                otp: req.otp
            };
            await OtpVerification.updateOne({ user_id: customer._id }, { $set: otpObj }, { upsert: true });
            common.send_email(req.email, 'Verify your email:', `<p><h3> Hello , <br>Please, verify your email </h3><h3>This is your OTP: ${otp}  </h3></p>`);
            return middleware.sendResponse(res, Codes.SUCCESS, lang[req.language].rest_keyword_email_resent, customer, otpObj);
        } else if (checkMObileSuccess !== null) {
            // twilow
            const otp = 1234
            req.otp = otp
            common.send_email(req.mobile_number, 'Verify your otp :', `<p><h3> Hello , <br>Please, verify your email </h3><h3>This is your OTP: ${otp}  </h3></p>`)
            const otpverification = new OtpVerification(req);
            otpverification.validate()
                .then(() => {
                    otpverification.save()
                        .then(response => {
                            middleware.sendResponse(res, Codes.SUCCESS, lang[req.language].rest_keywords_success_message, response);
                        })
                })
        } else {
            return middleware.sendResponse(res, Codes.VALIDATION_ERROR, lang[req.language].rest_keywords_email_notvalid_message, null);
        }
    },


     // Change password 

     async changepassword(request, res) {

        const pass = middleware.encryption(request.old_password)
        const info = await authenticateModel.customerdetails(request, res)
        if (info) {
            if (info.password === pass) {
                return middleware.sendResponse(res, Codes.INTERNAL_ERROR, lang[request.language].rest_keywords_both_password_same, null)
            } else {
                try {
                    // const abc = await middleware.encryption(request.new_password)
                    const upt_psd = {
                        password: await middleware.encryption(request.new_password)
                    }
                    const result = await userSchema.where({ _id: request.user_id }).updateOne({ $set: upt_psd });
                    return middleware.sendResponse(res, Codes.SUCCESS, lang[request.language].rest_keywords_password_update_success, result)
                } catch (error) {
                    return middleware.sendResponse(res, Codes.INTERNAL_ERROR, lang[req.language].rest_keyword_something_went_wrong, error);
                }
            }
        } else {
            return middleware.sendResponse(res, Codes.VALIDATION_ERROR, lang[request.language].rest_keywords_password_notvalid_message, null)
        }
    },


    // Contcat Us 

    async contactus(req, res) {
        try {
            const newCustomer = new contactUsSchema(req);
            newCustomer.validate()
                .then(() => {
                    // If data is valid, save it to MongoDB
                    newCustomer.save()
                        .then(response => {
                            middleware.sendResponse(res, Codes.SUCCESS, lang[req.language].rest_keywords_success_message, response);
                        })
                        .catch((error) => {
                            return middleware.sendResponse(res, Codes.INTERNAL_ERROR, lang[req.language].rest_keyword_something_went_wrong, error);
                        });
                })
                .catch((error) => {
                    // Invalid user Data
                    return middleware.sendResponse(res, Codes.VALIDATION_ERROR, lang[req.language].rest_keyword_something_went_wrong, error);
                });
        } catch (error) {
            return middleware.sendResponse(res, Codes.INTERNAL_ERROR, lang[req.language].rest_keyword_something_went_wrong, error);
        }
    },


    // update profile picture

    async uploadProfilePicture(request, res) {

        const userinfo = await authenticateModel.customerdetails(request, res)
        if (userinfo) {
            try {
                const upd_profile_picture = {
                    profile_picture: request.profile_picture
                }
                const result = await userSchema.where({ _id: request.user_id }).updateOne({ $set: upd_profile_picture });
                return middleware.sendResponse(res, Codes.SUCCESS, lang[request.language].rest_keywords_profile_picture_update_success, result)
            } catch (error) {
                return middleware.sendResponse(res, Codes.INTERNAL_ERROR, lang[req.language].rest_keyword_something_went_wrong, error);
            }
        } else {
            return middleware.sendResponse(res, Codes.VALIDATION_ERROR, lang[request.language].rest_keyword_error_in_uploading_profile_piucture, null)
        }
    },


     // Update Driving lisence picture

     async uploadDrivingLisence(request, res) {
        const userinfo = await authenticateModel.customerdetails(request, res)
        if (userinfo) {
            try {
                const upd_driving_lisence = {
                    driving_license_image: request.driving_license_image
                }
                const result = await userSchema.where({ _id: request.user_id }).updateOne({ $set: upd_driving_lisence });
                return middleware.sendResponse(res, Codes.SUCCESS, lang[request.language].rest_keywords_profile_picture_update_success, result)
            } catch (error) {
                return middleware.sendResponse(res, Codes.INTERNAL_ERROR, lang[req.language].rest_keyword_something_went_wrong, error);
            }
        } else {
            return middleware.sendResponse(res, Codes.VALIDATION_ERROR, lang[request.language].rest_keyword_error_in_uploading_profile_piucture, null)
        }
    },

    async uploadDocuments (request, res) {
        const userinfo = await authenticateModel.customerdetails(request, res)
        if (userinfo) {
            try {
                const upd_documents = {
                    id_proof : request.id_proof,
                    utility_bill : request.utility_bill,
                    rental_aggrement  : request.rental_aggrement,
                    tax_document :  request.tax_document

                }
                const result = await userSchema.where({ _id: request.user_id }).updateOne({ $set: upd_documents });
                return middleware.sendResponse(res, Codes.SUCCESS, lang[request.language].rest_keyword_document_upload_success, userinfo)
            } catch (error) {
                return middleware.sendResponse(res, Codes.INTERNAL_ERROR, lang[req.language].rest_keyword_something_went_wrong, error);
            }
        } else {
            return middleware.sendResponse(res, Codes.VALIDATION_ERROR, lang[request.language].rest_keyword_error_in_uploading_documents, null)
        }
    },

     // add address

     async addAddress(request, res) {
        const userinfo = await authenticateModel.customerdetails(request, res);
        if (userinfo) {
            try {
                const address_obj = {
                    address: request.address,
                    appartment: request.appartment,
                    city: request.city,
                    state: request.state,
                    country: request.country,
                    zip_code: request.zip_code
                };
                const result = await userSchema.updateOne({ _id: request.user_id }, { $set: address_obj });
                return middleware.sendResponse(res, Codes.SUCCESS, lang[request.language].rest_keywords_success_message, result);
            } catch (error) {
                return middleware.sendResponse(res, Codes.INTERNAL_ERROR, lang[req.language].rest_keyword_something_went_wrong, error);;
            }
        } else {
            return middleware.sendResponse(res, Codes.VALIDATION_ERROR, lang[request.language].rest_keywords_error, null);
        }
    },
    async ratingReviews(request, res) {
        const userinfo = await authenticateModel.customerdetails(request, res);
        if (userinfo) {
            try {
                const address_obj = {
                    address: request.address,
                    appartment: request.appartment,
                    city: request.city,
                    state: request.state,
                    country: request.country,
                    zip_code: request.zip_code
                };
                const result = await userSchema.updateOne({ _id: request.user_id }, { $set: address_obj });
                return middleware.sendResponse(res, Codes.SUCCESS, lang[request.language].rest_keywords_success_message, result);
            } catch (error) {
                return middleware.sendResponse(res, Codes.INTERNAL_ERROR, lang[req.language].rest_keyword_something_went_wrong, error);;
            }
        } else {
            return middleware.sendResponse(res, Codes.VALIDATION_ERROR, lang[request.language].rest_keywords_error, null);
        }
    },

    // delete account

    async deleteAccount(request, res) {

        const userinfo = await authenticateModel.customerdetails(request, res)

        if (userinfo) {
            try {
                const upd_info = {
                    is_active: request.is_active,
                    is_deleted: request.is_deleted
                }
                const result = await userSchema.where({ _id: request.user_id }).updateOne({ $set: upd_info });
                return middleware.sendResponse(res, Codes.SUCCESS, lang[request.language].rest_keyword_customer_deleted, result)
            } catch (error) {
                return middleware.sendResponse(res, Codes.INTERNAL_ERROR, lang[req.language].rest_keyword_something_went_wrong, error);
            }
        } else {
            return middleware.sendResponse(res, Codes.VALIDATION_ERROR, lang[request.language].rest_keyword_customer_deleted, null)
        }
    },


    // logout customer

    async logout(request, res) {
        const userinfo = await authenticateModel.customerdetails(request, res);
        if (userinfo) {
            try {
                const upd_params = {
                    is_active: request.is_active,
                };
                const result = await userSchema.updateOne({ _id: request.user_id }, { $set: upd_params });
                const token = "";
                res.token = token;
                await userdeviceSchema.updateOne({ user_id: request.user_id }, { $set: { token } });
                return middleware.sendResponse(res, Codes.SUCCESS, lang[request.language].rest_keyword_logout, result);
            } catch (error) {
                return middleware.sendResponse(res, Codes.INTERNAL_ERROR, lang[req.language].rest_keyword_something_went_wrong, error);;
            }
        } else {
            return middleware.sendResponse(res, Codes.VALIDATION_ERROR, lang[request.language].rest_keyword_customer_deleted, null);
        }
    },


    // forget password 

    async forgetPassword(req, res) {
        const checkEmailSuccess = await authenticateModel.CheckUniqueEmail(req);
        if (checkEmailSuccess !== null) {
            const OTP = Math.floor(1000 + Math.random() * 9000);
            req.OTP = OTP;
            const result = await userSchema.findOne({ email: req.email });
            const forgetPwdTemplate = await template.forgetPasswordTemplate(result);
            common.send_email(req.email, "Password Reset", forgetPwdTemplate, (response) => {
                if (response) {
                    return middleware.sendResponse(res, Codes.SUCCESS, lang[req.language].rest_keyword_email_sent, response);
                } else {
                    return middleware.sendResponse(res, Codes.VALIDATION_ERROR, lang[req.language].rest_keyword_customer_deleted, null);
                }
            });
        } else {
            return middleware.sendResponse(res, Codes.VALIDATION_ERROR, lang[req.language].rest_keywords_email_notvalid_message, null);
        }
    },


    // get profile

    async getProfile(request, res) {
        try {
            const customerinfo = await userSchema.findOne({ user_id : request.user_id })
            if (customerinfo) {
                middleware.sendResponse(res, Codes.SUCCESS,lang[request.language].rest_keyword_success_in_finding_user_details, customerinfo);
            } else {
                return middleware.sendResponse(res, Codes.VALIDATION_ERROR, lang[request.language].rest_keyword_error_in_finding_user_details, null)
            }
        } catch (error) {
            return middleware.sendResponse(res, Codes.INTERNAL_ERROR, lang[req.language].rest_keyword_something_went_wrong, error);;
        }
    },

     // edit profile

     async editProfile(request, res) {
        const userinfo = await authenticateModel.customerdetails(request, res);
        if (userinfo) {
            try {
                const profile_obj = {
                    firstname: request.firstname,
                    lastname: request.lastname,
                    email: request.email,
                    country_code: request.country_code,
                    mobile_number: request.mobile_number,
                };
                const result = await userSchema.updateOne({ _id: request.user_id }, { $set: profile_obj });
                const info = await authenticateModel.customerdetails(request, res);
                return middleware.sendResponse(res, Codes.SUCCESS, lang[request.language].rest_keywords_success_message, info);
            } catch (error) {
                return middleware.sendResponse(res, Codes.INTERNAL_ERROR, lang[req.language].rest_keyword_something_went_wrong, error);;
            }
        } else {
            return middleware.sendResponse(res, Codes.VALIDATION_ERROR, lang[request.language].rest_keywords_error, null);
        }
    },

    // Faqs

    async Faqs(req, res) {

        try {
            const newfaqList = new faqShema(req);

            newfaqList.validate()
                .then(() => {
                    // If data is valid, save it to MongoDB
                    newfaqList.save()
                        .then(response => {
                            middleware.sendResponse(res, Codes.SUCCESS, lang[req.language].rest_keywords_success_message, response);
                        })
                        .catch((error) => {
                            return middleware.sendResponse(res, Codes.INTERNAL_ERROR, lang[req.language].rest_keyword_something_went_wrong, error);
                        });
                })
                .catch((error) => {
                    // Invalid user data
                    return middleware.sendResponse(res, Codes.VALIDATION_ERROR, lang[req.language].rest_keyword_something_went_wrong, error);
                });
        } catch (error) {
            return middleware.sendResponse(res, Codes.INTERNAL_ERROR, lang[req.language].rest_keyword_something_went_wrong, error);
        }
    },


    async getFAQ(request, res) {
        try {
            const faqInfo = await faqShema.find();
            if (faqInfo.length > 0) {
                middleware.sendResponse(res, Codes.SUCCESS,lang[request.language].rest_keyword_success_in_finding_faqs, faqInfo);
            } else {
                return middleware.sendResponse(res,Codes.VALIDATION_ERROR,lang[request.language].rest_keyword_error_in_finding_faqs,null);
            }
        } catch (error) {
            return middleware.sendResponse(res, Codes.INTERNAL_ERROR, lang[req.language].rest_keyword_something_went_wrong, error);;
        }
    },
    
    // t & C , Privacy Policy and other page get api

    async getPageContent(request, res) {
        try {
            const topic = request.params.alias
            const content = await appPageSchema.find( {alias: topic } );
            if (content.length > 0) {
                middleware.sendResponse(res, Codes.SUCCESS,lang[request.language].rest_keyword_success_in_app_pages_content, content);
            } else {
                return middleware.sendResponse(res,Codes.VALIDATION_ERROR,lang[request.language].rest_keyword_error_in_app_pages_content,null);
            }
        } catch (error) {
            return middleware.sendResponse(res, Codes.INTERNAL_ERROR, lang[req.language].rest_keyword_something_went_wrong, error);;
        }
    },


 
    // Function to check unique email

    async CheckUniqueEmail(req) {
        const userDetails = await userSchema.findOne({ email: req.email })
        if (userDetails != null) {
            return userDetails;
        }
        return null;
    },


     // Function to check unique mobile number 

     async checkUniqueMobile(req) {
        const userDetails = await userSchema.findOne({ mobile_number: req.mobile_number })
        if (userDetails != null) {
            return userDetails;
        }
        return null;
    },

    // function to get user details

    async customerdetails(request, res) {
        const customerData = await userSchema.findOne({ _id: request.user_id })
        if (customerData) {
            return customerData
        } else {
            return null
        }
    },

}

module.exports = authenticateModel;
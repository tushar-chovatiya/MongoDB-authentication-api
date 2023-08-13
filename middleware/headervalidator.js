const Validator = require('Validator');
const crypto = require('crypto-js')
const lang = require("../config/language");
const logger = require('../logger');
const Codes = require('../config/status_codes');
const userdeviceSchema = require("../modules/schema/user_device_info");
const { log } = require('winston');
const SECRET = crypto.enc.Hex.parse(process.env.KEY);
const ENC_IV = crypto.enc.Hex.parse(process.env.IV);



const headerValidator = {

    /**
    * Function to extract the header language and set language environment
    * @param {Request Object} req 
    * @param {Response Object} res 
    */

    // function for extract accept language from request header and set in req globaly
    extractHeaderLanguage: async (req, res, next) => {
        try {
            const language = (req.headers['accept-language'] !== undefined && req.headers['accept-language'] !== '') ? (req.headers['accept-language'] === 'en-GB,en-US;q=0.9,en;q=0.8' ? 'en' : req.headers['accept-language']) : 'en';
            req.language = language;
            next()
        } catch (error) {
            logger.error(error)
        }

    },


    /**
     * Function to extract the header language and set language environment
     * @param {Request Object} req 
     * @param {Response Object} res 
     */
    extractHeaderLanguage: (req, res, next) => {
        try {
            const language = (req.headers['accept-language'] !== undefined && req.headers['accept-language'] !== '') ? req.headers['accept-language'] : "en";
            req.language = language;
            next()
        } catch (error) {
            logger.error(error)

        }
    },


    /**
    * Function to validate API key of header (Note : Header keys are encrypted)
    * @param {Request Object} req 
    * @param {Response Object} res 
    */


    validateHeaderApiKey: async (req, res, next) => {

        const bypassHeaderKey = new Array("sendnotification", "resetpassword", "resetPass", "encryption_demo", "decryption_demo");

        try {

            const apiKey = (req.headers['api-key'] != undefined && req.headers['api-key'] != '') ? crypto.AES.decrypt(req.headers['api-key'], SECRET, { iv: ENC_IV }).toString(crypto.enc.Utf8) : "";

            const pathData = req.path.split("/");
            

            if (bypassHeaderKey.indexOf(pathData[1]) === -1) {
                if (apiKey !== '') {
                    if (apiKey === process.env.API_KEY) {
                        next();
                    } else {
                        return await headerValidator.sendResponse(res, Codes.UNAUTHORIZED, lang[req.language].rest_keywords_api_notvalid_message, null);
                    }
                } else {
                    return await headerValidator.sendResponse(res, Codes.UNAUTHORIZED, lang[req.language].rest_keywords_api_notvalid_message, null);
                }
            } else {
                next()
            }
        } catch (error) {
            logger.error(error.message);
        }
    },

    /**
    * Function to validate the token of any user before every request
    * @param {Request Object} req 
    * @param {Response Object} res 
    */

    validateHeaderToken: async (req, res, next) => {
        const bypassMethod = new Array("contactus","pages","verify-user", "signup", "verify_otp", "login", "forget_password", "socialLogin", "faqs", "resetpassword", "resetPass", "uploadProfileImg", "getfaqs", "decryption_demo", "encryption_demo");
        const pathData = req.path.split("/");
        try {

            if (bypassMethod.indexOf(pathData[1]) === -1) {

                const headtoken = crypto.AES.decrypt(req.headers['token'], SECRET, { iv: ENC_IV }).toString(crypto.enc.Utf8).replace(/\s/g, '');
                if ((req.headers.token !== undefined && req.headers.token !== '') ? req.headers.token : '') {
                    if (headtoken !== '') {
                        try {
                            const userDetails = await userdeviceSchema.findOne({ token: `${headtoken}` })
                            if (userDetails) {
                                req.user_id = userDetails.user_id;
                                next();
                            } else {
                                return headerValidator.sendResponse(res, Codes.UNAUTHORIZED, lang[req.language].rest_keywords_token_notvalid_message, null);
                            }

                        } catch (error) {
                            return headerValidator.sendResponse(res, Codes.UNAUTHORIZED, lang[req.language].rest_keywords_token_notvalid_message, null);
                        }
                    } else {
                        return headerValidator.sendResponse(res, Codes.UNAUTHORIZED, lang[req.language].rest_keywords_token_notvalid_message, null);
                    }
                } else {
                    return headerValidator.sendResponse(res, Codes.UNAUTHORIZED, lang[req.language].rest_keywords_token_notvalid_message, null);
                }
            } else {
                next()
            }
        } catch (error) {
            return headerValidator.sendResponse(res, Codes.INTERNAL_SERVER_ERROR, 'An error occurred', null);

        }


    },

    /**
    * Function to check validation rules for all api's 
    * @param {Request Parameters} request 
    * @param {Response Object} response 
    * @param {Validattion Rules} rules 
    * @param {Messages} messages 
    * @param {Keywords} keywords 
    */


    // check Validation Rules
    checkValidationRules: async (request, rules) => {
        try {
            const v = Validator.make(request, rules);
            const validator = {
                status: true,
            }
            if (v.fails()) {
                const ValidatorErrors = v.getErrors();
                validator.status = false
                for (const key in ValidatorErrors) {
                    validator.error = ValidatorErrors[key][0];
                    break;
                }
            }
            return validator;
        } catch (error) {
            logger.error(error)
        }
    },


    /**
     * Function to return response for any api
     * @param {Request Object} req 
     * @param {Response Object} res 
     * @param {Status code} statuscode 
     * @param {Response code} responsecode 
     * @param {Response Msg} responsemessage 
     * @param {Response Data} responsedata 
     */

    // function for send Response
    sendResponse: async (res, resCode, msgKey, resData) => {
        try {
            const responsejson =
            {
                "code": resCode,
                "message": msgKey
            }
            if (resData != null) {
                responsejson.data = resData;
            }
            console.log("Result : - ",responsejson);
            const result = await headerValidator.encryption(responsejson);
            res.status(200).send(result);

        } catch (error) {
            logger.error(error);
            res.status(500).send("Internal Server Error");
        }
    },


    /**
 * Function to decrypt the data of request body
 * 21-04-2022
 * @param {Request Body} req 
 * @param {Function} callback 
 */

    decryption: async (req) => {
        try {
            if (req.body !== undefined && Object.keys(req).length !== 0) {
                
                const request = JSON.parse(crypto.AES.decrypt(req.body, SECRET, { iv: ENC_IV }).toString(crypto.enc.Utf8));
                console.log(request);
                request.language = req.language;
                request.user_id = req.user_id;
                request.params = req.params;
                return request;
            } else {
                return false;
            }

        } catch (error) {
            console.log(error);
            return {};
        }
    },


    /**
    * Function to encrypt the response body before sending response
    * 03-12-2019
    * @param {Response Body} req 
    */

    encryption: async (req) => {
        try {
            const encryptedData = crypto.AES.encrypt(JSON.stringify(req), SECRET, { iv: ENC_IV }).toString();
            return encryptedData;

        } catch (error) {
            return {};
        }
    },


    /**
     * Function for decryption demo
     * 11-07-2023
     * @param {Request Body} req 
     * @param {res} res 
     */
    decryptionDemo: async (req, res) => {

        try {
        const decryptedData = JSON.parse(crypto.AES.decrypt(req, SECRET, { iv: ENC_IV }).toString(crypto.enc.Utf8));
        res.json(decryptedData);
            
        } catch (error) {
            console.log(error)
        }
     
    },

    /**
     * Function to encryption demo
     * 11-07-2023
     * @param {Response Body} req 
     * @param {res} res 
     */

    encryptionDemo: function (req, res) {
        try {
            const encryptData = crypto.AES.encrypt(req, SECRET, { iv: ENC_IV }).toString();
        res.json(encryptData);
        } catch (error) {
            console.log(error)
        }
        
    },


}

module.exports = headerValidator;
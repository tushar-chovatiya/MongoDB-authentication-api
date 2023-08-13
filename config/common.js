const nodemailer = require('nodemailer');
const twilio = require('twilio')
const dbConn = require("./database");
const userSchema = require("../modules/schema/user");

const common = {

    // function for check unique email
    async checkUniqueEmail(req) {
        try {
            const user = await userSchema.findOne({ email: req.email })

            if (user != null) {
                return true;
            }

            return false;

        } catch (error) {
            return error;
        }
    },

    // function for check unique mobile number

    async checkUniqueMobile(req) {
        try {
            const user = await userSchema.findOne({ mobile_number: req.mobile_number })

            if (user != null) {
                return true;
            }
            return false;
        } catch (error) {
            return error;
        }
    },


    // function for send email
    async send_email(toEmail, sub, message) {
        try {
            const transporter = nodemailer.createTransport({
                host: 'smtp.gmail.com',
                port: 587,
                secure: false,
                auth: {
                    user: process.env.EMAIL_ID,
                    pass: process.env.EMAIL_PASSWORD
                }
            });
            const mailOptions = {
                from: process.env.EMAIL_ID,
                to: toEmail,
                subject: sub,
                html: message
            };
            return await transporter.sendMail(mailOptions)
        }
        catch (error) {
            return error;
        }

    },


    // function to send otp to mobile using twilio

    async send_sms(req) {
        try {
            const accountSid = 'AC8cb4eadce7c71511dd02172c15542a58';
            const authToken = 'cef863acb4af87b5f9c63bc39a789c9b';
            const client = twilio(accountSid, authToken);
            client.messages
                .create({
                    body: 'Hello from twilio-node',
                    to: '+91 6372608302', // Text your number
                    from: '(506)499-9629', // From a valid Twilio number
                })
                .then((message) => console.log(message.sid));

        } catch (error) {
            return error;
        }
    },

    /**
  * @comment Function to generate random otp.
  * 12-08-2022
  */
    async RandomOtpGenerator() {
        const seq = (Math.floor(Math.random() * 10000) + 10000)
            .toString()
            .substring(1);
        return seq;

    }



}




module.exports = common;
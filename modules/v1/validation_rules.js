const validatorRules =  {


    // auth api rules
    
    sigupValidation: {
        social_id: "required_if:login_type,F,G,A",
        firstname: "required",
        lastname: "required",
        email: "required|email",
        country_code: "required",
        mobile_number: "required",
        password: "required_if:login_type,S",
        profile_picture: "",
        driving_license_image :"",
        login_type: "required|in:S,F,G,A",
        user_type: "required|in:1,2",
        device_type: "required",
        device_token: "required",
        device_name: "required",
        refferal_code : "",
        address : "",
        appartment: "",
        city:"",
        state : "",
        country:"",
        zip_code : "",
        uuid: "",
        os_version: "",
        model_name: "",
        ip: ""
    },

    loginValidation: {
        email: "",
        password: "",
        social_id : ""

    },

    socialLoginValidation:{
        social_id : "required"
    },

    otpsend: {
        email: "",
        mobile_number : ""
    },

    otpverify: {
        otp: 'required',
        email_or_mobile:'required'   
    },

    resend_otp: {
        email: "required|email"
    },

    changepassword: {
        old_password: "required",
        new_password: "required"
    },

    contactusValidation: {
        name: "required",
        email: "required|email",
        subject: "required",
        descriptions: "required"
    },

    profilepicture: {
        profile_picture: "required"
    },

    drivingLisence: {
        driving_license_image : "required"
    },

    uploadDocument: {
        id_proof : "required",
        utility_bill : "required",
        rental_aggrement  : "required",
        tax_document : "required"
    },

    valid_address : {
        address : "required",
        appartment: "required",
        city:"required",
        state : "required",
        country:"required",
        zip_code : "required",
    },

    account_info : {
        user_id : "",
        is_active : "required",
        is_deleted : "required"
    },

    logout_info : {
        "user_id" : "",
        "is_active":"required"
    },

    faqvalidation: {
        question: "required",
        answer: "required",
    },


    profile_obj : {
        firstname: "",
        lastname : "",
        email : "",
        country_code : "",
        mobile_number : ""
    },

    profileinfo:{},

    fogetPass : {
        email : "required"
    },

    app_pages:{},


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    // other api rules



}
module.exports = validatorRules;

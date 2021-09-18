const {User, ForgotPassword} = require('../../../models');
const Validator = require('fastest-validator');//Library Validator
const v = new Validator();
const jwt = require('jsonwebtoken'); //Library for convert user login to token

const sendEmail = require("../../../utils/email/sendEmail");//Template Email

//Variable base url service user
const { 
    FRONT_END_URL_FORGOT_PASSWORD,
    JWT_SECRET,
}= process.env;

module.exports = async (req, res) =>{
    //Validate Data
    const schema = {
        email: { type: "email", empty:false}
    }

    const validate= v.validate(req.body, schema);

    //Message Validate
    if(validate.length){
        return res.status(400).json({
            status: 'error',
            message: validate
        });
    }
    
    
    //Check registered email
    const user = await User.findOne({
        where: { email: req.body.email}
    });

    //Return Message email
    if(!user){
        return res.status(404).json({
            status: 'error',
            message: 'Email not found'
        });
    }

    //Check existig token reset pw
    const checkToken = await ForgotPassword.findOne({ where:{user_id: user.id} });

    //Delete existing token
    if(checkToken) await checkToken.destroy();
    
    //Generate Token
    const resetToken = jwt.sign({user}, JWT_SECRET, {expiresIn: 60 * 15}); // Create Reset PW JWT Token, & set expired time


    //Define data parameter for register to database
    const data= {
        user_id:user.id,
        reset_token: resetToken,
    };
    
    //Execute query
    const createResetToken = await ForgotPassword.create(data);

    const link = `${FRONT_END_URL_FORGOT_PASSWORD}?token=${resetToken}&id=${user.id}`;

    //Send Email
    sendEmail(user.email,"Password Reset Request",{name: user.name,link: link,},"./template/requestResetPassword.handlebars");
    
    return res.json({
        status: 'success',
        message: 'Check your email for a link to reset your password. If it doesn’t appear within a few minutes, check your spam folder',
    })
    
}
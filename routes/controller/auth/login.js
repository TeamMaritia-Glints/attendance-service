const bcrypt = require('bcrypt');//Library Hashing password
const {User} = require('../../../models');
const Validator = require('fastest-validator');//Library Validator
const v = new Validator();
const jwt = require('jsonwebtoken'); //Library for convert user login to token

//Variable base url service user
const { 
    JWT_SECRET,
    JWT_SECRET_REMEMBER_TOKEN,
    JWT_ACCESS_TOKEN_EXPIRED,
    JWT_REMEMBER_TOKEN_EXPIRED

}= process.env;

module.exports = async (req, res) =>{
    
    //Validate Data Request
    const schema = {
        email: { type: "string", empty:false},
        password: { type: "string", min: 6, optional: false} ,
    }
    const validate= v.validate(req.body, schema);

    //Message Validate
    if(validate.length){
        return res.status(400).json({
            status: 'error',
            message: validate
        });
    }

    //Check registered  from database
    const user = await User.findOne({
        where: { email: req.body.email}
    });

    //Return Message email
    if(!user){
        return res.status(404).json({
            status: 'error',
            message: 'User not found'
        });
    }

    //Check password
    const isValidPassword = await bcrypt.compare(req.body.password, user.password);
    if(!isValidPassword){
        return res.status(404).json({
            status: 'error',
            message: 'User not found'
        });
    }

    //Check status user
    const status = user.status;
    if(status === 'non-active'){
        return res.status(404).json({
            status: 'error',
            message: 'This account has been deactivated by admin'
        });
    }

    //Select data for Success Login or Pass All Validation
    const data = await User.findOne({
        where: { email: req.body.email}, 
        attributes: ['id', 'name', 'email', 'role']
    });

    
    //Generate Token
    const token = jwt.sign({data}, JWT_SECRET, {expiresIn:JWT_ACCESS_TOKEN_EXPIRED}); // Create JWT Token, & set expired time
    const refresh_token = jwt.sign({data}, JWT_SECRET_REMEMBER_TOKEN, {expiresIn:JWT_REMEMBER_TOKEN_EXPIRED});// create Remember Token, & set expired time
    
    //Update Remember Token at user database
    await user.update({
        refresh_token: refresh_token,
    });

    return res.json({
        status: 'success',
        token,
        refresh_token,
    })

}
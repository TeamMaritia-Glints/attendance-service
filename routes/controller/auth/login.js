const bcrypt = require('bcrypt');//Library Hashing password
const {User, Office} = require('../../../models');
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
        email: { type: "email", empty:false},
        password: { type: "string", min: 6, optional: false},
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
            message: 'Wrong email or password'
        });
    }

    //Check password
    const isValidPassword = await bcrypt.compare(req.body.password, user.password);
    if(!isValidPassword){
        return res.status(404).json({
            status: 'error',
            message: 'Wrong email or password'
        });
    }

    //Check status user
    const status = user.status;
    if(status === false){
        return res.status(404).json({
            status: 'error',
            message: "Your account is not approved by admin, please contact to IT Center"
        });
    }

    //Check active user
    const active = user.active;
    if(active === false){
        return res.status(404).json({
            status: 'error',
            message: "Your account is not active, please contact to administrator"
        });
    }

    //Select data for Success Login or Pass All Validation
    const data = await User.findOne({
        where: { email: req.body.email}, 
        attributes: ['id', 'name', 'email', 'role'],
        include: {
            model: Office,
            attributes: ['id', 'name', 'latitude', 'longitude']
        }
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
        message:'Login Successful!'
    })

}
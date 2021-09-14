const {User, ForgotPassword} = require('../../../models');
const bcrypt = require('bcrypt');//Library Hashing password
const Validator = require('fastest-validator');//Library Validator
const fs = require('fs');
const v = new Validator();


module.exports = async (req, res) =>{
    //Validate Data
    const schema = {
        password: { type: "string", min: 6, optional: false} ,
        confirmpassword: { type: "equal", field: "password", optional: false }
    }

    const validate= v.validate(req.body, schema);

    //Message Validate
    if(validate.length){
        return res.status(400).json({
            status: 'error',
            message: validate
        });
    }

    //Check registered token
    const token = req.query.token; //token is retrieve from url parameter
    const checkToken = await ForgotPassword.findOne({
       where: { reset_token: token}
    });

    if(!checkToken){
        return res.status(404).json({
            status: 'error',
            message: 'Invalid Token'
        });
    }
    
    //Check user id token
    const id = req.query.id; //id is retrieve from url parameter
    const user = await ForgotPassword.findOne({
        where: { user_id: id}
    });

    if(!user){
        return res.status(404).json({
            status: 'error',
            message: "Invalid User"
        });
    }

    // Check Registered User Id
    const userAccount = await User.findByPk(id);

    if(!userAccount){
        return res.status(404).json({
            status: 'error',
            message: 'User not found'
        });
    }
    
    //Variable hash password
    const password = await bcrypt.hash(req.body.password, 10);
    
    //Execute Update Pw & Delete Token
    await userAccount.update({
        password,
    });
    await user.destroy();


    
    return res.json({
        status: 'success',
        message: 'Password Changed'
    })
    
}
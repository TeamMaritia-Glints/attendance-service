const {User} = require('../../../models');
const bcrypt = require('bcrypt');//Library Hashing password
const Validator = require('fastest-validator');//Library Validator
const fs = require('fs');
const v = new Validator();


module.exports = async (req, res) =>{
    //Validate Data
    const schema = {
        oldpassword:{ type: "string", min: 6, optional: false} ,
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
    
    
    //Check registered id
    const id = req.user.data.id; //id is retrieve from middleware
    const user = await User.findByPk(id);

    if(!user){
        return res.status(404).json({
            status: 'error',
            message: 'user not found'
        });
    }

    //Check password
    const isValidPassword = await bcrypt.compare(req.body.oldpassword, user.password);
    if(!isValidPassword){
        return res.status(404).json({
            status: 'error',
            message: 'Incorrect Old Password'
        });
    }

    
    //Variable hash password
    const password = await bcrypt.hash(req.body.password, 10);

    await user.update({
        password,
    });
    
    return res.json({
        status: 'success',
        message: 'Password Changed'
    })
    
}
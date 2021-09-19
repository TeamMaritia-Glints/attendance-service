const {User, Office} = require('../../../models');// Call Model
const bcrypt = require('bcrypt');//Library Hashing password
const Validator = require('fastest-validator');//Library Validator Request > Documentation coba check di google "npm fastest-validator"
const v = new Validator();

module.exports = async (req, res) =>{
    
    //Validate Data
    const schema = {
        name: { type: "string", optional: true, empty:false},
        email: { type: "email", optional: true, empty:false},
        password: { type: "string", min: 6, optional: true, empty:false} ,
        confirmpassword: { type: "equal", field: "password", optional: true, empty:false },
        role: { type: "string", items: "string", enum: [ "admin", "employee"], optional: true},
        status: { type: "boolean", convert: true, optional: true, empty:false},
        active: { type: "boolean", convert: true, optional: true, empty:false},
        office_id:{ type:"number", integer: true, optional: true, empty:false}
    }

    const validate= v.validate(req.body, schema);

    //Message Validate
    if(validate.length){
        return res.status(400).json({
            status: 'error',
            message: validate
        });
    }

    //Check Office ID
    const office_id = req.body.office_id;
    //Get data office
    const office = await Office.findOne({
        where: { id: office_id},
    });

    //Return Message Error
    if(!office){
        return res.status(409).json({
            status: 'error',
            message: 'Office not found'
        });
    }

    //Check user ID
    const id = req.params.id;
    //Get data user
    const user = await User.findOne({
        where: { id: id},
        attributes: ['id', 'name', 'email', 'role', 'status', 'active'],
    });
    
    //Return Message ID
    if(!user){
        return res.status(409).json({
            status: 'error',
            message: 'User not found'
        });
    }

    //Variable hash password
    const password = await bcrypt.hash(req.body.password, 10);

    //Execute query update
    await user.update({
        name: req.body.name,
        email: req.body.email,
        password: password,
        role: req.body.role,
        status: req.body.status,
        active: req.body.active,
        office_id: req.body.office_id,
    });

    return res.json({
        status:'success',
        data: user
    });

}
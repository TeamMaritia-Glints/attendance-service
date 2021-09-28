const bcrypt = require('bcrypt');//Library Hashing password
const {User} = require('../../../models');// Call Model Users
const Validator = require('fastest-validator');//Library Validator Request > Documentation coba check di google "npm fastest-validator"
const v = new Validator();

module.exports = async (req, res) =>{
    //Validate Data
    const schema = {
        name: { type: "string", empty:false},
        email: { type: "email", empty:false},
        password: { type: "string", min: 6, optional: false} ,
        confirmpassword: { type: "equal", field: "password", optional: false },
        role: { type: "string", items: "string", enum: [ "admin", "employee"], optional: true},
        status: { type: "boolean", convert: true, optional: true, empty:false}
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
    if(user){
        return res.status(409).json({
            status: 'error',
            message: 'email already exist'
        });
    }

    //Variable hash password
    const password = await bcrypt.hash(req.body.password, 10);
    
    //isAdmin
    const role = req.body.role;

    //Status
    const status = req.body.status;

    //Define data parameter for register to database
    const data= {
        name: req.body.name,
        email: req.body.email,
        password, 
        role,
        status
    };

    //Execute query register
    const createUser = await User.create(data);

    return res.json({
        status:'success',
        data: {
            id: createUser.id
        }
    });

}
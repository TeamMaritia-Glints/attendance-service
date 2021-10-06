const {User, Office} = require('../../../models');// Call Model
const Validator = require('fastest-validator');//Library Validator Request > Documentation coba check di google "npm fastest-validator"
const v = new Validator();

module.exports = async (req, res) =>{
    
    const id = req.user.data.id;
    //Validate Data
    const schema = {
        name: { type: "string", empty:false},
        address: { type: "string", empty:false},
        latitude: { type: "string", optional: false},
        longitude: { type: "string", optional: false},
    }

    const validate= v.validate(req.body, schema);

    //Message Validate
    if(validate.length){
        return res.status(400).json({
            status: 'error',
            message: validate
        });
    }
    
    //Check user ID
    const user =await User.findByPk(id,{});

    //Return Message ID
    if(!user){
        return res.status(409).json({
            status: 'error',
            message: 'User not found'
        });
    }

    //Define data parameter
    const data= {
        name: req.body.name,
        address: req.body.address,
        latitude: req.body.latitude,
        longitude: req.body.longitude,
        create_uid: id,
    };

    //Execute query create
    const office = await Office.create(data);

    return res.json({
        status:'success',
        data: office,
        message:'Data Office Created!'
    });

}
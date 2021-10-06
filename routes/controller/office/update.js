const {Office} = require('../../../models');// Call Model
const Validator = require('fastest-validator');//Library Validator Request > Documentation coba check di google "npm fastest-validator"
const v = new Validator();

module.exports = async (req, res) =>{
    
    //Validate Data
    const schema = {
        name: { type: "string", empty:false},
        address: { type: "string", empty:false},
        latitude: { type: "string", optional: false, empty:false},
        longitude: { type: "string", optional: false, empty:false},
        status: { type: "boolean", convert: true, optional: false, empty:false}
    }

    const validate= v.validate(req.body, schema);

    //Message Validate
    if(validate.length){
        return res.status(400).json({
            status: 'error',
            message: validate
        });
    }
    
    //Check office ID
    const id = req.params.id;
    const user_id=req.user.data.id;
    //Get data office
    const office = await Office.findOne({
        where: { id: id, create_uid:user_id},
    });
    
    //Return Message ID
    if(!office){
        return res.status(409).json({
            status: 'error',
            message: 'Office not found'
        });
    }

    //Execute query updaye
    await office.update({
        name: req.body.name,
        address: req.body.address,
        latitude: req.body.latitude,
        longitude: req.body.longitude,
        status:req.body.status
    });

    return res.json({
        status:'success',
        data: office,
        message: 'Data Office Updated!'
    });

}
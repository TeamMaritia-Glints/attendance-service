const {User, Office} = require('../../../models');// Call Model
const bcrypt = require('bcrypt');//Library Hashing password
const Validator = require('fastest-validator');//Library Validator Request > Documentation coba check di google "npm fastest-validator"
const v = new Validator();

module.exports = async (req, res) =>{
    
    //Validate Data
    const schema = {
        name: { type: "string", optional: true, empty:false},
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
    if(req.body.office_id){
        const officeId = req.body.office_id;
        //Get data office
        const office = await Office.findOne({
            where: { id: officeId},
        });

        //Return Message Error
        if(!office){
            return res.status(409).json({
                status: 'error',
                message: 'Office not found'
            });
        }
    }

    //Check user ID
    const id = req.params.id;
    //Get data user
    const user = await User.findOne({
        where: { id: id},
        attributes: ['id', 'name', 'role', 'status', 'active'],
    });
    
    //Return Message ID
    if(!user){
        return res.status(409).json({
            status: 'error',
            message: 'User not found'
        });
    }


    //Execute query update
    const {
        name, role, status, active, office_id
    } = req.body;
    await user.update({
        name,
        role,
        status,
        active,
        office_id,
    });

    return res.json({
        status:'success',
        data: user
    });

}
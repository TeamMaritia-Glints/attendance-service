const {User, Office} = require('../../../models');

module.exports = async (req, res) =>{

    
    //Setup Params
    const status = req.query.status;
    const active = req.query.active;
    const office_id = req.query.office_id;

    var whereStatement = {};
    if(status)
        whereStatement.status = status;
    if(active)
        whereStatement.active = active;
    if(office_id)
        whereStatement.office_id = office_id;

    //Get data user
    const user = await User.findAll({
        attributes: ['id', 'name', 'email', 'role', 'status', 'active'],
        where: whereStatement,
        include: {
            model: Office,
            attributes: ['id', 'name', 'latitude', 'longitude']
        }
    });

    //Validate data User
    if(!user){
        return res.status(404).json({ 
            status:'error', 
            message:'User not found' 
        });
    }

    return res.json({
        status: 'success',
        data: user
    })


}
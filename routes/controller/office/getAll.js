const {User, Office} = require('../../../models');

module.exports = async (req, res) =>{

    //Get all data office
    const user_id=req.user.data.id;
    const office = await Office.findAll({
        where: { create_uid:user_id},
        attributes: ['id', 'name', 'address', 'latitude', 'longitude'],
        include: [{
            model: User,
                attributes: ['id', 'name']
          }]
    });
    //Validate data Office
    if(!office){
        return res.status(404).json({ 
            status:'error', 
            message:'Office not found' 
        });
    }

    return res.json({
        status: 'success',
        data: office
    })


}
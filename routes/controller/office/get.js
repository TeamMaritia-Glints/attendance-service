const {User, Office} = require('../../../models');

module.exports = async (req, res) =>{

    const id = req.params.id;
    const user_id=req.user.data.id;
    //Get data office
    const office = await Office.findOne({
        where: { id: id, create_uid:user_id},
        attributes: ['id', 'name', 'address', 'latitude', 'longitude'],
        include: {
            model: User,
            attributes: ['id', 'name']
          }
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
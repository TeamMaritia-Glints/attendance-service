const {User, Office} = require('../../../models');

module.exports = async (req, res) =>{

    //Setup params
    const status = req.query.status;

    var whereStatement = {};
    if(status)
        whereStatement.status = status;

    //Get all data office
    const office = await Office.findAll({
        where: whereStatement,
        attributes: ['id', 'name', 'address', 'latitude', 'longitude', 'status'],
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
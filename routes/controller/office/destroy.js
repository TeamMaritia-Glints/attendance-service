const {Office} = require('../../../models');

module.exports = async (req, res) =>{

    const id = req.params.id;
    const user_id=req.user.data.id;
    //Get data office
    const office = await Office.findOne({
        where: { id: id, create_uid:user_id},
    });

    //Validate data Office
    if(!office){
        return res.status(404).json({ 
            status:'error', 
            message:'Data not found' 
        });
    }
    //Delete
    await office.destroy();
    
    return res.json({
        status: 'success',
        message: 'Office deleted'
    })


}
const {User, Office} = require('../../../models');

module.exports = async (req, res) =>{

    const id = req.params.id;
    //Get data user
    const user = await User.findOne({
        where: { id: id},
        attributes: ['id', 'name', 'email', 'role', 'status', 'active'],
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
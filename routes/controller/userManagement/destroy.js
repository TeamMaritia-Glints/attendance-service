const {User} = require('../../../models');

module.exports = async (req, res) =>{

    const id = req.params.id;
    //Get data user
    const user = await User.findOne({
        where: { id: id},
    });

    //Validate data User
    if(!user){
        return res.status(404).json({ 
            status:'error', 
            message:'Data not found' 
        });
    }
    //Delete
    await user.destroy();
    
    return res.json({
        status: 'success',
        data: 'User deleted'
    })


}
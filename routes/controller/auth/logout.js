const {User} = require ('../../../models');

module.exports = async (req, res)=>{
    // req.user = data user yg di decode dari middleware
    const id = req.user.data.id;
    const user = await User.findByPk(id);

    if(!user){
        return res.status(400).json({
            status: 'error',
            message: 'user not found'
        });
    }

    //Delete Remember Token at user database
    await user.update({
        refresh_token: null,
    });

    return res.json({
        status:'success',
        message:'refresh token deleted'
    });
}
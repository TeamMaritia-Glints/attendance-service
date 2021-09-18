const register = require('./register');
const login = require('./login');
const logout= require('./logout');
const forgotpw= require('./forgotpw');
const pwReset= require('./pwReset');
// const update = require('./update');
const updatepw= require('./updatepw');

module.exports={
    register,
    login,
    logout,
    forgotpw,
    pwReset,
    // update,
    updatepw,
}
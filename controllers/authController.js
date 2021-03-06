const passport = require('passport');
const Usuarios = require('../models/Usuarios');
const { Op } = require("sequelize");
const crypto = require('crypto');
const bcrypt = require('bcrypt-nodejs');
const enviarEmail = require('../handlers/email')

exports.autenticarUsuario = passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/iniciar-sesion',
    failureFlash: true,
    badRequestMessage: 'Ambos Campos son Obligatorios'
});

exports.usuarioAutenticado = (req, res, next) => {

    //si el usuario esta autenticado, adelante
    if(req.isAuthenticated()){
        return next();
    }   


    return res.redirect('/iniciar-sesion');
}

exports.cerrarSesion = (req, res) => {

    //cerrar sesion
    req.session.destroy(() => {
        res.redirect('/iniciar-sesion');
    });

    res.json({mensaje: 'Has Cerrado Sesion'});
}

exports.enviarToken = async (req, res) => {
    //verificar que el usuario existe
    const {email} = req.body;
    const usuario = await Usuarios.findOne({where: {email}});

    //si no existe el usuario
    if(!usuario){
        req.flash('error', 'No existe esa cuenta')
        res.redirect('/reestablecer');
    }
    //usuario existe
    usuario.token = crypto.randomBytes(20).toString('hex');
    usuario.expiracion = Date.now() + 3600000;
    

    //hashear el nuevo password
    
    //guardamos el nuevo password
    await usuario.save();
    
    //url de reset
    const resetUrl = `https://${req.headers.host}/reestablecer/${usuario.token}`;

    //Enviar el Correo con el Token
    await enviarEmail.enviar({
        usuario,
        subject: 'Password Reset',
        resetUrl
    })

    //terminar
    req.flash('Correcto', 'Se envio un mensaje a tu Correo')
    res.redirect('/iniciar-sesion');
}

exports.validarToken = async (req, res) => {
    const usuario = await Usuarios.findOne({
        where: {
            token: req.params.token
        }
    })
    if(!usuario){
        res.flash('error', 'No Valido')
        res.redirect('/reestablecer')
    }
   
}


exports.actualizarPassword = async (req, res) => {

    //verifica el token valido pero tambien la fecha de expiracion
    const usuario = await Usuarios.findOne({
        where: {
            token: req.params.token,
            expiracion: {
                [Op.gte] : Date.now()
            }
        }
    })
    
    //verificamos si el usuario existe
    if(!usuario){
        req.flash('error', 'No Valido')
        res.redirect('/reestablecer')
    }

    //hashear nuevo password
    usuario.token = null;
    usuario.expiracion = null;
    usuario.password = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10) );

    //guardamos el nuevo password
    await usuario.save();
    
    req.flash('correcto', 'Tu password se ha modificado correctamente');
    res.json(req.flash())
    res.redirect('/iniciar-sesion');
}

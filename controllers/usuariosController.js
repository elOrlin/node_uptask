const Usuarios = require('../models/Usuarios');
const confirmarEmail = require('../handlers/email');

exports.formCrearCuenta = async (req, res) => {
  
    res.json({titulo: 'Crea tu cuenta en UpTask'})
}

exports.formIniciarSesion = async (req, res, next) => {
    //const {error} = res.locals.mensajes;
    res.json({mensaje: 'Iniciaste Sesion en Uptask'});
    return next()
}

exports.crearCuenta = async (req, res) => {
    //leer los datos
    const {email, password} = req.body;

    try {
    //crear el usuario
        await Usuarios.create({
            email,
            password
        });

        const confirmarUrl = `https://${req.headers.host}/confirmar/${email}`;

        const usuario = {
            email
        }

    //Enviar el Correo con el Token
    await confirmarEmail.confirmar({
        usuario,
        subject: 'Confirma tu cuenta uptask',
        confirmarUrl
    })

        req.flash('correcto', 'Enviamos un correo, confirma tu cuenta')
        res.redirect('/iniciar-sesion')

    } catch (error) {
        req.flash('error', error.errors.map(error => error.message))
       res.json({mensajes: req.flash()})
       
    }
}

exports.formRestablecerPassword = (req, res, next) => {
    res.send('reestablece tu password')
    return next()
}

exports.confirmarCuenta = async (req, res) => {
    const usuario = await Usuarios.findOne({
        where: {
            email: req.params.correo
        }
    })

    if(!usuario){
        req.flash('error', 'No Valido')
        res.redirect('/crear-cuenta')
    }

    usuario.activo = 1;
    await usuario.save();

    req.flash('correcto', 'Cuenta activada Correctamente')
    res.redirect('/iniciar-sesion')
}
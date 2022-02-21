const nodemailer = require('nodemailer');
const juice = require('juice');
const htmlToText = require('html-to-text');
const util = require('util');
const emailConfig = require('../config/email');

let transport = nodemailer.createTransport({
    host: emailConfig.host,
    port: emailConfig.port,

    auth: {
      user: emailConfig.user, // generated ethereal user
      pass: emailConfig.pass, // generated ethereal password
    },
  });

  exports.enviar = async (opciones) => {
    let opcionesEmail = {
      from: '"UpTask👻" <orlindelossantos53@gmail.com>', // sender address
      to: opciones.usuario, // list of receivers
      subject: opciones.subject, // Subject line
      text: 'Hola', // plain text body
      html: `<b><h2>Reestablecer Password</h2>
      <p>Hola, has solicitado reestablacer tu password, has click en el siguiente boton</p>
      <a href='${opciones.resetUrl}'>Ir Reestablecer el Password</a></b>`, // html body
    };

    const enviarEmail = util.promisify(transport.sendMail, transport)
    return enviarEmail.call(transport, opcionesEmail)
  }

  exports.confirmar = async (opciones) => {
    let opcionesEmail = {
      from: '"UpTask👻" <orlindelossantos53@gmail.com>', // sender address
      to: opciones.usuario, // list of receivers
      subject: opciones.subject, // Subject line
      text: 'Hola', // plain text body
      html: `<b><h2>Confirma tu cuenta Uptask</h2>
      <p>Ya estas casi inscrito, solo preciona el siguiente boton
      <a href='${opciones.confirmarUrl}'>Confirmar Cuenta</a></b>`, // html body
    };

    const confirmarEmail = util.promisify(transport.sendMail, transport)
    return confirmarEmail.call(transport, opcionesEmail)
  }
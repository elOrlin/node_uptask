const Sequelize = require('sequelize');
const db = require('../config/db');
const Proyectos = require('../models/Proyectos');
const bcrypt = require('bcrypt-nodejs');

const Usuarios = db.define('usuarios', {
    id:{
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      
      email:{
        type: Sequelize.STRING(60),
        allowNull: false,
        validate: {
          isEmail: {
            msg: 'Agrega un Correo Valido'
          },
          notEmpty: {
            msg: 'El E-mail No Puede Ir Vacio'
          }
        },
        unique: {
          args: true,
          msg: 'Usuario Ya Registrado'
        }
      },

      password:{
        type: Sequelize.STRING(60),
        allowNull: false,
        validate: {
          notEmpty: {
            msg: 'El Password No Puede Ir Vacio'
          }
        }
      },
      activo: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      token: Sequelize.STRING,
      expiracion: Sequelize.DATE
}, {
 hooks: {
   beforeCreate(usuario) {
    usuario.password = bcrypt.hashSync(usuario.password, bcrypt.genSaltSync(10))
   }
 }
});

//metodos personalizados
Usuarios.prototype.verificarPassword = function(password) {
  return bcrypt.compareSync(password, this.password)
}

Usuarios.hasMany(Proyectos)

module.exports = Usuarios;
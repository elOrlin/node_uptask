const Proyectos = require('../models/Proyectos')
const Tareas = require('../models/Tareas')

exports.proyectosHome = async (req, res) => {

    const usuarioId = res.locals.usuario.id;

    const proyectos = await Proyectos.findAll({where: {usuarioId}});

    //pasar los proyectos hacia la vista
    res.status(200).json(proyectos)

}

exports.formularioProyecto = async (req, res) => {

    const usuarioId =  res.locals.usuario.id;

    const proyectos = await Proyectos.findAll({where: {usuarioId}});

    res.send(proyectos)
    res.status(200).json({mensaje: proyectos})
}

exports.nuevoProyecto = async (req, res) => {

    const usuarioId = res.locals.usuario.id;

    await Proyectos.findAll({where: {usuarioId}});

    //validar que tengamos algo en el input
    const {nombre} = req.body;

    let errores = [];

    if(!nombre){
        errores.push({'texto': 'Agrega un Nombre al Proyecto'});
    }

    //si hay errores
    if(errores.length > 0){
        res.json({mensaje: 'no se pudeo crear el proyecto'})
    }else {
        //no hay errores

        //insertar en la BD
        const usuarioId = await res.locals.usuario.id;
        await Proyectos.create({nombre, usuarioId})
        res.redirect('/');
    }
}


exports.proyectoPorUrl = async (req, res, next) => {

    const usuarioId = res.locals.usuario.id;

    const proyectosPromise = Proyectos.findAll({where: {usuarioId}});

    const proyectoPromise = Proyectos.findOne({
        where: {
            url: req.params.url,
            usuarioId
        }
    })

    const [proyectos, proyecto] = await Promise.all([proyectosPromise, proyectoPromise]);

    //consultar tareas del proyecto actual
    const tareas = await Tareas.findAll({
        where: {
            proyectoId: proyecto.id
        }
    })

    if(!proyecto) return next();

}

exports.formularioEditar = async (req, res) => {

    const usuarioId = res.locals.usuario.id;
    const proyectosPromise = Proyectos.findAll({where: {usuarioId}});

    const proyectoPromise = Proyectos.findOne({
        where: {
            id: req.params.id,
            usuarioId
        }});


    const [proyectos, proyecto] = await Promise.all([proyectosPromise, proyectoPromise]);

}


exports.actualizarProyecto = async (req, res) => {

    const usuarioId = res.locals.usuario.id;

    const proyectos = await Proyectos.findAll({where: {usuarioId}});
    
    const {nombre} = req.body;

    let errores = [];

    if(!nombre && errores.length > 0) {
        errores.push({'texto': 'Agrega un Nombre al Proyecto'})

    }else {
        await Proyectos.update(
            {nombre: nombre},
            {where: {id: req.params.id}
        })

        res.redirect('/')
    }
}

exports.eliminarProyecto = async (req, res) => {
    
    const {urlProyecto} = req.params;

    const resultado = await Proyectos.destroy({where: {url: urlProyecto}})

    if(!resultado){
        return next();
    }

    res.status(200).send('Proyecto Eliminado Correctamente');
}
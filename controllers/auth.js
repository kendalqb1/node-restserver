const { response, request } = require("express");
const bcryptjs = require('bcryptjs');
const Usuario = require('../models/usuario');
const { validate } = require("../models/usuario");
const { generarJWT } = require("../helpers/generar-jwt");
const { googleVerify } = require("../helpers/google-verify");

const login = async (req, res = response) => {

    const { correo, password } = req.body;

    try {
        //Verficiar si el email eciste
        const usuario = await Usuario.findOne({ correo });
        if (!usuario) {
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos - correo'
            });
        }

        //Usuario Activo?

        if (!usuario.estado) {
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos - estado: false'
            });
        }

        //Verficar contarseña
        const validPass = bcryptjs.compareSync(password, usuario.password);
        if (!validPass) {
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos - password'
            });
        }

        // Generar JWT
        const token = await generarJWT(usuario.id);


        res.json({
            usuario,
            token
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: 'Hable con el admin'
        });
    }

}

const googleSignIn = async (req = request, res = response, next) => {

    const { id_token } = req.body;

    try {
        const {correo, nombre, img} = await googleVerify(id_token);

        let usuario = await Usuario.findOne({correo});

        if ( !usuario ) {
            //Creacion
            const data = {
                nombre,
                correo,
                password: ':P',
                img,
                google: true
            };

            usuario = new Usuario(data);
            await usuario.save();
        }

        // Si el usuario en db
        if (!usuario.estado) {
            return res.status(401).json({
                msg: 'Hable cion el admin usuario bloqueado'
            })
        }

        // Generar JWT
        const token = await generarJWT(usuario.id);







        res.json({
            usuario,
            token
        });

    } catch (error) {
        res.status(400).json({
            msg: 'Token de google no valido'
        });
    }





}


module.exports = {
    login,
    googleSignIn
}
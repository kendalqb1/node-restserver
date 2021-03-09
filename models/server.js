const express = require('express');
const cors = require('cors');
const { dbConnection } = require('../database/config');


class Server {

    constructor() {
        this.app = express();
        this.port = process.env.PORT;
        this.usuariosPath = '/api/usuarios';

        //Conectar a base de datos
        this.conectarDB();
        
        //Middlewares
        this.midlewares();
        
        //Rutas de aplicaion
        this.routes();

    }

    
    async conectarDB() {
        await dbConnection();
    }


    midlewares() {

        //cors
        this.app.use( cors() );

        // Parseo y lectura del body
        this.app.use( express.json() );
        
        //Directorio Publico
        this.app.use(express.static('public'))

    }


    routes() {
        
        this.app.use(this.usuariosPath, require('../routes/usuarios'))

    }

    listen() {
        this.app.listen( this.port, () => {
            console.log('Server on http://localhost:',this.port);
        })
    }


}


module.exports = Server;
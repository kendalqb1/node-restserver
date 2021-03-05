const express = require('express');
const cors = require('cors');


class Server {

    constructor() {
        this.app = express();
        this.port = process.env.PORT;
        this.usuariosPath = '/api/usuarios';
        
        //Middlewares
        this.midlewares();
        
        //Rutas de aplicaion
        this.routes();

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
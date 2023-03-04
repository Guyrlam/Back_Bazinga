import express from 'express'
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { corsOptions, port, urlMongo } from './config';
import route from './router';
import mongoose from 'mongoose';

export default class App {
    app: express.Application;
    constructor() {
        this.app = express();
        this.database();
        this.middlewares();
        this.routes();
        
        
        this.app.listen(port, () =>
        console.log(`Servidor rodando em: http://localhost:${port}`)
        );
    }

    database() {
        mongoose.connect(`mongodb://${urlMongo}/bazinga`)
        mongoose.connection.on('connected', function () {
            console.log('=====Conexão estabelecida com sucesso=====');
           });
           mongoose.connection.on('error', function (err) {
            console.log('=====Ocorreu um erro: ' + err);
           });
           mongoose.connection.on('disconnected', function () {
            console.log('=====Conexão finalizada=====');
           });
    }
    
    middlewares() {
        this.app.use(cookieParser());
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: true }));
        this.app.use(cors(corsOptions));
    }
    
    routes() {
        this.app.use(route.users);
    }
}
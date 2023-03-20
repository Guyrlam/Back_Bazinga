import express, { NextFunction, Request, Response } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { corsOptions, port, urlMongo, urlRedis } from './config';
import route from './router';
import mongoose from 'mongoose';
import { RedisClientType, createClient } from 'redis';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { CustomRequest } from './interface/IRequest';
import swaggerUi from 'swagger-ui-express'
import wsConnection from './websockets/index';
const swaggerFile = require('../swagger.json');

export default class App {
    app: express.Application;
    server: any;
    io: any;
    constructor() {
        this.app = express();
        /* this.app.use(express.static(path.join(__dirname, "..", "public"))); */
        this.server = createServer(this.app);
        this.io = new Server(this.server);
        this.database();
        this.webSocket();
        this.middlewares();
        this.routes();

        this.server.listen(port, () =>
            console.log(`Servidor rodando em: http://localhost:${port}`)
        );
    }

    database() {
        let redisClient: RedisClientType = createClient({
            url: urlRedis,
        });
        redisClient.connect();
        redisClient.on('error', function (err: any) {
            console.log('Could not establish a connection with redis. ' + err);
        });
        redisClient.on('connect', function (err: any) {
            console.log('=====Conexão REDIS estabelecida com sucesso=====');
        });
        if (/@/gm.test(urlMongo)) {
            mongoose.connect(`mongodb+srv://${urlMongo}/bazinga`);
        } else {
            mongoose.connect(`mongodb://${urlMongo}/bazinga`);
        }
        mongoose.connection.on('connected', function () {
            console.log('=====Conexão MONGODB estabelecida com sucesso=====');
        });
        mongoose.connection.on('error', function (err: any) {
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
        this.app.use((req, res, next) => {
            res.header('Access-Control-Allow-Origin', '*');
            res.header('Access-Control-Allow-Headers', '*');
            res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH');
            this.app.use(cors());
            next();
        });
        this.app.use((req: Request, res: Response, next: NextFunction) => {
            (req as CustomRequest).io = this.io;
            return next();
        });
        this.app.use('/doc', swaggerUi.serve, swaggerUi.setup(swaggerFile))
    }
    close() {
        mongoose.disconnect();
    }
    webSocket() {
        this.io.on('connection', (socket: any) => {
            wsConnection(socket, this.io);
        });
    }

    routes() {
        this.app.use(route.users);
        this.app.use(route.posts);
        this.app.use(route.groups);
        this.app.use(route.uploads);
    }
}

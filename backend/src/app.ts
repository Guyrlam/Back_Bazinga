import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { corsOptions, port, urlMongo, urlRedis } from "./config";
import route from "./router";
import mongoose from "mongoose";
import { RedisClientType, createClient } from "redis";
import { createServer } from "http";
import Socketio, { Server } from "socket.io";
import { CustomRequest } from "./interface/IRequest";


export default class App {
    app: express.Application;
    server: any;
    io: any;
    constructor() {
        this.app = express();
        this.server = createServer(this.app);
        this.io = new Server(this.server)
        this.database();
        this.webSocket();
        this.middlewares();
        this.routes();
        

        this.server.listen(4000, () =>
            console.log(`Servidor rodando em: http://localhost:${port}`)
        );
    }

    database() {
        let redisClient: RedisClientType = createClient({
            url: urlRedis,
        });
        redisClient.connect();
        redisClient.on("error", function (err: any) {
            console.log("Could not establish a connection with redis. " + err);
        });
        redisClient.on("connect", function (err: any) {
            console.log("=====Conexão REDIS estabelecida com sucesso=====");
        });
        if (/localhost/gm.test(urlMongo)) {
            mongoose.connect(`mongodb://${urlMongo}/bazinga`);
        } else {
            mongoose.connect(`mongodb+srv://${urlMongo}/bazinga`);
        }
        mongoose.connection.on("connected", function () {
            console.log("=====Conexão MONGODB estabelecida com sucesso=====");
        });
        mongoose.connection.on("error", function (err: any) {
            console.log("=====Ocorreu um erro: " + err);
        });
        mongoose.connection.on("disconnected", function () {
            console.log("=====Conexão finalizada=====");
        });
    }

    middlewares() {
        this.app.use(cookieParser());
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: true }));
        this.app.use(cors(corsOptions));
        this.app.use((req: Request, res: Response, next: NextFunction) => {
            (req as CustomRequest).io = this.io;
            return next();
        });
    }
    webSocket() {
        this.io.on('connection', (socket: any) => {
            socket.on('post', (msg:any) => {
                this.io.emit('post', msg);
            });
            socket.on('disconnect', () => {
                this.io.emit('chat message', "TCHAU");
                console.log('user disconnected');
            });
            console.log(socket.handshake.headers.auth);
        });
    }

    routes() {
        this.app.use(route.users);
        this.app.use(route.posts);
        this.app.use(route.groups);

    }
}

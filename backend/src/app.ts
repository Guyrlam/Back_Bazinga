import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { corsOptions, port, urlMongo, urlRedis } from "./config";
import route from "./router";
import mongoose from "mongoose";
import { RedisClientType, createClient } from "redis";
// Initialize client.
let redisClient: RedisClientType = createClient({
    url: urlRedis,
});
redisClient.connect();

export default class App {
    app: express.Application;
    constructor() {
        this.app = express();
        this.database();
        this.middlewares();
        this.routes(); 

        this.app.listen(4000, () =>
            console.log(`Servidor rodando em: http://localhost:${port}`)
        );
    }

    database() {
        redisClient.on("error", function (err: any) {
            console.log("Could not establish a connection with redis. " + err);
        });
        redisClient.on("connect", function (err: any) {
            console.log("=====Conexão REDIS estabelecida com sucesso=====");
        });
        mongoose.connect(`mongodb+srv://${urlMongo}/bazinga`);
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
    }

    routes() {
        this.app.use(route.users);
        this.app.use(route.posts);
    }
}

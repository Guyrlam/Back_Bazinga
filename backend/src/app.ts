import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { corsOptions, port, urlMongo, urlRedis } from "./config";
import route from "./router";
import session from "express-session";
import mongoose from "mongoose";
import RedisStore from "connect-redis";
import { RedisClientType, createClient } from "redis";

// Initialize client.
let redisClient: RedisClientType = createClient({
    url: urlRedis,
});
redisClient.connect();

// Initialize store.
let redisStore = new (RedisStore as any)({
    client: redisClient
});

export default class App {
    app: express.Application;
    constructor() {
        this.app = express();
        this.database();
        this.middlewares();
        this.session();
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
        mongoose.connect(`mongodb://${urlMongo}/bazinga`);
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

    session() {
        this.app.use(
            session({
                store: redisStore,
                resave: false,
                saveUninitialized: false,
                cookie: { secure: false, maxAge: 20000 },
                secret: "$2a$12$E2hNcmrZaME97zOAUBFPye.9wEJiAVHJ0BhazUjJd9xDQkto6b8w6",
            })
        );
    }

    routes() {
        this.app.use(route.users);
    }
}

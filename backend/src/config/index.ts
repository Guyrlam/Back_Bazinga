import dotenv from 'dotenv';
import { CorsOptions } from 'cors';
import { env } from 'process';

dotenv.config();

const port = env.PORT || 4000;
const salt = env.SALT_HASH || 4000;
const urlMongo = env.URL_MONGO || "localhost:27017";

const corsOptions: CorsOptions = {
    origin: ['http://127.0.0.1:5500'],
    credentials: true,
};

export { corsOptions, port, urlMongo, salt };
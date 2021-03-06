import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import {Request, Response} from "express";
import express from "express";
import {Socket} from "net";
import {ClientManager} from "./Entities/Client/ClientManager";
import {EventManager} from "./Entities/Event/EventManager";
import {Handler} from "./Handler";
import {LogServiceProvider} from "./Providers/LogServiceProvider";
import {RedisProvider} from "./Providers/RedisProvider";

// Loads application env variables
dotenv.config();

// Express app init
const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

const env = process.env;

// Boot log provider
const logger = new LogServiceProvider().setUp();

// Main handler that handles HTTP connections
const handler = new Handler(new ClientManager(), new EventManager());

app.get("/events/listen/", (request: Request, response: Response) => {
    handler.eventHandler(request, response);
});

// Boot redis provider
const redisProvider = new RedisProvider(handler).setUp();

// Listen for incoming connections
const server = app.listen(env.SERVER_PORT, () =>
    // tslint:disable-next-line:no-console
    console.log(`Events service listening on port ${env.SERVER_PORT} NODE_ENV:${env.NODE_ENV}`)
);
server.on("connection", (socket: Socket) => {
    socket.setTimeout(Number(env.SERVER_CONNECTION_TIMEOUT_IN_MILLISECONDS));
});

// Client for read/write
const Redis = redisProvider.getWriteReadClient();

export {
    logger,
    Redis,
    env
};

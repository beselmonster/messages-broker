import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import {Request, Response} from "express";
import express from "express";
import {ClientManager} from "./entities/Client/ClientManager";
import {EventManager} from "./entities/Event/EventManager";
import {Handler} from "./Handler";
import {LogServiceProvider} from "./providers/LogServiceProvider";
import {RedisProvider} from "./providers/RedisProvider";

// Loads application env variables
dotenv.config();

// Express app init
const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

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
app.listen(process.env.SERVER_PORT, () =>
    // tslint:disable-next-line:no-console
    console.log(`Events service listening on port ${process.env.SERVER_PORT}`)
);

// Client for read/write
const Redis = redisProvider.getWriteReadClient();

export {
    logger,
    Redis
};

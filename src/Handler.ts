import {Request, Response} from "express";
import {Client} from "./entities/Client/Client";
import {ClientManager} from "./entities/Client/ClientManager";
import {EventManager} from "./entities/Event/EventManager";
import {Redis} from "./index";
import {logger} from "./index";

export class Handler {

    /**
     * Headers used to send events to client
     */
    public static readonly HEADERS = {
        "Content-Type": "text/event-stream",
        "Connection": "keep-alive",
        "Cache-Control": "no-cache"
    };

    public static readonly UNAUTHORIZED_MESSAGE = "You are unauthorized";

    /**
     * Client manager
     * Use to add, remove clients
     */
    protected clientManager: ClientManager;

    /**
     * Event manager
     * Use to publish events
     */
    protected eventManager: EventManager;

    /**
     * Handler Constructor
     * @param clientManager
     * @param eventManager
     */
    constructor(clientManager: ClientManager, eventManager: EventManager) {
        this.clientManager = clientManager;
        this.eventManager = eventManager;
    }
    /**
     * Handles SSE connections
     *
     * @param request Request
     * @param response Response
     */
    public eventHandler(request: Request, response: Response) {
        const token = request.query.token;

        if (token === undefined) {
            return response.status(403).end();
        }

        // Create clientId so we can use it to find their response reference and disconnect
        const clientId = new Date().getTime();

        Redis.get(process.env.REDIS_USER_ID_PREFIX + token , (err, reply) => {
            if (err !== null) {
                logger.error(`Failed to receive token ${token}`);

                return response.status(500).end();
            }

            if (reply === null) {
                return response.status(403).end();
            }

            const receiverId: number = Number(reply.split(process.env.REDIS_USER_TOKEN_PREFIX)[1]);

            response.writeHead(200, Handler.HEADERS);
            response.write("data: Connection success\n\n");

            this.getClientManager().add(new Client(clientId, receiverId, response));
        });

        Redis.on("error", (err) => {
            logger.error("Redis error:", err);
        });

        request.on("close", () => {
            logger.info(`ClientId: ${clientId} Connection closed`);

            this.getClientManager().remove(clientId);
        });
    }

    /**
     *  Returns client manager instance
     */
    public getClientManager(): ClientManager {
        return this.clientManager;
    }

    /**
     * Returns event manager instance
     */
    public getEventManager(): EventManager {
        return this.eventManager;
    }

}

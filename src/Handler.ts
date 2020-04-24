import {Request, Response} from "express";
import {Client} from "./entities/Client/Client";
import {ClientManager} from "./entities/Client/ClientManager";
import {EventManager} from "./entities/Event/EventManager";
import {env, Redis} from "./index";
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

        // Create clientId so we can use it to find their response reference and disconnect
        const clientId = new Date().getTime();

        const client = new Client(clientId, null, response);
        this.getClientManager().add(client);

        response.writeHead(200, Handler.HEADERS);
        response.write("data: Connection success\n\n");

        if (token !== undefined) {
            Redis.get(env.REDIS_USER_ID_PREFIX + token , (err, reply) => {
                if (err !== null) {
                    logger.error(`Failed to receive token ${token}`, {
                        error: err,
                        client: client,
                        redisResponse: reply
                    });

                    response.write("Internal server error");

                    return response.status(500).end();
                }
                if (reply === null) {
                   response.write("Token is wrong. You will receive public events\n\n");
                } else {
                    const receiverId: number = Number(reply.split(env.REDIS_USER_TOKEN_PREFIX)[1]);

                    this.clientManager.authorize(client, receiverId);
                }
            });
        }

        request.on("close", () => {
            logger.debug(`ClientId: ${clientId} Connection closed`);

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

import redis, {RedisClient} from "redis";
import {Handler} from "../Handler";
import {env, logger, Redis} from "../index";

export class RedisProvider {

    /**
     * Return pub/sub client instance. Use it to publish/subscribe data to redis
     */
    private pubSubClient: RedisClient;

    /**
     * Read/Write client instance. Use it to set/read data with redis
     */
    private writeReadClient: RedisClient;

    /**
     * Connection string for redis
     */
    private connectionString: string;

    private handler: Handler;

    constructor(handler: Handler) {
        this.handler = handler;

        this.setConnectionString();
    }

    public setUp() {
        this.bootPubSubClient();
        this.bootWriteReadClient();

        return this;
    }

    public getWriteReadClient(): RedisClient {
        return this.writeReadClient;
    }

    private bootPubSubClient() {
        this.pubSubClient = this.createRedisClient();

        this.pubSubClient.on("error", (err) => {
            logger.error("Redis error:", err);
        });

        this.pubSubClient.on("message", (channel, message) => {
                logger.debug(
                    `Received data from Redis channel ${env.REDIS_CHANNEL_NAME_TO_LISTEN}: ${message}`
                );

                try {
                const data = JSON.parse(message)?.data;

                if (data !== undefined) {
                    if (
                        data.hasOwnProperty("payload") &&
                        data.hasOwnProperty("root_event_type") &&
                        data.hasOwnProperty("receiver_id") &&
                        data.hasOwnProperty("send_to_all")
                    ) {
                        this.handler.getEventManager().publish(
                            data.payload,
                            data.root_event_type,
                            data.receiver_id,
                            data.send_to_all,
                            this.handler.getClientManager()
                        );
                    }
                }
            } catch (e) {
                logger.error("Error when publish redis event", e, `Event json: ${message}`);
            }
        });

        this.pubSubClient.subscribe(env.REDIS_CHANNEL_NAME_TO_LISTEN);
    }

    private bootWriteReadClient() {
        this.writeReadClient = this.createRedisClient();

        this.writeReadClient.on("error", (err) => {
            logger.error("Redis error:", err);
        });
    }

    private createRedisClient(): RedisClient {
        const options: any = {};

        if (env.REDIS_TLS === "true") {
            options.tls = {
                servername: new URL(this.connectionString).hostname
            };
        }

        return redis.createClient(this.connectionString, options);
    }

    /**
     * Set connection redis string
     */
    private setConnectionString(): void {
        this.connectionString = "redis://";

        if (env.REDIS_DATABASE !== "") {
            this.connectionString += env.REDIS_DATABASE;
        }

        if (env.REDIS_PASSWORD !== "") {
            this.connectionString += `:${env.REDIS_PASSWORD}@`;
        }

        this.connectionString += env.REDIS_HOST;
        this.connectionString += `:${env.REDIS_PORT}`;
    }

}

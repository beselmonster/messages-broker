import redis, {RedisClient} from "redis";
import {Handler} from "../Handler";
import {logger} from "../index";

export class RedisProvider {

    /**
     * Return pub/sub client instance. Use it to publish/subscribe data to redis
     */
    private pubSubClient:RedisClient;

    /**
     * Read/Write client instance. Use it to set/read data with redis
     */
    private writeReadClient:RedisClient;

    private handler: Handler;

    constructor(handler:Handler) {
        this.handler = handler;
    }

    public setUp()
    {
        this.bootPubSubClient();
        this.bootWriteReadClient();

        return this;
    }

    private bootPubSubClient()
    {
        this.pubSubClient = redis.createClient({
            host: process.env.REDIS_HOST,
            port: Number(process.env.REDIS_PORT),
            password: process.env.REDIS_PASSWORD
        });

        this.pubSubClient.on("error", (err) => {
            logger.error("Redis error:", err);
        });

        this.pubSubClient.on("message", (channel, message) => {
            logger.info(
                `Received data from Redis channel ${process.env.REDIS_CHANNEL_NAME_TO_LISTEN}: ${message}`
            );
            try {
                const data = JSON.parse(message)?.data;

                this.handler.getEventManager().publish(
                    data?.event_id,
                    data?.attributes,
                    data?.event_type,
                    data?.receiver_id,
                    this.handler.getClientManager()
                );
            } catch (e) {
                logger.error("Error when subscribe to redis", e);
            }
        });

        this.pubSubClient.subscribe(process.env.REDIS_CHANNEL_NAME_TO_LISTEN);
    }

    private bootWriteReadClient()
    {
        this.writeReadClient = redis.createClient({
            host: process.env.REDIS_HOST,
            port: Number(process.env.REDIS_PORT),
            password: process.env.REDIS_PASSWORD
        });
    }

    public getWriteReadClient() : RedisClient
    {
        return this.writeReadClient;
    }

    public getPubSubClient() : RedisClient
    {
        return this.pubSubClient;
    }

}

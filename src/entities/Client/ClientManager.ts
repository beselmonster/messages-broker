import {env, logger} from "../../index";
import {Event} from "../Event/Event";
import {Client} from "./Client";

export class ClientManager {

    /**
     * Array of clients
     * By default empty array
     */
    protected clients: Client[] = [];

    /**
     * Get all clients
     *
     * @return Client[]
     */
    public getClients(): Client[] {
        return this.clients;
    }

    /**
     * Adds new client
     *
     * @param client
     * @return Client
     */
    public add(client: Client): Client {
        this.clients.push(client);

        return client;
    }

    /**
     * Deletes client
     * @param clientId
     */
    public remove(clientId: number) {
        this.clients = this.clients.filter((c) => c.getId() !== clientId);
    }

    /**
     * Authorize client by receiverId
     *
     * @param client
     * @param receiverId
     */
    public authorize(client: Client, receiverId: number) {
        client.setReceiverId(receiverId);
    }

    /**
     * Send event to all clients
     *
     * @param newEvent Event
     * @param receiverId number
     */
    public sendEventByReceiverId(newEvent: Event, receiverId: number) {
        const numberOfClients = this.clients.length;

        for (let i = 0; i < numberOfClients; i++) {
            if (this.clients[i].getReceiverId() === receiverId) {
                logger.debug("Sending event to receiver with id:" + receiverId, {
                    data: newEvent.getData(),
                    type: newEvent.getType()
                });
                this.sendEvent(newEvent, this.clients[i]);
            }
        }
    }

    /**
     * Send event to all clients
     *
     * @param newEvent
     */
    public sendEventToAll(newEvent: Event) {
        const numberOfClients = this.clients.length;

        for (let i = 0; i < numberOfClients; i++) {
            this.sendEvent(newEvent, this.clients[i]);
        }
    }

    /**
     * Send event to specific client
     * @param newEvent
     * @param client
     */
    public sendEvent(newEvent: Event, client: Client) {
        client.getResponseReference().write(
            "event: " + newEvent.getType() + "\n" +
            "data:" + JSON.stringify(newEvent.getData()) + "\n\n"
        );
    }

}

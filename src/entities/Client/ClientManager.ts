import {Event} from "../Event/Event";
import {Client} from "./Client";

export class ClientManager {

    protected clients: Client[] = [];

    public getClients(): Client[] {
        return this.clients;
    }

    public add(client: Client): Client {
        this.clients.push(client);

        return client;
    }

    public remove(clientId: number) {
        this.clients = this.clients.filter((c) => c.getId() !== clientId);
    }

    /**
     * Send event to all clients
     * @param newEvent Event
     * @param receiverId number
     */
    public sendEventByReceiverId(newEvent: Event, receiverId: number) {
        const numberOfClients = this.clients.length;

        for (let i = 0; i < numberOfClients; i++) {
            if (this.clients[i].getReceiverId() === receiverId) {
                this.clients[i].getResponseReference().write(
                    "event: " + newEvent.getType() + "\n" +
                    "data:" + JSON.stringify(newEvent.getData()) + "\n\n"
                );
            }
        }
    }

}

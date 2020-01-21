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
        this.clients = this.clients.filter((c) => c.id !== clientId);
    }

    /**
     * Send event to all clients
     * @param newEvent Event
     * @param receiverId number
     */
    public sendEventByReceiverId(newEvent: Event, receiverId: number) {
        const clients = this.clients.filter((client) => client.receiverId === receiverId);

        const numberOfClients = clients.length;

        for (let i = 0; i < numberOfClients; i++) {
            clients[i].responseReference.write(
                "id: " + String(newEvent.id) + "\n" +
                "event: " + newEvent.type + "\n" +
                "data:" + JSON.stringify(newEvent.data) + "\n\n"
            );
        }
    }

}

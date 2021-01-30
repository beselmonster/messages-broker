import {ClientManager} from "../Client/ClientManager";
import {Event} from "./Event";

export class EventManager {

    /**
     * Receive Event and send it to Clients
     *
     * @param data {}
     * @param eventType string
     * @param receiverId number
     * @param sendToAll
     * @param clientManager ClientManager
     */
    public async publish(
        data: {},
        eventType: string,
        receiverId: number|null,
        sendToAll: boolean,
        clientManager: ClientManager
    ) {
        const event = new Event(data, eventType);

        if (receiverId && !sendToAll) {
            clientManager.sendEventByReceiverId(event, receiverId);
        } else {
            clientManager.sendEventToAll(event);
        }
    }

}

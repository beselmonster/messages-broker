import {ClientManager} from "../Client/ClientManager";
import {Event} from "./Event";

export class EventManager {

    /**
     * Receive Event and send it to Clients
     *
     * @param eventId int
     * @param data {}
     * @param eventType string
     * @param receiverId number
     * @param clientManager ClientManager
     */
    public async publish(
        eventId: number,
        data: {},
        eventType: string,
        receiverId: number,
        clientManager: ClientManager
    ) {
        const event = new Event(eventId, data, eventType);

        clientManager.sendEventByReceiverId(event, receiverId);
    }

}

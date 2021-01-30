import {Response} from "express";

/**
 * Client entity class
 * Contains client data used to manage and send events to the client
 */
export class Client {

    /**
     * Unique client identifier
     */
    protected id: number;

    /**
     * Client receiver id. Used to determine who should receive event
     * If client`s receiver id is null then this is unauthorized client
     * He can only receive public events
     */
    protected receiverId: number|null;

    /**
     * Client response reference. Used to write client response
     */
    protected responseReference: Response;

    /**
     * Client constructor
     * Set client attributes
     *
     * @param id
     * @param receiverId
     * @param responseReference
     */
    constructor(
        id: number,
        receiverId: number,
        responseReference: Response | undefined
    ) {
        this.id = id;
        this.receiverId = receiverId;
        this.responseReference = responseReference;
    }

    /**
     * @return number
     */
    public getId(): number {
        return this.id;
    }

    /**
     * @return number
     */
    public getReceiverId(): number {
        return this.receiverId;
    }

    /**
     * @param receiverId
     * @return Client
     */
    public setReceiverId(receiverId: number|null): Client {
        this.receiverId = receiverId;

        return this;
    }

    /**
     * Returns client response reference
     * It can be used to send data to the client
     *
     * @return Response
     */
    public getResponseReference(): Response {
        return this.responseReference;
    }

}

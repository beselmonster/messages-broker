import {Response} from "express";

export class Client {

    /**
     * Unique client identifier
     */
    protected id: number;

    /**
     * Client receiver id. Used to determine who should receive event
     */
    protected receiverId: number;

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

    public getId(): number {
        return this.id;
    }

    public getReceiverId(): number {
        return this.receiverId;
    }

    public getResponseReference(): Response {
        return this.responseReference;
    }

}

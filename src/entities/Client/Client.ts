import {Response} from "express";

export class Client {

    constructor(public id: number, public receiverId: number, public responseReference: Response | undefined) {}

}

export class Event {

    /**
     * Event data
     */
    protected data: {};

    /**
     * Event type
     */
    protected type: string;

    /**
     * Event constructor
     * Set Event attributes
     *
     * @param data
     * @param type
     */
    constructor(data: {}, type: string) {
        this.data = data;
        this.type = type;
    }

    public getData(): {} {
        return this.data;
    }

    public getType(): string {
        return this.type;
    }

}

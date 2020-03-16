import winston from "winston";

export class LogServiceProvider {

    protected logger: winston.Logger;

    /**
     * Set up logger
     */
    public setUp(): winston.Logger {
        this.logger = winston.createLogger({
            transports: [
                new winston.transports.File({
                    filename: `${process.env.APP_LOG_PATH}app.log`,
                    level: "info"
                }),
                new winston.transports.File({
                    filename: `${process.env.APP_LOG_PATH}err.log`,
                    level: "error"
                }),
            ],
            format: winston.format.combine(
                winston.format.timestamp({format: "YYYY-MM-DD hh:mm:ss A ZZ"}),
                winston.format.json()
            )
        });

        if (process.env.NODE_ENV !== "production") {
            this.logger.add(new winston.transports.Console({
                format: winston.format.simple(),
            }));
        }

        return this.logger;
    }

}

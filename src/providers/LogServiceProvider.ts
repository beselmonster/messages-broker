import winston from "winston";
import {env} from "../index";

export class LogServiceProvider {

    protected logger: winston.Logger;

    /**
     * Set up logger
     */
    public setUp(): winston.Logger {
        this.logger = winston.createLogger({
            transports: [
                new winston.transports.File({
                    filename: `${env.APP_LOG_PATH}app.log`,
                    level: "info"
                }),
                new winston.transports.File({
                    filename: `${env.APP_LOG_PATH}err.log`,
                    level: "error"
                }),
            ],
            format: winston.format.combine(
                winston.format.timestamp({format: "YYYY-MM-DD hh:mm:ss A ZZ"}),
                winston.format.json()
            )
        });

        if (env.NODE_ENV !== "production") {
            this.logger.add(new winston.transports.Console({
                format: winston.format.simple(),
                level: "debug"
            }));
        }

        return this.logger;
    }

}

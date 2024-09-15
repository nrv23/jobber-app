import dotenv from 'dotenv';

// cargar configuracion de dotenv

dotenv.config({}); // config por defecto sería .env

class Config {


    private NODE_ENV: string | undefined;
    private CLIENT_URL: string | undefined;
    private SENDER_EMAIL: string | undefined;
    private SENDER_EMAIL_PASSWORD: string | undefined;
    private RABBITMQ_ENDPOINT: string | undefined;
    private ELASTIC_SEARCH_URL: string | undefined;
    private SERVER_PORT: number | undefined;

    constructor() {
        this.NODE_ENV = process.env.NODE_ENV;
        this.CLIENT_URL = process.env.CLIENT_URL;
        this.SENDER_EMAIL = process.env.SENDER_EMAIL;
        this.SENDER_EMAIL_PASSWORD = process.env.SENDER_EMAIL_PASSWORD;
        this.RABBITMQ_ENDPOINT = process.env.RABBITMQ_ENDPOINT;
        this.ELASTIC_SEARCH_URL = process.env.ELASTIC_SEARCH_URL;
        this.SERVER_PORT = +process.env.SERVER_PORT!;
    }


    get configProperties() {

        return {
            NODE_ENV: this.NODE_ENV,
            CLIENT_URL: this.CLIENT_URL,
            SENDER_EMAIL: this.SENDER_EMAIL,
            SENDER_EMAIL_PASSWORD: this.SENDER_EMAIL_PASSWORD,
            RABBITMQ_ENDPOINT: this.RABBITMQ_ENDPOINT,
            ELASTIC_SEARCH_URL: this.ELASTIC_SEARCH_URL,
            SERVER_PORT: this.SERVER_PORT,
        };
    }
}

export const config: Config = new Config();

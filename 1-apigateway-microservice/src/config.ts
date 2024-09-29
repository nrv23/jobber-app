import dotenv from 'dotenv';

// cargar configuracion de dotenv

dotenv.config({}); // config por defecto sería .env

class Config {


    private NODE_ENV: string | undefined;
    private CLIENT_URL: string | undefined;
    private ELASTIC_SEARCH_URL: string | undefined;
    private SERVER_PORT: number | undefined;
    private SECRET_KEY_ONE: string | undefined;
    private SECRET_KEY_TWO: string | undefined;
    private JWT_TOKEN: string | undefined;
    private GATEWAY_JWT_TOKEN: string | undefined;
    
    private AUTH_BASE_URL: string | undefined;
    
    private USERS_BASE_URL: string | undefined;
    
    private GIG_BASE_URL: string | undefined;
    
    private ORDER_BASE_URL: string | undefined;
    
    private MESSAGE_BASE_URL: string | undefined;
    
    private REVIEW_BASE_URL: string | undefined;

    constructor() {
        this.NODE_ENV = process.env.NODE_ENV;
        this.JWT_TOKEN = process.env.JWT_TOKEN!;
        this.GATEWAY_JWT_TOKEN = process.env.GATEWAY_JWT_TOKEN!;
        this.CLIENT_URL = process.env.CLIENT_URL;
        this.ELASTIC_SEARCH_URL = process.env.ELASTIC_SEARCH_URL;
        this.SERVER_PORT = +process.env.SERVER_PORT!;
        this.SECRET_KEY_ONE = process.env.SECRET_KEY_ONE!;
        this.SECRET_KEY_TWO = process.env.SECRET_KEY_TWO!;
        this.AUTH_BASE_URL = process.env.AUTH_BASE_URL!;
        this.USERS_BASE_URL = process.env.USERS_BASE_URL!;
        this.GIG_BASE_URL = process.env.GIG_BASE_URL!;
        this.MESSAGE_BASE_URL = process.env.MESSAGE_BASE_URL!;
        this.ORDER_BASE_URL = process.env.ORDER_BASE_URL!;
        this.REVIEW_BASE_URL = process.env.REVIEW_BASE_URL!;

    }


    get configProperties() {

        return {
            NODE_ENV: this.NODE_ENV,
            CLIENT_URL: this.CLIENT_URL,
            ELASTIC_SEARCH_URL: this.ELASTIC_SEARCH_URL,
            SERVER_PORT: this.SERVER_PORT,
            SECRET_KEY_TWO: this.SECRET_KEY_TWO,
            SECRET_KEY_ONE: this.SECRET_KEY_ONE,
            JWT_TOKEN: this.JWT_TOKEN,
            GATEWAY_JWT_TOKEN: this.GATEWAY_JWT_TOKEN,
            // servicios urls
            AUTH_BASE_URL: this.AUTH_BASE_URL,
            USERS_BASE_URL: this.USERS_BASE_URL,
            GIG_BASE_URL: this.GIG_BASE_URL,
            MESSAGE_BASE_URL: this.MESSAGE_BASE_URL,
            REVIEW_BASE_URL: this.REVIEW_BASE_URL,
            ORDER_BASE_URL: this.ORDER_BASE_URL,
        };
    }
}

export const config: Config = new Config();

import express, { Express } from 'express';
import { GateWayServer } from '@gateway/server';


class App {

    public async initialize() {
        const app : Express = express();
        const server : GateWayServer = new GateWayServer(app);
        server.start();
    }
}

new App().initialize();

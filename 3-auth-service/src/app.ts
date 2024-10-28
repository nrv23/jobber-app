import { start } from '@auth/server';
import express from 'express';
import { config } from '@auth/config';

(async (): Promise<void> => {
    // cargar la configuracion de cloudinary
    config.cloudinaryConfig();
    const app = express();
    start(app);
})(); 
import { start } from '@auth/server';
import express from 'express';

(async (): Promise<void> => {
    const app = express();
    start(app);
})(); 
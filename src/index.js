import dotenv from 'dotenv';
import { App } from './app.js';

dotenv.config();

const app = new App();
app.startServer();

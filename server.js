import dotenv from 'dotenv';
dotenv.config();

import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import Twig from 'twig';
import RouteLoader from './src/RouteLoader.js';
import path from 'path';
import { fileURLToPath } from 'url';
import { getConfigValue } from './src/models/Config.js';
import { readFileSync } from 'fs';

const expressPort = getConfigValue('PORT') || getConfigValue('NERU_APP_PORT') || 3000;
process.env.PRIVATE_KEY = readFileSync(process.env.PRIVATE_KEY);

const app = express();
app.set('views', './views');
app.use(cors());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.dirname(fileURLToPath(import.meta.url)) + '/public'));
app.set('view engine', 'twig');
Twig.cache(false);
app.set('twig', Twig);

const routes = await RouteLoader('./src/routes/**/*.js');
app.use('/', routes);

app.listen(expressPort, () => {
    console.log(`Listening on ${expressPort}`);
});
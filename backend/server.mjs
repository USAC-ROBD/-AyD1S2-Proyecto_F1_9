import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import router from './routes/router.mjs';
import configurations from './utils/configurations.mjs';

const app = express();

app.use(morgan('dev')); // Ver peticiones en consola
app.use(cors());
app.use(express.json({ limit: '50mb' })); // Ajustamos el limite de subida de archivos a 50mb
app.use(express.json());
app.use(router);

app.set('port', configurations.port || 4000);

export default app;
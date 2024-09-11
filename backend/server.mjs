import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import router from './routes/router.mjs';
import configurations from './utils/configurations.mjs';

const app = express();

app.use(cors());
app.use(express.json());
app.use(router);
app.use(morgan('dev')); // Ver peticiones en consola


app.set('port', configurations.port || 3000);

export default app;
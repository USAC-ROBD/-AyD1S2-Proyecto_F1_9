import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import router from './routes/router.mjs';
import configurations from './utils/configurations.mjs';
import close from './utils/db_connection.mjs';

const app = express();

app.use(morgan('dev')); // Ver peticiones en consola
app.use(cors());
app.use(express.json({ limit: '50mb' })); // Ajustamos el limite de subida de archivos a 50mb
app.use(express.json());
let server;
app.use(router);

app.set('port', 4000 + Math.floor(Math.random() * 1000));

beforeAll(() => {
    server = app.listen(app.get('port'), () => {
        console.log(`Server on port 4000`);
    });
});

afterAll((done) => {
    server.close(() => {
        console.log(' Test server closed');
        done();
    });
});

export default app;
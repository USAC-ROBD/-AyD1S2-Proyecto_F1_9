import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const result = dotenv.config({ path: path.join(__dirname,'..', '.env') });

if (result.error) {
    // Si hubo un error al cargar el archivo .env, mostrarlo
    console.error("Error cargando .env:", result.error);
  }

export default {
    
    host: process.env.HOST || 'localhost',
    port: process.env.PORT || 0,
    //Database
    host_db: process.env.DB_HOST || 'localhost',
    port_db: process.env.DB_PORT || 5432,
    name_db: process.env.DB_NAME || '', 
    user: process.env.DB_USER || '',
    password: process.env.DB_PASSWORD || '',

    //credenciales S3

    accessKeyId: process.env.ACCESS_KEY_ID || '',
    secretAccessKey: process.env.SECRET_ACCESS_KEY || '',
    region: process.env.REGION || '',
    bucket: process.env.BUCKET || '',
};
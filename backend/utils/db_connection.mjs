import config from './configurations.mjs';
import mysql from 'mysql2/promise';

const db = mysql.createPool({
    host: config.host_db,
    port: config.port_db,
    user: config.user,
    password: config.password,
    database: config.name_db
});

export default db;
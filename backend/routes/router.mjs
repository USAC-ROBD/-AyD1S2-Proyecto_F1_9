import { Router } from 'express';
import { test } from '../controllers/ejemplo.mjs';


const router = Router();
//rutas de la api

/******Ejemplo*********/
router.get('/', test.ejemplo);

/******Test de la base de datos*********/
router.get('/test_db', test.test_db);

/******Authorizacion*********/

export default router;
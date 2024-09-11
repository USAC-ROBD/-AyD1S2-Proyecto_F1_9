import { Router } from 'express';
import { test } from '../controllers/ejemplo.mjs';


const router = Router();
//rutas de la api

/******Ejemplo*********/
router.get('/', test.ejemplo);

/******Authorizacion*********/

export default router;
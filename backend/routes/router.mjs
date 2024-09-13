import { Router } from 'express';
import { test } from '../controllers/ejemplo.mjs';
import { users } from '../controllers/users.mjs';


const router = Router();
//rutas de la api

/******Ejemplo*********/
router.get('/', test.ejemplo);

/******Test de la base de datos*********/
router.get('/test_db', test.test_db);

/******Registro*********/
router.get('/getCountries', users.getCountries)
router.get('/login', users.login)
router.post('/signup', users.signup)

export default router;
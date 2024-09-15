import { Router } from 'express';
import { test } from '../controllers/ejemplo.mjs';
import { users } from '../controllers/users.mjs';

import {recovery} from '../controllers/recovery.mjs';
import {setNewPassword} from '../controllers/setNewPassword.mjs';
import {storage} from '../controllers/storage.mjs';


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
router.get('/confirmation', users.confirmation)

router.post('/recovery', recovery.recuperarContrasena);
router.post('/setNewPassword', setNewPassword.guardarNuevaContrasena);

/**** Storage *******/
router.post('/getStorage', storage.getStorage);

export default router;
import { Router } from 'express';
import { test } from '../controllers/ejemplo.mjs';
import { users } from '../controllers/users.mjs';

import {recovery} from '../controllers/recovery.mjs';
import {setNewPassword} from '../controllers/setNewPassword.mjs';


const router = Router();
//rutas de la api

/******Ejemplo*********/
router.get('/', test.ejemplo);

<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
/******Test de la base de datos*********/
router.get('/test_db', test.test_db);

/******Registro*********/
router.get('/getCountries', users.getCountries)
router.get('/login', users.login)
router.post('/signup', users.signup)
router.get('/confirmation', users.confirmation)

router.post('/recovery', recovery.recuperarContrasena);
router.post('/setNewPassword', setNewPassword.guardarNuevaContrasena);
=======
=======
/******Test de la base de datos*********/
router.get('/test_db', test.test_db);

>>>>>>> 749edc1 (Reapply "Merge branch 'Feature/BDD_201944994' into develop")
=======
>>>>>>> 0478a17 (Revert "Reapply "Merge branch 'Feature/BDD_201944994' into develop"")
/******Authorizacion*********/
>>>>>>> 9835f09 (Revert "Merge branch 'Feature/BDD_201944994' into develop")

export default router;
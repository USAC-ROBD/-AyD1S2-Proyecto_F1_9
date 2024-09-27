import { Router } from 'express';
import { test } from '../controllers/ejemplo.mjs';
import { users } from '../controllers/users.mjs';
import {recovery} from '../controllers/recovery.mjs';
import {setNewPassword} from '../controllers/setNewPassword.mjs';
import {storage} from '../controllers/storage.mjs';
import {files} from '../controllers/files.mjs';
import {getCurrentStorageUser} from '../controllers/getCurrentStorage.mjs';
import {changeStorageRequestUser} from '../controllers/changeStorageRequest.mjs';
import {deleteAccountRequestUser} from '../controllers/deleteAccountRequest.mjs';
import {registerDeleteAccountRequestUser} from '../controllers/registerDeleteAccountRequest.mjs';


const router = Router();
//rutas de la api

/******Ejemplo*********/
router.get('/', test.ejemplo);

/******Test de la base de datos*********/
router.get('/test_db', test.test_db);

/******Users*********/
router.get('/getCountries', users.getCountries)
router.get('/login', users.login)
router.post('/signup', users.signup)
router.get('/confirmation', users.confirmation)
router.post('/recovery', recovery.recuperarContrasena);
router.post('/setNewPassword', setNewPassword.guardarNuevaContrasena);
router.post('/uploadProfile', users.updateProfile)

/**** Storage *******/
router.post('/getStorage', storage.getStorage);

/***** Files ****** */
router.post('/getRootFolder', files.getRootFolder);
router.post('/getChildItems', files.getChildItems);
router.post('/uploadFile', files.uploadFile);
router.post('/createFolder', files.createFolder);

/***** Storage user ******/
router.post('/getCurrentStorage', getCurrentStorageUser.getCurrentStorage);
router.post('/changeStorageRequest', changeStorageRequestUser.changeStorageRequest);

/***** Delete account ******/
router.post('/deleteAccountRequest', deleteAccountRequestUser.deleteAccountRequest);
router.post('/registerDeleteAccountRequest', registerDeleteAccountRequestUser.registerDeleteAccountRequest);


/******* Admin *******/
router.get('/getAllAccounts', users.getAllAccounts)
router.post('/createAccount',users.createAccount)
router.post('/updateAccounts',users.updateAccounts)
router.put('/warningAccount',users.warningAccount)
router.put('/confirmationWarning',users.confirmationWarning)

export default router;
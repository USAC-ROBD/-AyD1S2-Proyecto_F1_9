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
import {getRequestsUser} from '../controllers/getRequests.mjs';
import { processChangeStorageRequestUser } from '../controllers/processChangeStorageRequest.mjs';
import { processDeleteRequestUser } from '../controllers/processDeleteRequest.mjs';


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
router.put('/rename', files.rename);
router.put('/download', files.download);
router.post('/deleteFile', files.deleteFile);
router.post('/getDeletedFiles', files.getDeletedItems);
router.post('/restoreFile', files.restoreFile);
router.post('/emptyTrash', files.emptyTrash);

/***** Storage user ******/
router.post('/getCurrentStorage', getCurrentStorageUser.getCurrentStorage);
router.post('/changeStorageRequest', changeStorageRequestUser.changeStorageRequest);

/***** Delete account ******/
router.post('/deleteAccountRequest', deleteAccountRequestUser.deleteAccountRequest);
router.post('/registerDeleteAccountRequest', registerDeleteAccountRequestUser.registerDeleteAccountRequest);

/***** Get requests ******/
router.get('/getRequests', getRequestsUser.getRequests);
router.post('/processChangeStorageRequest', processChangeStorageRequestUser.processChangeStorageRequest);
router.post('/processDeleteRequest', processDeleteRequestUser.processDeleteRequest);    




/******* Admin *******/
router.get('/getAllAccounts', users.getAllAccounts)
router.post('/createAccount',users.createAccount)
router.post('/updateAccounts',users.updateAccounts)
router.put('/warningAccount',users.warningAccount)
router.put('/confirmationWarning',users.confirmationWarning)
router.delete('/deleteAccount',users.deleteAccount)

export default router;
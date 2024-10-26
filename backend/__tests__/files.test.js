import request from 'supertest';
import app from '../index.test.mjs'; // Puedes seguir usando import para tus módulos

 test('POST /uploadFile, debe retornar un atributo status=200, file', async () => {
   const res = await request(app).post('/uploadFile').send({
    idUser: 2,
    username: 'test',
    folder: 1,
    file: {
      name: 'test.txt',
      size: 1000,
      type: 'text/plain',
      content: 'VGhpcyBpcyBhIHRlc3QgY29udGVudA==' // Esto es 'This is a test content' en base64
    }
    });
   expect(res.status).toBe(200);
   expect(res.body).toHaveProperty('status', 200);
   expect(res.body).toHaveProperty('file');
 }, 30000); // 30 segundos de timeout


test('POST /createFolder, debe retornar un atributo status=200, y el id del folder', async () => {
    const res = await request(app).post('/createFolder').send({
        idUser: 2,
        username: 'test',
        parentFolder: 1,
        name: 'test folder'
    });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('status', 200);
    expect(res.body).toHaveProperty('folder');
}, 30000); // 30 segundos de timeout


test('POST /getFavsItems, debe retornar un status=200 y una lista de children', async () => {
  const res = await request(app).post('/getFavorites').send({
      idAccount: 1,
      idFolder: null // Cambia según lo que quieras probar
  });
  expect(res.status).toBe(200);
  expect(res.body).toHaveProperty('status', 200);
  expect(res.body).toHaveProperty('children');
  expect(Array.isArray(res.body.children)).toBe(true);
}, 30000);


test('POST /setFavItem, debe retornar un status=200 y el nuevo estado de favorito', async () => {
  const res = await request(app).post('/setFavorite').send({
      idItem: 1, // Cambia este ID a un valor válido para la prueba
      type: 'file' // Cambia a 'folder' si necesitas probar una carpeta
  });
  expect(res.status).toBe(200);
  expect(res.body).toHaveProperty('status', 200);
  expect(res.body).toHaveProperty('fav');
  expect(typeof res.body.fav).toBe('number'); // El nuevo estado de favorito debería ser 0 o 1
}, 30000);
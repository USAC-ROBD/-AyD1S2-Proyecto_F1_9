import request from 'supertest';
import app from '../server.mjs'; // Puedes seguir usando import para tus módulos

 test('POST /uploadFile, debe retornar un atributo status=200, file', async () => {
   const res = await request(app).post('/uploadFile').send({
    idUser: 2,
    username: 'tiky',
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
        username: 'tiky',
        parentFolder: 1,
        name: 'test'
    });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('status', 200);
    expect(res.body).toHaveProperty('file');
}, 30000); // 30 segundos de timeout

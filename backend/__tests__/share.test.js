import request from 'supertest';
import app from '../server.mjs';

describe('Share items tests', () => {
  
  test('POST /shareItem should share a file successfully', async () => {
    const res = await request(app).post('/shareItem').send({
      currentUserId: 2, // Propietario
      userIdentifier: 'stevengonzalez007@gmail.com', // Destinatario
      idFile: 1, // Suponemos un archivo con ID 1
      type: 'file'
    });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('status', 200);
    expect(res.body).toHaveProperty('message', 'File shared successfully');
  });

  test('POST /shareItem should return 400 when trying to share with oneself', async () => {
    const res = await request(app).post('/shareItem').send({
      currentUserId: 2, // Propietario
      userIdentifier: 'stevengonzalez088@gmail.com', // Mismo usuario que el propietario
      idFile: 1,
      type: 'file'
    });
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('message', 'You cannot share the file with yourself');
  });

  test('POST /getSharedWithMeItems should return shared items for user', async () => {
    const res = await request(app).post('/getSharedWithMeItems').send({
      idUsuario: 3, // Destinatario
    });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('status', 200);
    expect(res.body).toHaveProperty('children');
  });

  test('POST /showSharedIconInSideBar should return icon visibility for shared items', async () => {
    const res = await request(app).post('/showSharedIconInSideBar').send({
      idUsuario: 3, // Destinatario
    });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('status', 200);
    expect(res.body).toHaveProperty('icon');
  });

  test('POST /getUsersWithItemShared should return users with whom the file is shared', async () => {
    const res = await request(app).post('/getUsersWithItemShared').send({
      idItem: 1, // Suponemos un archivo con ID 1
      type: 'file'
    });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('status', 200);
    expect(res.body).toHaveProperty('users');
  });

  test('POST /stopSharing should unshare the file', async () => {
    const res = await request(app).post('/stopSharing').send({
      idItem: 1, // Archivo con ID 1
      type: 'file',
      idUser: 3, // Destinatario
    });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('status', 200);
    expect(res.body).toHaveProperty('message', 'File unshared successfully');
  });

});

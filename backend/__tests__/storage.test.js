import request from 'supertest';
import app from '../server.mjs'; // Puedes seguir usando import para tus módulos

test('POST /getStorage debería devolver un json con los tributos status:200, used, total', async () => {
  const res = await request(app).post('/getStorage').send({ username: 'tiky' });
  expect(res.status).toBe(200);
  expect(res.body).toHaveProperty('status', 200);
  expect(res.body).toHaveProperty('used');
  expect(res.body).toHaveProperty('total');
});

test('POST /getStorage debería retornar status 400 ya que los parametros estan nulos', async () => {
  const res = await request(app).post('/getStorage').send({ username: undefined });
  expect(res.status).toBe(400);
  expect(res.body).toHaveProperty('message', 'User ID is required to get storage used');
});

import request from 'supertest';
import app from '../index.test.mjs'; // Puedes seguir usando import para tus módulos

test('POST /getStorage debería devolver un json con los tributos status:200, used, total', async () => {
  const res = await request(app).post('/getStorage').send({ username: 'test' });
  expect(res.status).toBe(200);
  expect(res.body).toHaveProperty('status', 200);
  expect(res.body).toHaveProperty('used');
  expect(res.body).toHaveProperty('total');
});


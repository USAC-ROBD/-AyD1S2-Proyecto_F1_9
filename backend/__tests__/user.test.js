import request from 'supertest';
import app from '../server.mjs'; // Puedes seguir usando import para tus módulos

 test('POST /signup, debe retornar un atributo status=200, icon, message', async () => {
   const res = await request(app).post('/signup').send({name: 'John', lastName: 'Doe', username: 'joe5', password: '123', email: 'ayd2024s4grupo9@gmail.com', phone: '1234567890', country: 158, nationality: 'SERBIA', plan: 3});
   expect(res.status).toBe(200);
   expect(res.body).toHaveProperty('status', 200);
   expect(res.body).toHaveProperty('icon');
   expect(res.body).toHaveProperty('message');
 }, 30000); // 30 segundos de timeout

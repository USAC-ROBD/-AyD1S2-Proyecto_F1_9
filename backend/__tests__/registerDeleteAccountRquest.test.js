import request from 'supertest'
import app from '../server.mjs'

test('POST /registerDeleteAccountRequest, debe retornar un atributo status=200, icon, message', async () => {   
    const res = await request(app).post('/registerDeleteAccountRequest').send({ email: 'dougdari@mgil.com' });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('status', 200);
    expect(res.body).toHaveProperty('icon');
    expect(res.body).toHaveProperty('message');
}, 30000);
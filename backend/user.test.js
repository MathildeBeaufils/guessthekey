const request = require('supertest');
const app = require('./app');



const newUser = { username: 'userTest', password: 'test123', email:'test@test.fr' };
const newUsername = 'usertest2';
const wrongPassword ='toto'

it('Signup', async () => {
    const res = await request(app).post('/users/signup').send(newUser);

    expect(res.statusCode).toBe(200);
    expect(res.body.result).toBe(true);
    expect(res.body.data.username).toBe(newUser.username);
});


it('Signin', async () => {
    const res2 = await request(app).post('/users/signin').send({
        email: newUser.email,
        password: newUser.password,
    });
    expect(res2.statusCode).toBe(200);
    expect(res2.body.result).toBe(true);
    expect(res2.body.data.username).toBe(newUser.username);
});

// test avec mauvais password
it('Refus Signin', async () => {
    const res2 = await request(app).post('/users/signin').send({
        email: newUser.email,
        password: wrongPassword,
    });
    expect(res2.statusCode).toBe(200);
    expect(res2.body.result).toBe(false);
});



it('Update User', async () => {
    const res3 = await request(app).post('/users/updateUsername').send({
        username:newUser.username,
        newUsername:newUsername
    });
    expect(res3.statusCode).toBe(200);
    expect(res3.body.username).toBe(newUsername);

});


it('DELETE User', async () => {
    const res4 = await request(app).delete('/users/deleteUser').send({email:newUser.email});
    expect(res4.statusCode).toBe(200);
    expect(res4.body.result).toBe(true);

});
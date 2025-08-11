// const request = require('supertest');
// const app = require('../app');

// global.fetch = jest.fn();

// it('POST /manches/musicByArtist', async () => {
//     //mock d'un envoi Deezer => pas utilisable avec les autres tests qui ont besoin de la DB
//     fetch.mockResolvedValue({
//         json: () => Promise.resolve({
//           data: [
//             { title: "Allumer le feu", artist: { name: "Johnny Hallyday" }, link: "http://deezer.com/track/123" }
//           ]
//         })
//       });
    

//       const res = await request(app).post('/manches/musicByArtist').send({
//         artiste: "Johnny Hallyday",
//         musique: "Allumer le feu",
//       });

//  expect(res.statusCode).toBe(200);
//  expect(res.body.result).toBe(true);
// });
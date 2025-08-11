const request = require('supertest');
const app = require('../app');

global.fetch = jest.fn();


it('POST /manches/musicByArtist', async () => {
    fetch.mockResolvedValue({
        json: () => Promise.resolve({
          data: [
            { title: "Allumer le feu", artist: { name: "Johnny Halliday" }, link: "http://deezer.com/track/123" }
          ]
        })
      });
    
      const res = await request(app).post('/manches/musicByArtist').send({
        artiste: "Johnny Halliday",
        musique: "Allumer le feu",
      });

 expect(res.statusCode).toBe(200);
 expect(res.body.result).toBe(true);
});
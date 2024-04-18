const request = require('supertest');
const app = require('../Todoapp/index');


describe('Unit tests for /posts API endpoint', () => {

    it('should respond with posts data in JSON format', async () => {
        // Call the endpoint handler function
        const res = await request(app).get('/posts');

        // Check if the response body contains the expected posts
        expect(res.text).toEqual(JSON.stringify([{"_id":"65e660c1943e14012a674f89","title":null,"date":null},{"_id":"65e6613a8624161177a67c79","title":null,"date":null},{"_id":"65e661722cb8735e434a7081","title":null,"date":null},{"_id":"65e662caaa87fbe67d0cf627","title":null,"date":null},{"_id":"65e6630a0d0a75365d90c59c","title":null,"date":null},{"_id":"65e663fd3a5e20fde5427a91","title":null,"date":null},{"_id":"65e664cea5f4166e21d2ec73","title":null,"date":null},{"_id":"65e6655a0d92264c2d11665e","title":null,"date":null},{"_id":"65e665b5c1d922889333d413","title":null,"date":null},{"_id":"65e6666c0df007db08d54ff5","title":null,"date":null},{"_id":32,"title":"Feed Dog","date":"3/4/23"},{"_id":33,"title":"hello","date":"3/4/23"},{"_id":34,"title":"Open Door","date":"3/4/23"},{"_id":35,"title":"hello","date":"3/4/23"},{"_id":36,"title":null,"date":null}]));
    });

});


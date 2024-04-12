const request = require('supertest');
const app = require('../index'); 
const util = require('../util/mongodbutil'); 

jest.mock('../util/mongodbutil', () => ({
  read: jest.fn(),
  count: jest.fn()
}));

describe('Pagination API Tests', () => {
  let server;

  beforeAll(() => {
    server = app.listen(4000);
  });

  afterAll(async () => {
    await server.close();
  });

  beforeEach(() => {
    util.read.mockReset();
    util.count.mockReset();
  });

  test('handling no tasks', async () => {
    util.read.mockResolvedValueOnce([]);
    util.count.mockResolvedValueOnce(0);
  
    const response = await request(server).get('/pagination?page=1&pageSize=6').set('Accept', 'application/json');

    console.log(response.body);
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body.posts)).toBe(true);
    expect(response.body.posts.length).toBe(0);
    expect(response.body.totalPosts).toBe(0);
    expect(response.body.page).toBe(1);
    expect(response.body.pageSize).toBe(6);
  });

  test('Return first page of tasks', async () => {
    const mockPosts = Array(6).fill().map((_, index) => ({ id: index + 1, title: `Post ${index + 1}` }));
    const totalPosts = 20;
    util.read.mockResolvedValueOnce(mockPosts);
    util.count.mockResolvedValueOnce(totalPosts);
  
    const response = await request(server).get('/pagination?page=1&pageSize=6').set('Accept', 'application/json');
    console.log(response.body);

    expect(response.status).toBe(200);
    expect(response.body.posts).toEqual(mockPosts);
    expect(response.body.totalPosts).toBe(totalPosts);
    expect(response.body.page).toBe(1);
    expect(response.body.pageSize).toBe(6);
  });

  test('navigate to the next page of tasks', async () => {
    const mockPostsPage2 = Array(6).fill().map((_, index) => ({ id: index + 7, title: `Post ${index + 7}` }));
    const totalPosts = 20;
    
    util.read.mockResolvedValueOnce(mockPostsPage2);
    util.count.mockResolvedValueOnce(totalPosts);
    const response = await request(server).get('/pagination?page=2&pageSize=6').set('Accept', 'application/json');
  
    console.log('Response:', response.body);
  
    expect(response.status).toBe(200);
    expect(response.body.posts).toEqual(mockPostsPage2);
    expect(response.body.totalPosts).toBe(totalPosts);
    expect(response.body.page).toBe(2);
    expect(response.body.pageSize).toBe(6);
  });

});

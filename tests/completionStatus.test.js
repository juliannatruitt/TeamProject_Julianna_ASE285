const { TodoApp } = require('../util/utility.js');
const util = require('../util/mongodbutil.js');

// mock util module
jest.mock('../util/mongodbutil.js');

describe('updateCompletionStatus', () => {
  test('should toggle completion status of a post', async () => {
    // mock data
    const postId = 123;
    const post = [{ _id: postId, completed: false }];
    const newCompletionStatus = true;

    // mock util.read function to return post
    util.read.mockResolvedValue(post);

    // mock util.update
    util.update.mockResolvedValue(true);

    // mock request and response objects
    const req = { body: { postId } };
    const resp = { json: jest.fn() };

    // create instance of TodoApp
    const postapp = new TodoApp('test_uri', 'test_database', 'test_posts', 'test_counter');

    //call function
    await postapp.updateCompletionStatus(req, resp);

    // expect util.read called with correct parameters
    expect(util.read).toHaveBeenCalledWith('test_uri', 'test_database', 'test_posts', { _id: postId });

    // expect util.update called with correct parameters
    expect(util.update).toHaveBeenCalledWith('test_uri', 'test_database', 'test_posts', { _id: postId }, { $set: { completed: newCompletionStatus } });

    // expect response.json called with updated completion status
    expect(resp.json).toHaveBeenCalledWith({ completed: newCompletionStatus });
  });
//passed
});

describe('updateCompletionStatus', () => {
    test('should toggle completion status of a post (back and forth) and update UI button', async () => {
      // mock data
      const postId = 123;
      const postIncomplete = [{ _id: postId, completed: false }];
      const postComplete = [{ _id: postId, completed: true }];
  
      // mock the util.read function -- return incomplete
      util.read.mockResolvedValue(postIncomplete);
  
      // mock the util.update function
      util.update.mockImplementation(async (uri, database, collection, query, update) => {
        // simulate toggling status
        postIncomplete[0].completed = !postIncomplete[0].completed;
        return true;
      });
  
      // request & response objects
      const req = { body: { postId } };
      const resp = { json: jest.fn() };

      const postapp = new TodoApp('test_uri', 'test_database', 'test_posts', 'test_counter');
  
      // call function to toggle completion status -- incomplete to complete
      await postapp.updateCompletionStatus(req, resp);
  
      expect(util.read).toHaveBeenCalledWith('test_uri', 'test_database', 'test_posts', { _id: postId });

      expect(util.update).toHaveBeenCalledWith('test_uri', 'test_database', 'test_posts', { _id: postId }, { $set: { completed: true } });

      expect(resp.json).toHaveBeenCalledWith({ completed: true });
  
      // reset the mock functions
      jest.clearAllMocks();
  
      // return post -- complete
      util.read.mockResolvedValue(postComplete);
  
      // Call function to toggle completion -- complete to incomplete
      await postapp.updateCompletionStatus(req, resp);
  
      expect(util.read).toHaveBeenCalledWith('test_uri', 'test_database', 'test_posts', { _id: postId });
      expect(util.update).toHaveBeenCalledWith('test_uri', 'test_database', 'test_posts', { _id: postId }, { $set: { completed: false } });
      expect(resp.json).toHaveBeenCalledWith({ completed: false });
    });
    //passed
});
  
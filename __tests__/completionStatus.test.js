const { TodoApp } = require('../util/utility.js');
const util = require('../util/mongodbutil.js');

jest.mock('../util/mongodbutil.js');

describe('updateCompletionStatus', () => {
  test('should toggle completion status of a post', async () => {
    const postId = 123;
    const post = [{ _id: postId, completed: false }];
    const newCompletionStatus = true;

    util.read.mockResolvedValue(post);

    util.update.mockResolvedValue(true);

    const req = { body: { postId } };
    const resp = { json: jest.fn() };

    const postapp = new TodoApp('test_uri', 'test_database', 'test_posts', 'test_counter');

    await postapp.updateCompletionStatus(req, resp);

    expect(util.read).toHaveBeenCalledWith('test_uri', 'test_database', 'test_posts', { _id: postId });
    expect(util.update).toHaveBeenCalledWith('test_uri', 'test_database', 'test_posts', { _id: postId }, { $set: { completed: newCompletionStatus } });
    expect(resp.json).toHaveBeenCalledWith({ completed: newCompletionStatus });
  });
//passed
});

describe('updateCompletionStatus', () => {
    test('should toggle completion status of a post (back and forth) and update UI button', async () => {

      const postId = 123;
      const postIncomplete = [{ _id: postId, completed: false }];
      const postComplete = [{ _id: postId, completed: true }];
  
      util.read.mockResolvedValue(postIncomplete);
  
      util.update.mockImplementation(async (uri, database, collection, query, update) => {
        // simulate toggling status
        postIncomplete[0].completed = !postIncomplete[0].completed;
        return true;
      });
  
      const req = { body: { postId } };
      const resp = { json: jest.fn() };

      const postapp = new TodoApp('test_uri', 'test_database', 'test_posts', 'test_counter');
  
      // call function to toggle completion status -- incomplete to complete
      await postapp.updateCompletionStatus(req, resp);
  
      expect(util.read).toHaveBeenCalledWith('test_uri', 'test_database', 'test_posts', { _id: postId });

      expect(util.update).toHaveBeenCalledWith('test_uri', 'test_database', 'test_posts', { _id: postId }, { $set: { completed: true } });

      expect(resp.json).toHaveBeenCalledWith({ completed: true });

      jest.clearAllMocks();
  
      util.read.mockResolvedValue(postComplete);
  
      await postapp.updateCompletionStatus(req, resp);
  
      expect(util.read).toHaveBeenCalledWith('test_uri', 'test_database', 'test_posts', { _id: postId });
      expect(util.update).toHaveBeenCalledWith('test_uri', 'test_database', 'test_posts', { _id: postId }, { $set: { completed: false } });
      expect(resp.json).toHaveBeenCalledWith({ completed: false });
    });
    //passed
});
  
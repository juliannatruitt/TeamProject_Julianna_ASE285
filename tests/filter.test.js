/*
const { TodoApp } = require('../util/utility.js');
const util = require('../util/mongodbutil.js');

jest.mock('../util/mongodbutil.js');

describe('runListFilter', () => {
    test('correctly filter by title', async () => {
        const selectedFilter = 'title';
        const titleLookup = 'Work';
        const retrievedPost = [{ title: 'Work'}]

        util.read.mockResolvedValue(retrievedPost)
        
        const req = selectedFilter;
        const resp = { json: jest.fn() };;

        const postapp = new TodoApp('test_uri', 'test_database', 'test_posts', 'test_counter');
        
        await postapp.runListFilter(req, resp);

        expect(util.read).toHaveBeenCalledWith('test_uri', 'test_database', 'test_posts', )

    });
});
*/


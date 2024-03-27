// npm install -g nodemon

// npm install .
// nodemon ./index.js
// Access this server with http://localhost:5500

const {URI} = require('./util/config.js');
const { TodoApp } = require('./util/utility.js');
const util = require('./util/mongodbutil.js');

const DATABASE = 'todoapp';
const POSTS = 'posts';
const COUNTER = 'counter';
const postapp = new TodoApp(URI, DATABASE, POSTS, COUNTER);

const express = require('express');
const app = express();
const bodyParser = require('body-parser')
const methodOverride = require('method-override')

app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.urlencoded({ extended: true }))
app.set('view engine', 'ejs');
app.use('/public', express.static('public'));
app.use(methodOverride('_method'))

app.listen(5500, function () {
  console.log('listening on 5500')
});

app.get('/', async function(req, resp) { 
  try {
      await resp.render('write.ejs')
  } catch (e) {
      console.error(e);
  } 
});
  
 app.post('/add', async function(req, resp) {
  try {
    await postapp.runAddPost(req, resp);
  } catch (e) {
    console.error(e);
  } 
});
  
app.get('/list', async function(req, res) {
  try {
    // Fetch tasks from the database
    const tasks = await util.read(URI, DATABASE, POSTS, {});

    // Render the 'list.ejs' template and pass the 'posts' data
    res.render('list.ejs', { posts: tasks }); // Change 'tasks' to 'posts'
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: `Error fetching tasks: ${error.message}` });
  }
});




  
app.delete('/delete', async function(req, resp){   
  try {
    await postapp.runDeleteDelete(req, resp); 
  } catch (e) {
    console.error(e);
  }     
}); 

app.get('/detail/:id', async function (req, resp) {
  try {
    await postapp.runDetailIdGet(req, resp); 
  } catch (e) {
    console.error(e);
  }    
});

app.get('/edit/:id', async function (req, resp) {
  try {
    await postapp.runEditIdGet(req, resp); 
  } catch (e) {
    console.error(e);
  }    
});

app.put('/edit', async function (req, resp) {
  try {
    await postapp.runEditPut(req, resp); 
  } catch (e) {
    console.error(e);
  }     
});
// Define a route handler for GET requests to '/posts'
app.get('/posts', async (req, res) => {
  try {
      // Call runListGet to retrieve all post
      const posts =  await util.read(URI, DATABASE, POSTS, {}) 
      // Respond with updated posts array
      res.json(posts);
  } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/complete', async (req, res) => {
  try {
    const postId = req.body.postId;
    // Update the task's completion status in the database
    const result = await db.collection('counter').updateOne(
      { _id: ObjectID(postId) },
      { $set: { completed: true } }
    );
    if (result.modifiedCount === 1) {
      res.sendStatus(200); // Send a success response if the task was updated
    } else {
      res.status(404).json({ error: 'Task not found' }); // Send a 404 error if the task ID was not found
    }
  } catch (error) {
    console.error('Error completing task:', error);
    res.status(500).json({ error: 'Internal server error' }); // Send an error response
  }
});



module.exports = app;


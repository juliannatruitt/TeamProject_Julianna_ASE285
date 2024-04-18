// npm install -g nodemon
// npm install mongodb

// npm install .
// nodemon ./index.js
// Access this server with http://localhost:5500

const { TodoApp } = require('./util/utility.js');
const util = require('./util/mongodbutil.js');

require('dotenv').config();
const { MongoClient } = require('mongodb');
const URI = process.env.MONGODB_URI;

const url = 'mongodb://localhost:27017';
const client = new MongoClient(url);

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
    const tasks = await util.read(URI, DATABASE, POSTS, {});
    await resp.render('write.ejs', { posts: tasks })
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
    const tasks = await util.read(URI, DATABASE, POSTS, {});
    res.render('list.ejs', { posts: tasks });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: `Error fetching tasks: ${error.message}` });
  }
});


app.get('/list', async function(req, res) {
  try {
    const tasks = await util.read(URI, DATABASE, POSTS, {});
    res.render('list.ejs', { posts: tasks });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: `Error fetching tasks: ${error.message}` });
  }
});

app.post('/filter', async function(req, resp){
  try {
    await postapp.runListFilter(req, resp);
    await postapp.runListFilter(req, resp);
  } catch (e) {
    console.error(e);
  }   
});

app.post('/filter', async function(req, resp){
  try {
    await postapp.runListFilter(req, resp);
  } catch (e) {
    console.error(e);
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


app.get('/posts', async (req, res) => {
  try {
      const posts =  await util.read(URI, DATABASE, POSTS, {}) 
      res.json(posts);
  } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/calendar', async function (req, res){
  try{
    await postapp.runCalendarGet(req, res);
  }
  catch (e){
    console.error(e);
  }
})

app.post('/complete', async (req, res) => {
  try {
    const postID = req.body.postID;
    console.log('ID:', postID)
    await postapp.updateCompletionStatus(req, res);
  } catch (error) {
    console.error('Error completing task:', error);
  }
});

app.get('/pagination', async function(req, res) {
  try {
    await postapp.getTasksWithPagination(req, res);
  } catch (error) {
    console.error('Error getting paginated tasks:', error);
  }
});

module.exports = app;
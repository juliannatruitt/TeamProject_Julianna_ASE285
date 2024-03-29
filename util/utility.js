const util = require('./mongodbutil.js');

class TodoApp {
  constructor(uri, database, posts, counter) {
    this.uri = uri
    this.database = database
    this.posts = posts
    this.counter = counter
  }
  
  async runAddPost(req, resp) {
    try {
      let query = { name: 'Total Post' };
      let res = await util.read(this.uri, this.database, this.counter, query);
      let totalPost = 0;
      if (res.length != 0) {
        totalPost = res[0].totalPost;
        console.log(res);
      } else {
        query = { name: 'Total Post', totalPost: 0 };
        await util.create(this.uri, this.database, this.counter, query);
      }
  
      query = { name: 'Latest Post ID' };
      res = await util.read(this.uri, this.database, this.counter, query);
      let latestIdNumber = 0;
      if (res.length != 0) {
        latestIdNumber = res[0].latestIdNumber;
      } else {
        query = { name: 'Latest Post ID', latestIdNumber: 0 };
        await util.create(this.uri, this.database, this.counter, query);
      }
  
      query = { _id: latestIdNumber + 1, title: req.body.title, date: req.body.date, completed: false }; // Set completed to false
      res = await util.create(this.uri, this.database, this.posts, query);
  
      query = { name: 'Total Post' };
      const stage = { $inc: { totalPost: 1 } };
      await util.update(this.uri, this.database, this.counter, query, stage);
  
      // Increment latestIdNumber when adding a new post
      const incrementLatestId = { $inc: { latestIdNumber: 1 } };
      await util.update(this.uri, this.database, this.counter, { name: 'Latest Post ID' }, incrementLatestId);
  
      this.runListGet(req, resp);
    } catch (error) {
      console.error(error);
      resp.status(500).send({ error: `Error from runAddPost: ${error.message}` });
    }
  }
  
    
  async runListGet(req, resp) {
      try {
        let res = await util.read(this.uri, this.database, this.posts, {}) // {} query returns all documents
        if (res.length == 0) {
          resp.redirect('/');
        } else {
          const query = { posts: res };
          resp.render('list.ejs', query)
        }   
      } catch (e) {
        console.error(e);
        resp.status(500).send({ error: `Error from runListGet: ${e.message}` })
      } 
  }
  
  async runDeleteDelete(req, resp) {
    try {
      req.body._id = parseInt(req.body._id);
      console.log(req.body._id);
      await util.delete_document(this.uri, this.database, this.posts, req.body);
  
      // Don't decrement totalPost here
  
      this.runListGet(req, resp);
    } catch (e) {
      console.error(e);
      resp.status(500).send({ error: `Error from runDeleteDelete: ${e.message}` });
    }
  }
    
  
  async runEditIdGet(req, resp) {
    // DEBUG
    console.log("runEditIdGet")
    console.log(req.params)
    try {
      let query = {_id: parseInt(req.params.id)};
      console.log(query);
      let res = await util.read(this.uri, this.database, this.posts, query)
      console.log({ data: res })
      if (res != null && res.length != 0) {
        resp.render('edit.ejs', { data: res })
      }
      else {
        resp.status(500).send({ error: 'result is null' })
      }
    }
    catch (error) {
        console.log(error)
        resp.status(500).send({ error: `Error from runEditIdGet : ${e.message}` })
    }
  }
  async runEditPut(req, resp) {
    // DEBUG
    let id = parseInt(req.body._id);
    console.log(`runEditPut id: ${req.body.id} title: ${req.body.title} date: ${req.body.date}`)
    let query = {_id: id}
    let update = {$set: {_id:id, title: req.body.title, date: req.body.date}}
    try {
      let res = await util.update(this.uri, this.database, this.posts, query, update);
      console.log(`app.put.edit: Update complete ${res}`)
      resp.redirect('/list')
    }
    catch (e) {
      console.error(e);
      resp.status(500).send({ error: `Error from runEditPut: ${e.message}`})
    }
  }
  
  async runDetailIdGet(req, resp) {
    try {
      let query = { _id: parseInt(req.params.id) }
      let res = await util.read(this.uri, this.database, this.posts, query);
      console.log({ data: res });
      if (res != null && res.length > 0) {
        resp.render('detail.ejs', { data: res })
      }
      else {
        resp.render('error.ejs', { error: `result is null` })
      }
    }
    catch (error) {
      console.log(error)
      resp.status(500).send({ error: `Error from runDetailIdGet: ${e.message}` })
    }
  }

  async runGetPost() {
    try {
      const posts = await util.read(this.uri, this.database, this.posts, {});
      return posts;
    } catch (e) {
      resp.render('error.ejs')
      throw e;
    }
  }

  async updateCompletionStatus(req, resp) {
    let id = parseInt(req.body.postId);
    let post = await util.read(this.uri, this.database, this.posts, { _id: id });
    
    // Check if the post exists and has a completion status
    if (!post || post.length === 0) {
        throw new Error(`Post with ID ${id} not found.`);
    }

    // Get the current completion status
    let currentCompletionStatus = post[0].completed;

    // Toggle the completion status
    let newCompletionStatus = !currentCompletionStatus;

    let query = { _id: id };
    let update = { $set: { completed: newCompletionStatus } };

    try {
        let res = await util.update(this.uri, this.database, this.posts, query, update);
        console.log(`Completion status toggled for post with ID ${id}. New status: ${newCompletionStatus}`);
        
        // Send back the updated completion status
        resp.json({ completed: newCompletionStatus });
    } catch (error) {
        console.error(error);
        throw new Error(`Error updating completion status: ${error.message}`);
    }
}


  
}

module.exports.TodoApp = TodoApp;
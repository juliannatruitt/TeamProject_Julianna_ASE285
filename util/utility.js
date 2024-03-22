const util = require('./mongodbutil.js');

class TodoApp {
  constructor(uri, database, posts, counter) {
    this.uri = uri
    this.database = database
    this.posts = posts
    this.counter = counter
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
  
}

module.exports.TodoApp = TodoApp;
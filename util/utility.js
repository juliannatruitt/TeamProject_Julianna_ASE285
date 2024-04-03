const util = require('./mongodbutil.js');

class TodoApp {
  constructor(uri, database, posts, counter) {
    this.uri = uri
    this.database = database
    this.posts = posts
    this.counter = counter
  }
  /*
    Warning: this code has a bug
    Read runDeleteDelete comment.
  */
  async runAddPost(req, resp) {
    try {
      let query = {name : 'Total Post'};
      let res = await util.read(this.uri, this.database, this.counter, query)
      let latestIdNumber = 0;
      if (res.length != 0) {
        latestIdNumber = res[0].latestIdNumber;
        console.log(res);
      } else {
        query = { name : 'Total Post', totalPost : 0, latestIdNumber : 0};
        await util.create(this.uri, this.database, this.counter, query);
      }
      
      //given that the user enter date in YYYY-MM-DD format!!
      let stored_date = new Date(req.body.date);

      query = { _id : latestIdNumber + 1, title : req.body.title, date : stored_date};
      res = await util.create(this.uri, this.database, this.posts, query);
      let newTotal = await util.read(this.uri, this.database, this.posts, {});
      
      query = {name : 'Total Post'};
      const stage = {$inc: { latestIdNumber: 1}, $set: { totalPost: newTotal.length}};
      await util.update(this.uri, this.database, this.counter, query, stage);
      this.runListGet(req, resp);
    } catch (e) {
      console.error(e);
      resp.status(500).render('error.ejs', {error: error.message});
    }
  }
  async runListGet(req, resp) {
      try {
        let res = await util.read(this.uri, this.database, this.posts, {}) // {} query returns all documents
        if (res.length == 0) {
          resp.redirect('/');
        } else {
          const query = { posts: res };
          resp.render('list.ejs', query);
        }   
      } catch (e) {
        console.error(e);
        resp.status(500).render('error.ejs', {error: error.message});
      } 
  }
  /*
    Warning: this code has a bug.
  
    When the post is deleted, totalPost is decreased by 1.
    For example, when we have 3 posts, with id 1,2,3 and the post 1 is deleted, the posts have ids 2,3, and totalPost will be 2.
    So, the new post will have the id 3 (totalPost + 1) and this is not OK because we have two posts with the same id.
    The solution is to make another variable in the counter collection to keep track of the latest post.
    In the example, the latestIdNumber will be the 4 and it is updated only by the runAddPost method, not runDeleteDelete method.
    and use the totalPost to track the total number of the count. 
    It is a good idea to get the real total count from the posts collection (using the API such as collection.countDocuments({})), not adding or deleting one from the totalCount. 
  */
  async runDeleteDelete(req, resp) {
    try {
      req.body._id = parseInt(req.body._id); // the body._id is stored in string, so change it into an int value
      console.log(req.body._id);
      await util.delete_document(this.uri, this.database, this.posts, req.body);
      let newTotal = await util.read(this.uri, this.database, this.posts, {});

      const query = {name : 'Total Post'};
      const stage = {$set: {totalPost: newTotal.length}};
      await util.update(this.uri, this.database, this.counter, query, stage);

      const listquery = { posts: newTotal };
      this.runListGet(req, resp);
    }
    catch (e) {
      console.error(e);
      resp.status(500).render('error.ejs', {error: error.message});
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
        resp.status(404).render('not_found.ejs');
      }
    }
    catch (error) {
        console.log(error)
        resp.status(500).render('error.ejs', {error: error.message});
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
      resp.status(500).render('error.ejs', {error: error.message});
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
        resp.status(404).render('not_found.ejs');
      }
    }
    catch (error) {
      console.log(error)
      resp.status(500).render('error.ejs', {error: error.message});
    }
  }

async runJsonGet(req, resp) {
  try{
    let res = await util.read(this.uri, this.database, this.posts, {});
    if (res != null && res.length > 0) {
      let fulldocument = [];
      for (let i=0; i<res.length; i++){
        let _id = res[i]._id
        let title = res[i].title;
        let date = res[i].date;
        fulldocument.push({_id, title, date});
      }
      console.log(JSON.stringify(fulldocument));
      resp.render('jsonlist.ejs', {fulldocument});
    }
    else {
      resp.status(302).redirect('/');
  }
  }
  catch (error){
    console.log(error)
    resp.status(500).render('error.ejs', {error: error.message});
    }
  }

  async runCalendarGet(req, res){
    try{
      let allTasks = await util.read(this.uri, this.database, this.posts, {});
      res.render('calendar.ejs', {allTasks});
    }
    catch (e){
      console.error(e);
    }
  }

  async updateCompletionStatus(req, resp) {
    let id = parseInt(req.body.postId);
    let post = await util.read(this.uri, this.database, this.posts, { _id: id });

    if (!post || post.length === 0) {
        throw new Error(`Post with ID ${id} not found.`);
    }

    let currentCompletionStatus = post[0].completed;
    let newCompletionStatus = !currentCompletionStatus;

    let query = { _id: id };
    let update = { $set: { completed: newCompletionStatus } };

    try {
        let res = await util.update(this.uri, this.database, this.posts, query, update);
        console.log(`Completion status toggled for ID: ${id}. New status: ${newCompletionStatus}`);
        resp.json({ completed: newCompletionStatus });
    } catch (error) {
        console.error(error);
        throw new Error(`Error updating completion status: ${error.message}`);
    }
  }

}

module.exports.TodoApp = TodoApp;
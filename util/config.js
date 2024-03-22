const ID='bryanta21'; 
const PASSWORD = 'aLCcEEys3OnKIwQA'; 
const NET='cluster0.thal4vj.mongodb.net'; 

// Connection URI
const URI = `mongodb+srv://${ID}:${PASSWORD}@${NET}/?retryWrites=true&w=majority`

module.exports.URI = URI
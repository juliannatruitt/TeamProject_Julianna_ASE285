const ID='truittj3'; 
const PASSWORD = 'Mongodb'; 
const NET='cluster0.hsm2bil.mongodb.net'; 

// Connection URI
const URI = `mongodb+srv://${ID}:${PASSWORD}@${NET}/?retryWrites=true&w=majority`

module.exports.URI = URI
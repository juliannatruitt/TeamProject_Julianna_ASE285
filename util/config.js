const ID='bryanta21'; 
const PASSWORD = 'jy9yI2wvC01b17gu'; 
const NET='cluster0.zbk5ckx.mongodb.net'; 

// Connection URI
const URI = `mongodb+srv://${ID}:${PASSWORD}@${NET}/?retryWrites=true&w=majority`

module.exports.URI = URI
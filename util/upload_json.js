const {URI} = require('./_config.js');
const util = require('./mongodbutil0.js')
const { argv } = require('node:process');

const DATABASE = argv[2];  
const COLLECTION = argv[3];
const JSONFILENAME = argv[4];

// Call the function to remove all documents
(async () => {
  let res = util.readJSON(JSONFILENAME);
  console.log(res);
  await util.uploadJSON(URI, DATABASE, COLLECTION, JSONFILENAME);
})();
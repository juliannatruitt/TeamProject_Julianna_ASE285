const {URI} = require('./_config.js');
const util = require('./mongodbutil0.js');
const { argv } = require('node:process');

const DATABASE = argv[2]; 
const COLLECTION = argv[3]; 

// Call the function to remove all documents
util.removeAllDocuments(URI, DATABASE, COLLECTION);

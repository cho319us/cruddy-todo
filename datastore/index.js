const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');

var items = {};

// Public API - Fix these CRUD functions ///////////////////////////////////////
//data
exports.create = (text, callback) => {
  // invoke getNextUniqueId to generate a new unique id
  counter.getNextUniqueId((err, uniqueid) => {
    // create a path with the unique id inside the data directory
    var newPath = path.join(exports.dataDir, `${uniqueid}.txt`);
    // write file with the input text to the path
    fs.writeFile(newPath, text, (err) => {
      if (err) {
        callback(err);
      } else {
        callback(null, {id: uniqueid, text: text});
      }
    });
  });
};

exports.readAll = (callback) => {
  // invoke fs.readdir to read contents of directory;
  fs.readdir(exports.dataDir, (err, files) => {
    // case for err
    if (err) {
      // pass err to callback
      callback(err);
    // case for success
    } else {
      // iterate over the files array from readdir
      var mappedFiles = files.map(file => {
        // for each file, retrieve uniqueId (slice)
        var uniqueId = file.slice(0, 5);
        // return object literal with id and text equal to uniqueId
        return {id: uniqueId, text: uniqueId};
      });
      // pass mapped data to callback
      callback(null, mappedFiles);
    }
  });
};

exports.readOne = (id, callback) => {
  var text = items[id];
  if (!text) {
    callback(new Error(`No item with id: ${id}`));
  } else {
    callback(null, { id, text });
  }
};

exports.update = (id, text, callback) => {
  var item = items[id];
  if (!item) {
    callback(new Error(`No item with id: ${id}`));
  } else {
    items[id] = text;
    callback(null, { id, text });
  }
};

exports.delete = (id, callback) => {
  var item = items[id];
  delete items[id];
  if (!item) {
    // report an error if item not found
    callback(new Error(`No item with id: ${id}`));
  } else {
    callback();
  }
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');
// exports.dataDir is equal to /hrsf129-cruddy-todo/datastore/data

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};

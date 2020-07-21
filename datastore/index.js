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
  // get the path of the file with the given id
  var newPath = path.join(exports.dataDir, `${id}.txt`);
  // invoke fs.readFile to read contents of file with give id;
  // Note => fileContents we get from readFile are a Buffer
  fs.readFile(newPath, (err, fileContents) => {
    // check if err
    if (err) {
      // invoke callback with err
      callback(err);
    // otherwise
    } else {
      // create an object containing the given id and file contents
      var contentsObj = {id: id, text: fileContents.toString()};
      // pass null and object to callback
      callback(null, contentsObj);
    }
  });
};

exports.update = (id, text, callback) => {
  // get the path of the file with the given id
  var newPath = path.join(exports.dataDir, `${id}.txt`);
  // invoke fs.readFile to check if the file with input id exist
  fs.readFile(newPath, (err) => {
    // check if err (file on the newPath does not exist)
    if (err) {
      // invoke callback with err
      callback(err);
    // otherwise
    } else {
      // invoke fs.writeFile with path to file with input id and input text
      fs.writeFile(newPath, text, (err) => {
        // case for error
        if (err) {
          // pass error to callback
          callback(err);
        // case for success
        } else {
          // create a new object with input id and input text
          var contentsObj = {id: id, text: text};
          // pass the updated object to the callback
          callback(null, contentsObj);
        }
      });
    }
  });
};

exports.delete = (id, callback) => {
  // get the path of the file with the given id
  var newPath = path.join(exports.dataDir, `${id}.txt`);
  // invoke fs.unlink to delete file on the path
  fs.unlink(newPath, (err) => {
    // case for error
    if (err) {
      // pass error to callback
      callback(err);
    } else {
      callback(null);
    }
  });
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');
// exports.dataDir is equal to /hrsf129-cruddy-todo/datastore/data

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};

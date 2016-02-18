'use strict';
var exec_sync = require('./exec_sync');
// we can't use node's execSync because its only available in v.0.12+ ...

/**
 * zip does exactly what you expect: zip the /dist directory ready for prod
 * your lambda function.
 * @param {String} dist_path - the path to your /dist directory where you
 * want the prod node_modules to be installed for packaging
 */
function zip(zip_file_name, dist_path) {
  var start = process.cwd();            // get current working directory
  process.chdir(dist_path);             // change to /dist directory
  var cmd = 'npm install --production'; // install only production node_modules
  exec_sync(cmd);                       // execute command synchronously
  process.chdir(start);                 // change back to original directory
  return;
}

module.exports = install_node_modules;
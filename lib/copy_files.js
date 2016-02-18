var fs   = require('fs');
var path = require('path');
var mkdir_sync = require('./mkdir_sync');
var utils = require('./utils');

/**
 * copy_files copies the desired files & folders into the destination directory
 * @param {Array} file_list - the list of files & folders to be copied over
 * @param {String} destination - the path to the /dist directory (optional)
 */
function copy_files(file_list, destination) {
  // console.log('file_list : ', file_list);
  destination = destination || process.env.TMPDIR + 'dist/';
  mkdir_sync(destination); // ensure that the /dist directory exists

  var base_path = utils.get_base_path();
  // console.log('base_path : ',base_path);
  file_list.forEach(function(file_path){
    // console.log('file_path:', file_path);
    var fd = base_path + file_path;
    // console.log('fd:', fd);
    var stat = fs.statSync(fd);
    // console.log(stat);
    if (stat && stat.isFile()) {
      // console.log(fd, ' is a file!')
      var dest = destination + fd.replace(base_path,'');
      // console.log('COPYING', fd, ' TO: ', dest);
      fs.writeFileSync(dest, fs.readFileSync(fd)); // sync everywhere!!
    }
    else { // is a directory
      // console.log('DIRECTORY:', fd);
       // create the destination directory so we can put files into it
      var dir = fd.replace(base_path,''); // directory path excluding base_path
      var dest_dir = destination + dir
      // console.log('CREATING:', dest_dir);
      mkdir_sync(dest_dir); // create the file before attempting to copy to it
      // read the list of files in the directory we want to copy
      var files = fs.readdirSync(fd);
      var filepaths = files.map(function(f){return dir + f; });
      copy_files(filepaths, destination); // recurse
    }
  });
  return;
}

module.exports = copy_files;
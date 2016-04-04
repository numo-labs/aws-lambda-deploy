'use strict';
var assert = require('assert');
var fs = require('fs');
var path = require('path');
var utils = require('../lib/utils');
var base_path = utils.get_base_path();
var copy_files = require('../lib/copy_files');
var install_node_modules = require('../lib/install_node_modules');
var pkg = require(base_path + 'package.json');
var zip = require('../lib/zip');

describe('zip', function () {
  it('zip the /dist directory', function (done) {
    // console.log('helllo');
    copy_files(); // setup /dist
    // console.log('copy_files ...')
    // require('./dont_install_babel_in_prod.js')(); // don't install 200mb of Babel!!
    install_node_modules();
    var zip_file_path = path.normalize(process.env.TMPDIR + pkg.name + '.zip');
    // console.log('>> zip_file_path', zip_file_path)
    zip();
    var stat = fs.statSync(zip_file_path);
    assert(stat.size > 1000000); // the zip is bigger than a megabyte!
    done();
  });

  it(' unzip the package and confirm the package.json is intact', function (done) {
    zip.unzip();
    var unzipped = path.normalize(process.env.TMPDIR + 'unzipped');
    // console.log('unzipped:', unzipped);
    var unzipped_utils = require(path.normalize(unzipped + '/lib/utils'));
    assert.equal(JSON.stringify(utils), JSON.stringify(unzipped_utils));
    utils.delete_dir_contents(unzipped, true);   // delete unzipped completely
    utils.clean_up();
    done();
  });
});

'use strict';
// TODO make fullpath to create needed directories

var testImageHelper   = require('../lib/imageHelper.js');
var fs                = require('fs');
var uploader          = require('../lib/uploader.js');

var testMainPath = './test';

var fs = require('fs');
var deleteFolderRecursive = function(path) {
  if( fs.existsSync(path) ) {
    fs.readdirSync(path).forEach(function(file){
      var curPath = path + '/' + file;
      if(fs.lstatSync(curPath).isDirectory()) { // recurse
        deleteFolderRecursive(curPath);
      } else { // delete file
        fs.unlinkSync(curPath);
      }
    });
    fs.rmdirSync(path);
  }
};

after('clean up', function() {
  deleteFolderRecursive(testMainPath + '/editImageTestFiles/imagesWithPrice');
  deleteFolderRecursive(testMainPath + '/raw');
  deleteFolderRecursive(testMainPath + '/bars');
});
describe('#downloadImage', function () {
  it('should download image', function (done) {
    testImageHelper.downloadImage({
      url: 'http://cdn.biedronka.pl/__2017/T09A/twoja_piekna_kuchnia_oferta/pojemniki_infinity_9_99_2x2.jpg',
      headers: {
        'User-Agent': 'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:51.0) Gecko/20100101 Firefox/51.0',
        'Referer': 'http://www.biedronka.pl/pl',
        'Content-Type': 'image/jpeg'
      }
    },
    './test/raw/downloadTestImage.jpg', done);
  });
});

describe('#createRectangle', function () {
  it('should create resized bar from asset yellow.png', function (done) {
    testImageHelper.createRectangle('./test/bars/yellowBar.png', done);
  });
});

describe('#editImages', function () {
  it('should print given bar on given image with given price on the bar and save it', function (done) {
    testImageHelper.editImages('./test/editImageTestFiles/raw', './test/editImageTestFiles/bars/yellowBar.png','./test/editImageTestFiles', 0, ['12,99 pln'], done);
  });
});

describe('#uploader', function () {
  this.timeout(6000);
  it('should upload images from given directory to cloud', function (done) {
    uploader.cloudUpload('./test/editImageTestFiles/raw', function () {
      done();
    });
  });
});

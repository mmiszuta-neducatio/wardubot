'use strict';

var    testData  = require('../lib/downloadImage.js');
var    fs        = require('fs');

describe('#downloadImage', function () {
  var imagePath = './tests/testImage.jpg';
  it('should download image with content-type: image/jpeg', function (done) {
    testData.downloadImage({
      url: 'http://cdn.biedronka.pl/__2017/T09A/twoja_piekna_kuchnia_oferta/pojemniki_infinity_9_99_2x2.jpg',
      headers: {
        'User-Agent': 'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:51.0) Gecko/20100101 Firefox/51.0',
        'Referer': 'http://www.biedronka.pl/pl',
        'Content-Type': 'image/jpeg'
      }
    },
    imagePath, function () {
      fs.stat(imagePath, function (err) {
        if (err) {
          return done(err);
        }
        done();
      });
    });
  });
});

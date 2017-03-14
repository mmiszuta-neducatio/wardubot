'use strict';

var async     = require('async');
var reqHelper = require('../modules/asyncRequestHelper.js');

module.exports = {
  updateForSlack: function () {
    async.waterfall([function (cb) {
        console.log('waterfall 1');
        //preparationRequest callback returns array of links to promotions on biedronka.pl
        reqHelper.preparationRequest(cb);
      },
      function (promoLinks, cb) {
        console.log('waterfall 2');
        //mainRequest callback returns array of links to every discounted product on biedronka.pl
        reqHelper.mainRequest(promoLinks[0], cb);
      }
    ], function () {
      console.log('files were edited and uploaded');
    });
  }
};

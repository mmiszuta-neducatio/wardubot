/*jslint node: true */
"use strict";

var async     = require("async");
var reqHelper = require("./modules/asyncRequestHelper.js");

async.waterfall([function(cb){
  reqHelper.preparationRequest(cb);
},
function(promoLinks, cb){
  reqHelper.mainRequest(promoLinks[0], cb);
}]);

/*jslint node: true */
"use strict";

var async     = require("async");
var reqHelper = require("./modules/asyncRequestHelper.js");

async.waterfall([function(cb){
  //preparationRequest callback returns array of links to promotions on biedronka.pl
  reqHelper.preparationRequest(cb);
},
function(promoLinks, cb){
  //mainRequest callback returns array of links to every discounted product on biedronka.pl
  reqHelper.mainRequest(promoLinks[0], cb);
},
function(productsLinks, cb){
  //zawrzeć tutaj funkcję, która będzie zawierać: wrzucenie na hosting, usunięcie wrzuconych, wysłanie linków obrazków na slacka,
  //wysłanie linków do produktów pod obrazkami na slacka, usunięcie wrzuconych linków do produktów z arraya
}]);

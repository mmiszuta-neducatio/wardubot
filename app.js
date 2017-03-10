'use strict';

var data      = require('./lib/data-download.js');
var wardubot  = require('./lib/wardubot.js');


data.updateForSlack();

setTimeout(function(){
  wardubot.sendMessages();
}, 50000)

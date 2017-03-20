/*jslint node: true */
'use strict';

module.exports = {
  getAttribute: function($, needle, needleAttr){
    var arrayOfAttributes = [];
    needle.each(function(index, value){
      arrayOfAttributes.push($(value).attr(needleAttr));
    });
    return arrayOfAttributes;
  },
  getText: function($, needle){
    var arrayOfAttributes = [];
    needle.each(function(index, value){
      arrayOfAttributes.push($(value).text());
    });
    return arrayOfAttributes;
  }
};



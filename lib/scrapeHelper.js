/*jslint node: true */
"use strict";

module.exports = {
  getAttribute: function(cheerioLoadedHtml, needle, needleAttr){
    var arrayOfAttributes = [];
    needle.each(function(index, value){
      arrayOfAttributes.push(cheerioLoadedHtml(value).attr(needleAttr));
    });
    return arrayOfAttributes;
  },
  getText: function(cheerioLoadedHtml, needle){
    var arrayOfAttributes = [];
    needle.each(function(index, value){
      arrayOfAttributes.push(cheerioLoadedHtml(value).text());
    });
    return arrayOfAttributes;
  }
};

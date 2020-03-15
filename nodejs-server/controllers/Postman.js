'use strict';

var utils = require('../utils/writer.js');
var Postman = require('../service/PostmanService');

module.exports.executeCollection = function executeCollection (req, res, next) {
  var body = req.swagger.params['body'].value;
  Postman.executeCollection(body)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

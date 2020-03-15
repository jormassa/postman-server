'use strict';


/**
 * Executes the postman collection
 * 
 *
 * body CollectionExecutionRequest Postman object (optional)
 * returns collectionExecuteResponse
 **/
exports.executeCollection = function(body) {
  return new Promise(function(resolve, reject) {
    var examples = {};
    examples['application/json'] = {
  "result" : "OK",
  "execution-summary" : "{}",
  "execution-details" : "{}"
};
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
  });
}


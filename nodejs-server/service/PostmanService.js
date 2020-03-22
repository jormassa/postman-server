'use strict';

var winston = require('winston');
const newman = require('newman');


const logger = winston.createLogger({
  level: 'info',
  format: winston.format.simple(),
  transports: [
    new winston.transports.Console()
  ]
});


function parseResult(summary) {
  var result="KO";
  if (summary['run']['failures'].length==0 && summary['run']['error']==null) {
    result="OK";
  } else {
    logger.info("Error found in the execution: ");
    logger.info("summary['run']['failures'] : " + summary['run']['failures']);
    logger.info("summary['run']['error'] : " + summary['run']['error']);
  }
  logger.info("parseResult: " + result);
  return result;
}

function parseExecutionSummary(summary) {
  var result = {};
  logger.info("summary type: " + Object.prototype.toString.call(summary));
  var summary_collection=summary["collection"];
  logger.info("Printing keys in summary_collection:");
  for(var myKey in summary_collection) {
    console.log("key:"+myKey);
  }
  
  //result["name"]=summary_collection;
  logger.info("parseExecutionSummary:" + JSON.stringify(summary_collection,null,2));
  return result;
}

function parseExecutionDetails(summary) {
  var result = {};
  logger.info("parseExecutionDetails:" + JSON.stringify(result,null,2));
  return result;
}

/**
 * Executes the postman collection
 * 
 *
 * body CollectionExecutionRequest Postman object (optional)
 * returns collectionExecuteResponse
 **/
exports.executeCollection = function(body) {
  // Decoding the input 
  logger.info("=======================================================");
  logger.info("execute collections API executed");
  var body_collection_json={};
  var body_environment_json={};
  var body_globals_json={};
  if (Buffer.from(body.collection, 'base64').length>0) {
    var body_collection = Buffer.from(body.collection, 'base64').toString('ascii');
    logger.info("Collection: " + body_collection);
    body_collection_json=JSON.parse(body_collection);
    logger.info("Collection as JSON: " + body_collection_json);
  }
  if (Buffer.from(body.environment, 'base64').length>0) {
    var body_environment = Buffer.from(body.environment, 'base64').toString('ascii');
    logger.info("Environment: " + body_environment);
    body_environment_json=JSON.parse(body_environment);
    logger.info("Environment as JSON: " + body_environment_json);
  }
  if (Buffer.from(body.globals, 'base64').length>0) {
    var body_globals = Buffer.from(body.globals, 'base64').toString('ascii');
    logger.info("Globals: " + body_globals);
    body_globals_json=JSON.parse(body_globals);
    logger.info("Globals as JSON: " + body_enbody_globals_jsonvironment_json);
  }


  // Here we do the async call and when returning, the complete the resolve
  logger.info("I am about to execute the collection...");
  var collectionExecution = newman.run({
    collection: body_collection_json,
    globals: body_globals_json,
    environment: body_environment_json,
    reporters: 'json',
    timeout: 10000
  }).on('start', function (err, args) { // on start of run, log to console
      logger.info('running the collection...');
  }).on('done', function (err, summary) {
      if (err || summary.error) {
          logger.error('collection run encountered an error.');
      }
      else {
          logger.info('collection run completed.');

      }
  });



  var endingPromise = new Promise(function(resolve, reject) {
    var examples = {};
    examples['application/json'] = {
      "result" : "OK",
      "execution-summary" : "{}",
      "execution-details" : "{}"
    };

    collectionExecution.on('done', function (err, summary) { // on start of run, log to console
      logger.info("Finishing...");
      //logger.info("summary: " + JSON.stringify(summary,null,2));
      examples['application/json'] = {
        "result" : parseResult(summary),
        "execution-summary" : parseExecutionSummary(summary),
        "execution-details" : parseExecutionDetails(summary)
      };
      logger.info("Result:" + examples);
      resolve(examples[Object.keys(examples)[0]]);
    });

  });

  return endingPromise;
}


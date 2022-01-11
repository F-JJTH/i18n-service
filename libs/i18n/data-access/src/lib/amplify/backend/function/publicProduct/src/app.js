/*
Copyright 2017 - 2017 Amazon.com, Inc. or its affiliates. All Rights Reserved.
Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with the License. A copy of the License is located at
    http://aws.amazon.com/apache2.0/
or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and limitations under the License.
*/


/* Amplify Params - DO NOT EDIT
	ENV
	REGION
	STORAGE_I18NTRANSLATIONS_BUCKETNAME
Amplify Params - DO NOT EDIT */

var express = require('express')
var bodyParser = require('body-parser')
var awsServerlessExpressMiddleware = require('aws-serverless-express/middleware')

var AWS = require('aws-sdk')
const s3 = new AWS.S3({ apiVersion: '2006-03-01' });
// declare a new express app
var app = express()
app.use(bodyParser.json())
app.use(awsServerlessExpressMiddleware.eventContext())

// Enable CORS for all methods
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*")
  res.header("Access-Control-Allow-Headers", "*")
  next()
});


/**********************
 * Example get method *
 **********************/

app.get('/public/product/:id/:env/languages', function(req, res, next) {
  const productId = req.params.id
  const env = req.params.env
  if (!productId || !env) {
    const err = new Error('product id and env is required');
    err.statusCode = 400;
    return next(err);
  }

  const params = {
    Bucket: process.env.STORAGE_I18NTRANSLATIONS_BUCKETNAME,
    Prefix: `public/${productId}/${env}/`
  }
  s3.listObjects(params, function (err, data) {
    if(err) {
      err.statusCode = 500;
      return next(err);
    }

    const languages = data.Contents.map(content => content.Key.split('/').pop().replace('.json', ''))
    res.json(languages);
  })
});

app.get('/public/product/:id/:env/translation/:code', function(req, res, next) {
  const productId = req.params.id
  const env = req.params.env
  const code = req.params.code
  if (!productId || !env || !code) {
    const err = new Error('product id, env and code are required');
    err.statusCode = 400;
    return next(err);
  }

  const params = {
    Bucket: process.env.STORAGE_I18NTRANSLATIONS_BUCKETNAME,
    Key: `public/${productId}/${env}/${code}.json`
  }
  s3.getObject(params, function (err, data) {
    if(err) {
      err.statusCode = 500;
      return next(err);
    }

    res.json(data.Body.toString('utf-8'));
  })
});

app.listen(3000, function() {
    console.log("App started")
});

// Export the app object. When executing the application local this does nothing. However,
// to port it to AWS Lambda we will create a wrapper around that will load the app from
// this file
module.exports = app

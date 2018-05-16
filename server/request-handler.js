/*************************************************************

You should implement your request handler function in this file.

requestHandler is already getting passed to http.createServer()
in basic-server.js, but it won't work as is.

You'll have to figure out a way to export this function from
this file and include it in basic-server.js so that it actually works.

*Hint* Check out the node module documentation at http://nodejs.org/api/modules.html.

**************************************************************/
var defaultCorsHeaders = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'access-control-allow-headers': 'content-type, accept',
  'access-control-max-age': 10 // Seconds.
};

let results = {
  results: [{
    username: 'Holly',
    roomname: 'lobby',
    text: 'this is a first message'
  }]
};
const path = require('path');
const fs = require('fs');

var requestHandler = function(request, response) {

  console.log('Serving request type ' + request.method + ' for url ' + request.url);

  let statusCode = 200;
  let headers = defaultCorsHeaders;
  headers['Content-Type'] = 'application/json';

  if (!request.url.includes('/classes/messages')) {
    statusCode = 404;
    response.writeHead(statusCode, headers);
    response.end();
  } 
    var filePath = path.join(__dirname, '../client/index.html');
    fs.readFile(filePath, function(err, html) {
     
    // if (request.url === 'http://127.0.0.1:3000/classes/messages') {
    //   var filePath = path.join(__dirname, '../client/index.html');
    //   fs.readFileSync(filePath, function(err, html) {
    //   if(err) {
    //     console.log('error' + html);
    //     throw err;
    //   } else {
    //   response.writeHead(200, 'UTF-8', {'Content-Type': 'text/ html'});
    //   console.log(html + 'is here');
    //   response.end(html);
    //   };
    // });
    
    if (request.method === 'OPTIONS') {
      // console.log(this);
      response.writeHead(200, headers);
      response.end();
    }

    if (request.method === 'GET') {
      response.writeHead(statusCode, headers);
      console.log('i think we are returning this')
      response.end(JSON.stringify(results));
    }

    if (request.method === 'POST') {
      statusCode = 201;

      let mailbox = '';
      request.on('data', (data) => {
        mailbox += data;
      }).on('end', () => {
        results.results.push(JSON.parse(mailbox));
      });
      response.writeHead(statusCode, headers);
      response.end(JSON.stringify(results));
      }
    });
}


exports.requestHandler = requestHandler;
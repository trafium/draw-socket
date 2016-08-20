var http = require('http');
var fs = require('fs');
var path = require('path');
var url = require('url');
var mime = require('mime');


var server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;
  const query  = parsedUrl.query;

  switch (req.method) {
    case 'GET': {
      switch (pathname) {
        case '/': {
          serveStatic('/index.html', res);
          break;
        }
        default: {
          serveStatic(pathname, res);
        }
      }
      break;
    }
  }
}).listen(process.env.PORT || 8080);
require('./lib/socket.js')(server);

function serveStatic(pathname, res) {
  fs.exists('./public' + pathname, (exists) => {
    if (!exists) {
      console.log('File ' + pathname + ' does not exist.');
      return send404(res);
    } else {
      var type = mime.lookup(pathname);
      res.writeHead(200, { 'Content-Type': type });
      fs.createReadStream('./public' + pathname).pipe(res);
    }
  });
};

function send404(res) {
  res.writeHead(404, { 'Content-Type': 'text/plain' });
  res.end('404: Requested file not found.');
}
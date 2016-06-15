// 8test
// Developed by Kosmas Papadatos
//
// No server was specified for the back end so I wrote this little script.
// Rewrites and anything else in here can be achieved in Apache's .htaccess
// or any other server's config files.
"use strict";

// A couple of things we'll need
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const http = require('http');
const exec = require('child_process').exec;
const chalk = require('chalk');
const minimist = require('minimist');

global.opts = minimist(process.argv);

var server;

// ...
// Omitting compression and caching routes
// as well as minifying/uglifying client code and usual gulp tasks.
app.use(bodyParser.urlencoded({extended: true}));

app.param('call', (req, res, next, value) => {
  if(~[
    // List of accepted calls
    'search'
  ].indexOf(value))
    next();
  else
    res.end('Not today.');
});

// Serve php
app.all('/', (req, res) =>
  exec('php src/index.php', (err, stdout) => res.end(stdout)));

// Really awkward way to do this, but it will work for this example :D
app.post('/api/:call', (req, res) => {
  let postData = encodeURI(JSON.stringify(req.body));
  let configData = encodeURI(JSON.stringify(opts));

  let phpBootCode =
    `$_POST = (array)json_decode(rawurldecode('${postData}'));`+
    `$_CONFIG = (array)json_decode(rawurldecode('${configData}'));`+
    `require('src/${req.params.call}.php');`

  // Don't freak out, call can only be an allowed file name
  exec(`php -r "${phpBootCode}"`,
    (err, stdout) => res.end(stdout));
});

app.use(express.static('./static'));

server = http.createServer(app).listen(opts.p, opts.h);

server.on('listening', () => !opts.noout && console.log(`${chalk.cyan('8test')} server up.`));

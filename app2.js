// a trivial process that does nothing except
// trigger GC and output the present base memory
// usage every second.  this example is intended to
// demonstrate that memwatch itself does not leak.

var http = require('http');
var heapdump = require('heapdump');
var _ = require('underscore');

var start = new Date();
function msFromStart() {
  return new Date() - start;
}

var leak = [];

// every second, this program "leaks" a little bit
setInterval(function() {
  if (global && global.gc){
    global.gc()
  }
  for (var i = 0; i < 10; i++) {
    //var str = i.toString() + " on a stick, short and stout!";
    //var str = new Array(1000).fill("hey").join(" ");
    // var str = _.reduce(_.range(100000),(acc,i) => { return _.extend(acc, {[i]:i})},{});
    var str = _.range(100000);
    var fn = makeFn(str);
    leak.push(fn);
  }
}, 1000);

function makeFn(what){
  return function(){
    return what;
  }
}

// meantime, the program is busy, doing *lots* of http requests
var http = require('http');
http.createServer(function (req, res) {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end('Hello World\n');
}).listen(1337, '127.0.0.1');

function doHTTPRequest() {
  var options = {
    host: '127.0.0.1',
    port: 1337,
    path: '/index.html'
  };

  http.get(options, function(res) {
    setTimeout(doHTTPRequest, 300);
  }).on('error', function(e) {
    console.info(e)
    setTimeout(doHTTPRequest, 300);
  });
}

doHTTPRequest();
doHTTPRequest();

var memwatch = require('memwatch-next');;

// report to console postgc heap size
memwatch.on('stats', function(d) {
  console.log("postgc:", msFromStart(), d.current_base);
});

// memwatch.on('leak', function(d) {
//   console.log("LEAK:", d);
// });

memwatch.on('leak', (info) => {
  console.error('Memory leak detected:\n', info);
  heapdump.writeSnapshot((err, filename) => {
    if (err) console.error(err);
    else console.error('Wrote snapshot: ' + filename);
  })
});

// also report periodic heap size (every 10s)
setInterval(function() {
  console.log("naive:", msFromStart(), process.memoryUsage().heapUsed);
}, 5000);
const http = require('http');
const memwatch = require('memwatch-next');

memwatch.on('leak', (info) => {
  console.error('Memory leak detected:\n', info);
});

memwatch.on('stats', function(stats) {console.info("Memory stats:\n ", stats)});

var server = http.createServer((req, res) => {
 for (var i=0; i<1000; i++) {
   server.on('request', function leakyfunc() {});
 }

 res.end('Hello World\n');
 console.info("I was hit at " + Date.now());
}).listen(8081, '127.0.0.1');
server.setMaxListeners(0);

console.log('Server running at http://127.0.0.1:8081/. Process PID: ', process.pid);
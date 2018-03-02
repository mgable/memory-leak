const memwatch = require('memwatch-next');
const heapdump = require('heapdump');
var foo,
	arr = [];

memwatch.on('leak', (info) => {
  console.error('Memory leak detected:\n', info);
});

memwatch.on('stats', function(stats) {console.info("Memory stats:\n ", stats)});


function _write(){
	heapdump.writeSnapshot((err, filename) => {
		if (err) console.error(err);
		else console.error('Wrote snapshot: ' + filename);
	});
}

foo = "Xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx";


for (var i = 0; i < (foo.length - 1); i++){
	let thisIsALongVaribaleName = foo.slice(i,i + 1)
	arr.push (thisIsALongVaribaleName )
}

console.info(arr);

_write();
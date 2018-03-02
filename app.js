const memwatch = require('memwatch-next');

memwatch.on('leak', (info) => {
  console.error('Memory leak detected:\n', info);
});

memwatch.on('stats', function(stats) {console.info("Memory stats:\n ", stats)});

function LeakingClass() {}

var leaks = [],
	counter = 0,
	limit = 100;

//function doIt(){
	setInterval(function() {
		if (global && global.gc){
			global.gc()
		}
	  for (var i = 0; i < 100; i++) {
	    leaks.push(function LeakingClass() {});
	  }

	  console.error('Leaks: %d', leaks.length);
	  // if (counter++ < limit){
	  // 	doIt()
	  // }
	}, 1000);
//}

//doIt()
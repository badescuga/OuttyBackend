function sleep(duration) {
  return new Promise(function(resolve, reject) {
    setTimeout(()=> { resolve(0) }, duration);
  })
}

async function method() {
	console.log('a');
	await sleep(2000);
	console.log('b');
};

method();
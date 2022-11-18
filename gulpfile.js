const {
	task, 
	watch, 
	src, 
	dest,
	series
} = require('gulp');

const nodemon = require('gulp-nodemon');
const esbuild = require('gulp-esbuild');

task('build:server', () => {
    return src('src/index.ts')
		.pipe(esbuild({
			bundle: true,
			platform: 'node',
			logLevel: 'info'
		}))
		.pipe(dest('./dist'))
});

task('dev', series('build:server', () => {
	const stream = nodemon({
		script: './dist/index.js',
		watch: './dist/**/*',
		quiet: true,
		ext: 'js'
	});

	let firstStart = true;
	stream
		.on('start', function () {
			if(firstStart) console.log('\u001b[1;32m● Watcher is started\u001b[0m');
			firstStart = false;
		}).on('restart', function (files) {
			console.log('\u001b[1;33m● Application is reloaded\u001b[0m');
		});

	watch('./src/**/*', series('build:server'));
}));
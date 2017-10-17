// Include gulp
var gulp = require('gulp');
var exec = require('sync-exec');
var util = require('gulp-util');
var argv = require('yargs').argv;

// Push Task
gulp.task('push', function() {
	util.log('Pushing to SFDX...');
	result = exec('sfdx force:source:push');
	util.log(result.stdout);
});

// Watch Files For Changes
gulp.task('watch', function() {
	result = exec('sfdx force:source:pull');
	util.log(result.stdout);
    gulp.watch('**/*.*', ['push']);
});

// Deploy
gulp.task('deploy', function(){
	//Get a org parameter
	if( !argv.help === undefined ) {
		util.log('USAGE: gulp deploy [-u orgname]');
		return;
	}
	if( argv.u != undefined ) {
		var org = argv.u;
	}

	var timestamp = Date.now();
	util.log('Starting deploy...');
	result = exec('sfdx force:source:pull');
	util.log(result.stdout);

	result = exec('mkdir mdapi_output');
	result = exec('mkdir mdapi_output/' + org + timestamp);

	result = exec('sfdx force:source:convert -d mdapi_output/' + org + timestamp);
	util.log(result.stdout);

	if(org === undefined) {
		result = exec ('sfdx force:mdapi:deploy -d mdapi_output/' + org + timestamp);
		util.log(result.stdout);
	} else {
		result = exec ('sfdx force:mdapi:deploy --wait 1 -d mdapi_output/' + org + timestamp + ' -u "'+ org +'" ');
		util.log(result.stdout);
	}
});

// Default Task
gulp.task('default', ['push', 'watch']);
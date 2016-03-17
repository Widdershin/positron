#! /usr/bin/env node
var process = require('process');
var fs = require('fs-extra');
var argv = require('minimist')(process.argv.slice(2));
var path = require('path');
var tmp = require('tmp');
var ncp = require('ncp');
var spawn = require('child_process').spawn;

var currentWorkingDirectory = process.cwd();
var filesToCopy = argv._;
var apkOutputFile = argv.o || path.join(currentWorkingDirectory, 'app.apk');

var positronRoot = path.join(__dirname, '..');

tmp.dir({keep: true}, function (err, tempPath, cleanup) {
  if (err) throw err;

  ncp(path.join(positronRoot, 'boilerplate'), tempPath, function (err) {
    if (err) throw err;

    filesToCopy.forEach(function (fileName) {
      fs.copySync(
        path.join(currentWorkingDirectory, fileName),
        path.join(tempPath, 'app', 'src', 'main', 'assets', fileName)
      );
    });

    var gradlew = spawn(path.join(tempPath, 'gradlew'), ['build'], {cwd: tempPath});

    console.log('Compiling apk...');

    gradlew.on('close', function () {
      fs.copySync(
        path.join(tempPath, 'app', 'build', 'outputs', 'apk', 'app-debug.apk'),
        apkOutputFile
      );

      console.log('Copied built apk to', apkOutputFile);
    });
  });
});

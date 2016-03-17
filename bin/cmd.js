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

var androidHome = process.env.ANDROID_HOME;

if (!androidHome) {
  if (process.platform === 'darwin') {
    androidHome = path.join(process.env.HOME, 'Library', 'Android', 'sdk');
  }

  if (!androidHome) {
    throw new Error('Please set ANDROID_HOME env var to the location of Android Studio');
  }
}

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

    var env = Object.assign({}, process.env, {ANDROID_HOME: androidHome});

    var gradlew = spawn(path.join(tempPath, 'gradlew'), ['build'], {cwd: tempPath, env: env});

    console.log('Compiling apk...');

    gradlew.stdout.on('data', function (data) {
      console.log(data.toString());
    });

    gradlew.stderr.on('data', function (data) {
      console.log(data.toString());
    });

    gradlew.on('close', function () {
      fs.copySync(
        path.join(tempPath, 'app', 'build', 'outputs', 'apk', 'app-debug.apk'),
        apkOutputFile
      );

      console.log('Copied built apk to', apkOutputFile);
    });
  });
});

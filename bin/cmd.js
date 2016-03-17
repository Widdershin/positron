#! /usr/bin/env node
var process = require('process');
var fs = require('fs-extra');
var argv = require('minimist')(process.argv.slice(2));
var path = require('path');
var tmp = require('tmp');
var ncp = require('ncp');
var uuid = require('node-uuid');
var childProcess = require('child_process');

var currentWorkingDirectory = process.cwd();
var filesToCopy = argv._;
var apkOutputFile = argv.o || path.join(currentWorkingDirectory, 'app.apk');
var newPackageName = argv.p || 'positron.random_' + Math.floor(Math.random()*100000)
var newTitle = argv.t || path.basename(currentWorkingDirectory);
var iconFile = argv.i || 'favicon.ico';

var positronRoot = path.join(__dirname, '..');

var androidHome = process.env.ANDROID_HOME;

if (!androidHome) {
  if (process.platform === 'darwin') {
    androidHome = path.join(process.env.HOME, 'Library', 'Android', 'sdk');
  }

  if (!androidHome) {
    throw new Error('Please set ANDROID_HOME env var to the location of Android SDK');
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

    var changeName = childProcess.execFile(path.join(positronRoot, "bin", "change-name.sh"), [newPackageName, newTitle, tempPath], function(err, stdout, stderr) {
      if (err) throw err;
      console.log(stdout.toString());
      console.log(stderr.toString());
    });

    try {
      fs.accessSync(iconFile);
      console.log("Copying icon file " + iconFile);
      ['hdpi', 'mdpi', 'xhdpi', 'xxhdpi', 'xxxhdpi'].forEach(function(type) {
        fs.copySync(iconFile, path.join(tempPath, 'app', 'src', 'main', 'res', 'mipmap-' + type, 'ic_launcher.png'));
      });
    } catch (err) {
    }

    var gradlew = childProcess.spawn(path.join(tempPath, 'gradlew'), ['-q', 'build'], {cwd: tempPath, env: env, stdio: 'inherit'});

    console.log('Compiling apk...');

    gradlew.on('close', function () {
      try {
        fs.accessSync(path.join(tempPath, 'app', 'build', 'outputs', 'apk', 'app-debug.apk'));
        fs.copySync(
          path.join(tempPath, 'app', 'build', 'outputs', 'apk', 'app-debug.apk'),
          apkOutputFile
        );

        console.log('Copied built apk to', apkOutputFile);
      } catch (err) {
      }
    });
  });
});

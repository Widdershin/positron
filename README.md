# positron
Compile your Javascript apps to Android

`positron` takes your static web apps and compiles them into a standalone Android app, ready to run on a phone.

Installation
---

First, make sure you have installed [Android Studio](https://developer.android.com/sdk/index.html#top) and you can run it.

Now, install `positron`.

```bash
$ npm install positron-cli -g
```

Usage
---

`positron` takes a list of files that should be included in the bundle and outputs an .apk to your current directory:

```bash
$ positron index.html bundle.js
$ adb install app.apk
```

You can even run `positron *` to include all files.

```bash
$ positron *
$ adb install app.apk
```

You can provide a title and package name for your app as well:
```bash
$ positron * -t 'ExampleApp' -p 'com.example.app'
$ adb install app.apk
```

For more info, run `positron --help`
```bash
$ positron --help
usage:
    positron [options] <filesToCompile>...

options:
    [-p <packageName>]   The name of the package. E.g: -p "com.example.app"
    [-t <appName>]       The name of the app. E.g: -p "ExampleApp"
    [-o <apkOutputPath>] The path to output the APK. By default, ./app.apk

```

How does it work?
---

`positron` works by taking a boilerplate Android app with just a single web view, then copying all your static assets in and compiling it. It's surprisingly simple but works well.

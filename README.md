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
Usage:
  positron [options] <path>...

Path is a series of pathnames to files to include in the html rendering.

Options:
  -h --help    Show this help screen
  -p <package> The name of the package. E.g: -p "comm.example.app"
  -t <title>   The name of the app. E.g: -p "ExampleApp". By default, the current directory name
  -o <path>    The path to output the APK. [default: ./app.apk]
```

How does it work?
---

`positron` works by taking a boilerplate Android app with just a single web view, then copying all your static assets in and compiling it. It's surprisingly simple but works well.

Why the name 'positron'?
---

`positron` was inspired by [Github's Electron](http://electron.atom.io/). Electron allows you to build native desktop apps using web technologies. `positron` allows you to build native apps for phones using web technologies. And according to Wikipedia, the opposite of an Electron is a Positron.

![positron](https://raw.githubusercontent.com/Widdershin/positron/master/boilerplate/app/src/main/res/mipmap-hdpi/ic_launcher.png)


'use strict';

const gulp = require('gulp')
const sourcemaps = require('gulp-sourcemaps')
const babel = require("gulp-babel")
const less = require('gulp-less')
const combiner = require('stream-combiner2');
const googleWebFonts = require('gulp-google-webfonts')
const git = require('gulp-git');
const electron = require('electron-connect').server.create({
  "remote-debugging-port": 9992
});

const config = { source: './src' }
config.js2015 = config.source + '/js-dist/'
config.jsNext = config.source + '/js/**/*.js*'
config.less = config.source + '/themes/default/less/**/*'
config.css = config.source + '/themes/default/css/'
config.fontsList = config.source + '/themes/googlefonts.list'
config.fontsDest = config.source + '/themes/google-fonts/'

/* Start Tasks */

gulp.task('default', ['production', 'compile-babel', 'compile-less', 'fonts', 'git-submodules']);

gulp.task('develop', ['set-dev-node-env', 'compile-babel', 'compile-less'], function () {
  electron.start(["--remote-debugging-port=9992"]) // Electron Connect, Auto Reload
  gulp.watch(config.less, ['compile-less', 'reloadLess']);
  gulp.watch(config.jsNext, ['compile-babel', 'reloadJS']);
});

gulp.task('production', ['set-prod-node-env'], function () {
  electron.start() // Electron Connect, Auto Reload
});


/* compile tasks */

gulp.task('compile-babel', function () {
  return gulp.src(config.jsNext)
    .pipe(sourcemaps.init())
    .pipe(babel().on('error', swallowError))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest(config.js2015));
});

gulp.task('compile-less', function () {
  var combined = combiner.obj([
    gulp.src(config.less),
    sourcemaps.init(),
    less({ relativeUrls: true }),
    sourcemaps.write(),
    gulp.dest(config.css)
  ]);
  combined.on('error', console.error.bind(console));
  return combined; 
});


/*  Reload After Compile with Electron Connect */

gulp.task('reloadJS', ['compile-babel'], function () {
  console.log('#JS Changed: Reload Electron')
  electron.reload()
}) 

gulp.task('reloadLess', ['compile-less'], function () {
  console.log('#Less Changed: Reload Electron')
  electron.reload()
})


/** usefull? **/
gulp.task('debug', ['set-debug-node-env'], function () {
  electron.start(["--remote-debugging-port=9992"]) // Electron Connect, Auto Reload
  gulp.watch(config.less, ['compile-less', 'reloadLess']);
  gulp.watch(config.jsNext, ['compile-babel', 'reloadJS']);
});

gulp.task('git-submodules', function() {  
  // Mozilla PDF.JS branch gh-pages
  // https://github.com/mozilla/pdf.js/wiki/Setup-PDF.js-in-a-website
  git.addSubmodule('https://github.com/mozilla/pdf.js', 'library/pdfjs-gh-pages', { args: '-b gh-pages'});
});

/**
 * Google Webfonts
 */

const googleWebFontsOptions = { };

gulp.task('fonts', function () {
	return gulp.src(config.fontsList)
		.pipe(googleWebFonts(googleWebFontsOptions))
		.pipe(gulp.dest(config.fontsDest));
	});

gulp.task('git-submodules', function() {

  // Mozilla PDF.JS branch gh-pages
  // https://github.com/mozilla/pdf.js/wiki/Setup-PDF.js-in-a-website
  git.addSubmodule('https://github.com/mozilla/pdf.js', 'library/pdfjs-gh-pages', { args: '-f -b gh-pages'});
});


/**
 * NODE_ENV / Environment Variables
 * http://stackoverflow.com/questions/28787457/how-can-i-set-an-environment-variable-from-gulp
 */

gulp.task('set-dev-node-env', function() {
    return process.env.NODE_ENV = 'development';
});

gulp.task('set-prod-node-env', function() {
    return process.env.NODE_ENV = 'production';
});

gulp.task('set-debug-node-env', function() {
    return process.env.NODE_ENV = 'debug';
});


function swallowError (error) {
  console.log(error.toString())
  this.emit('end')
}
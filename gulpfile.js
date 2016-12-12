'use strict';

const gulp = require('gulp')
const googleWebFonts = require('gulp-google-webfonts')
const git = require('gulp-git');

const config = { source: './src' }
config.fontsList = config.source + '/themes/googlefonts.list'
config.fontsDest = config.source + '/themes/google-fonts/'


gulp.task('install', ['fonts', 'git-submodules']);

// Download from git
gulp.task('git-submodules', function() {  
  // Mozilla PDF.JS branch gh-pages
  // https://github.com/mozilla/pdf.js/wiki/Setup-PDF.js-in-a-website
  git.addSubmodule('https://github.com/mozilla/pdf.js', 'library/pdfjs-gh-pages', { args: '-b gh-pages -f'});
});

// Download Google Webfonts
const googleWebFontsOptions = {};

gulp.task('fonts', function () {
	return gulp.src(config.fontsList)
		.pipe(googleWebFonts(googleWebFontsOptions))
		.pipe(gulp.dest(config.fontsDest));
});
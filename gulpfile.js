"use strict";

const gulp = require("gulp");
const googleWebFonts = require("gulp-google-webfonts");

const config = { source: "./src" };
config.fontsList = config.source + "/themes/googlefonts.list";
config.fontsDest = config.source + "/themes/google-fonts/";

gulp.task("install", ["fonts"]);

// Download Google Webfonts
const googleWebFontsOptions = {};

gulp.task("fonts", function() {
  return gulp
    .src(config.fontsList)
    .pipe(googleWebFonts(googleWebFontsOptions))
    .pipe(gulp.dest(config.fontsDest));
});

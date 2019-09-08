const gulp = require('gulp');
const $ = require('gulp-load-plugins')();
const mainBowerFiles = require('main-bower-files');

const { options } = require('./options.js');

const bower = () => {
  return gulp.src(mainBowerFiles(
    // {
    //     "overrides": {
    //         "vue": {                       // 套件名稱
    //             "main": "dist/vue.js"      // 取用的資料夾路徑
    //         }
    //     }
    // }
  ))
    .pipe(gulp.dest('./.tmp/vendors'));
    // cb();
};

const vendorJs = () => {
  return gulp.src([
    './.tmp/vendors/**/*.js',
    './node_modules/bootstrap/dist/js/bootstrap.bundle.min.js'
  ])
    .pipe($.order([
      'jquery.js'
    ]))
    .pipe($.concat('vendors.js'))
    .pipe($.if(options.env === 'production', $.uglify()))
    .pipe(gulp.dest('./public/js'))
};

exports.bower = bower;
exports.vendorJs = vendorJs;
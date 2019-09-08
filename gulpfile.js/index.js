const gulp = require('gulp');
const autoprefixer = require('autoprefixer');
const $ = require('gulp-load-plugins')();
const browserSync = require('browser-sync').create();
// const gulpSequence = require('gulp-sequence');

const { options } = require('./options.js');
const { bower, vendorJs } = require('./vendor.js');

console.log(options);
// develop / production
// gulp --env production

gulp.task('clean', () => {
  return gulp.src(['./.tmp', './public'], { read: false, allowEmpty: true })
      .pipe($.clean());
});

gulp.task('copyHTML', () => {
  return gulp.src('./source/**/*.html')
      .pipe(gulp.dest('./public/'))
})

gulp.task('jade', () => {
  // const YOUR_LOCALS = {};

  return  gulp.src('./source/**/*.jade')
          .pipe($.plumber())
          .pipe($.data(function(){
            const activeData = require('../source/data/data.json');
            const menu = require('../source/data/menu.json');
            const source = {
              'activeData': activeData,
              'menu': menu
            }
            return source;
          }))
          .pipe($.jade({
              // locals: YOUR_LOCALS
              pretty: true
          }))
          .pipe(gulp.dest('./public/'))
          .pipe(browserSync.stream())
});

gulp.task('sass', () => {
  return gulp.src('./source/scss/**/*.scss')
      .pipe($.plumber())
      .pipe($.sourcemaps.init())
      .pipe($.sass({
          outputStyle: 'nested',
          includePaths: ['./node_modules/bootstrap/scss']
      }).on('error', $.sass.logError))
      // 編譯完成 CSS
      .pipe($.postcss([autoprefixer()]))
      .pipe($.if( options.env === 'production', $.cleanCss()))
      .pipe($.sourcemaps.write('.'))
      .pipe(gulp.dest('./public/css'))
      .pipe(browserSync.stream())
});

gulp.task('babel', () => {
  return gulp.src('./source/js/**/*.js')
        .pipe($.sourcemaps.init())
        .pipe($.babel({
            presets: ['env']
        }))
        .pipe($.concat('all.js'))
        .pipe($.if(options.env === 'production', $.uglify({
            compress: {
                drop_console: true
            }
        })))
        .pipe($.sourcemaps.write('.'))
        .pipe(gulp.dest('./public/js'))
        .pipe(browserSync.stream())
});

gulp.task('data', () => {
  return gulp.src('./source/data/**/*.json')
    .pipe($.data(function () {
      const activeData = require('../source/data/data.json');
      const menu = require('../source/data/menu.json');
      const source = {
        'activeData': activeData,
        'menu': menu
      }
      return source;
    }))
    .pipe(gulp.dest('./public/data'))
})

gulp.task('imageMin', () => {
  return gulp.src('./source/images/*')
    .pipe($.imagemin())
    .pipe(gulp.dest('./public/images'))
  }
);

gulp.task('deploy', () => {
  return gulp.src('./public/**/*')
      .pipe($.ghPages());
});

gulp.task('build',
  gulp.series(
    'clean',
    gulp.parallel('jade', 'sass', 'babel', 'data', 'imageMin'),
    gulp.series(bower, vendorJs)
  )
)

gulp.task('default',
  gulp.series(
    'clean',
    'jade',
    'sass',
    'babel',
    'data',
    'imageMin',
    gulp.series(bower, vendorJs),
    
    function(done) {

      browserSync.init({
        server: {
          baseDir: "./public",
          reloadDebounce: 2000
        }
      });

      gulp.watch('./source/scss/**/*.scss', gulp.series('sass'));
      gulp.watch('./source/**/*.jade', gulp.series('jade'));
      gulp.watch('./source/js/**/*.js', gulp.series('babel'));
      
      done();
    }
  )
)
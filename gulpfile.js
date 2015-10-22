/**
* for basicTask
* npm install gulp-jshint gulp-sass gulp-concat gulp-uglify gulp-rename --save-dev 
* source : https://travismaynard.com/writing/getting-started-with-gulp
*
* cssTask
* css : npm i -D gulp gulp-util gulp-plumber
* source : http://putaindecode.fr/posts/js/introduction-gulp/
* 
* moreTask
* npm install gulp-ruby-sass gulp-autoprefixer gulp-minify-css gulp-jshint gulp-concat gulp-uglify gulp-imagemin gulp-notify gulp-rename gulp-livereload gulp-cache del --save-dev
* source : https://markgoodyear.com/2014/01/getting-started-with-gulp/
*
* npm install gulp-util gulp-plumber gulp-sass gulp-ruby-sass gulp-autoprefixer gulp-minify-css gulp-jshint gulp-concat gulp-uglify gulp-imagemin gulp-notify gulp-rename gulp-livereload gulp-cache del --save-dev
* all in one
*/

// Include gulp
var gulp = require('gulp'); 

// Include Our Plugins for BasicTask
var jshint = require('gulp-jshint'); //moreTask too
var sass = require('gulp-sass');
var concat = require('gulp-concat'); //moreTask too
var uglify = require('gulp-uglify'); //moreTask too
var rename = require('gulp-rename'); //moreTask too

//Include for cssTask
var gutil = require("gulp-util")
var plumber = require("gulp-plumber")
var cssnext = require("gulp-cssnext")
var csso = require("gulp-csso")
var options = require("minimist")(process.argv.slice(2))

// Load plugins (moreTask)
var gulp = require('gulp'),
    rubySass = require('gulp-ruby-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    minifycss = require('gulp-minify-css'),
    imagemin = require('gulp-imagemin'),
    notify = require('gulp-notify'),
    cache = require('gulp-cache'),
    livereload = require('gulp-livereload'),
    del = require('del');

// Images (moreTask)
gulp.task('images', function() {
  return gulp.src('src/images/**/*')
    .pipe(cache(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true })))
    .pipe(gulp.dest('dist/images'))
    .pipe(notify({ message: 'Images task complete' }));
});

// Lint Task (BasicTask)
gulp.task('lint', function() {
    return gulp.src('js/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

// Compile Our Sass (BasicTask)
gulp.task('sass', function() {
    return gulp.src('scss/*.scss')
        .pipe(sass())
        .pipe(gulp.dest('css'));
});

// Concatenate & Minify JS (BasicTask)
gulp.task('scripts', function() {
    return gulp.src('js/*.js')
        .pipe(concat('all.js'))
        .pipe(gulp.dest('dist'))
        .pipe(rename('all.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('dist'));
});

// Scripts (moreTask)
//gulp.task('scripts', function() {
//  return gulp.src('src/scripts/**/*.js')
//    .pipe(jshint('.jshintrc'))
//    .pipe(jshint.reporter('default'))
//    .pipe(concat('main.js'))
//    .pipe(gulp.dest('dist/scripts'))
//    .pipe(rename({ suffix: '.min' }))
//    .pipe(uglify())
//    .pipe(gulp.dest('dist/scripts'))
//    .pipe(notify({ message: 'Scripts task complete' }));
//});

// Watch Files For Changes (BasicTask)
gulp.task('watch', function() {
    gulp.watch('js/*.js', ['lint', 'scripts']);
    gulp.watch('scss/*.scss', ['sass']);
});

// Watch (moreTask)
//gulp.task('watch', function() {
//  gulp.watch('src/styles/**/*.scss', ['styles']);
//  gulp.watch('src/scripts/**/*.js', ['scripts']);
//  gulp.watch('src/images/**/*', ['images']);
//  // Create LiveReload server
//  livereload.listen();
//  // Watch any files in dist/, reload on change
//  gulp.watch(['dist/**']).on('change', livereload.changed);
//});

// (cssTask)
gulp.task("styles", function() {
  gulp.src("./src/css/*.css")
    .pipe(!options.production ? plumber() : gutil.noop())
    .pipe(cssnext({sourcemap: !options.production}))
    .pipe(options.production ? csso() : gutil.noop())
    .pipe(gulp.dest("./dist/css/"))
});

// Styles (moreTask)
//gulp.task('styles', function() {
//  return rubySass('src/styles/main.scss', { style: 'expanded' })
//    .pipe(autoprefixer('last 2 version'))
//    .pipe(gulp.dest('dist/styles'))
//    .pipe(rename({ suffix: '.min' }))
//    .pipe(minifycss())
//    .pipe(gulp.dest('dist/styles'))
//    .pipe(notify({ message: 'Styles task complete' }));
//});

// Clean (moreTask)
gulp.task('clean', function(cb) {
    del(['dist/assets/css', 'dist/assets/js', 'dist/assets/img'], cb)
});

// Default Task
gulp.task('default', ['lint', 'sass', 'scripts', 'watch']);

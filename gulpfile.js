// Initialize modules
const { src, dest, watch, series } = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
//const connect = require('gulp-connect-php');
const babel = require('gulp-babel');
const terser = require('gulp-terser');
const clean = require('gulp-clean');
const newer = require('gulp-newer');
const imagemin = require('gulp-imagemin')
const browsersync = require('browser-sync').create();

//const connect = require('gulp-connect-php');

// Use dart-sass for @use
sass.compiler = require('dart-sass');

// Sass Task
function scssTask() {
  return src('src/scss/main.scss', { sourcemaps: true })
    .pipe(sass())
    .pipe(postcss([autoprefixer(), cssnano()]))
    .pipe(dest('dist/css', { sourcemaps: '.' }))
}

// JavaScript Task
function jsTask() {
  return src('src/js/*.js', { sourcemaps: true })
    .pipe(babel({ presets: ['@babel/preset-env'] }))
    .pipe(terser())
    .pipe(dest('dist/js', { sourcemaps: '.' }));
}

function imageTask() {
  return src('src/images/*')
    .pipe(newer('dist/images'))
    .pipe(imagemin())
		.pipe(dest('dist/images'));
}

function browsersyncServe(cb){
    // Serve files from the root of this project
    browsersync.init({ 
        proxy: 'localhost/php'
   });
  cb();
 }

function browsersyncReload(cb){
  browsersync.reload();
  cb();
}


// Watch Task
function watchTask() {
    watch('./*.php', browsersyncReload);
    watch(['src/scss/**/*.scss', 'src/**/*.js'], series(scssTask, jsTask, imageTask, browsersyncReload));
}
//allow for individual tasks
exports.scssTask = scssTask;
exports.imageTask = imageTask;
exports.jsTask = jsTask;

// Default Gulp Task
exports.default = series(
  scssTask, 
  jsTask,
  imageTask,
  browsersyncServe,
  watchTask
  );

// Build Gulp Task. 
exports.build = series(scssTask, jsTask, imageTask);

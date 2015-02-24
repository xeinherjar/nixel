'use strict';
// generated on 2015-02-23 using generator-tiy-webapp 0.0.10

// Require your modules
var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var rimraf = require('rimraf');
var exec = require('child_process').exec;
var prompt = require('gulp-prompt');

gulp.task('styles', function () {
  return gulp.src('app/styles/main.css')
    .pipe($.autoprefixer('last 1 version'))
    .pipe(gulp.dest('.tmp/styles'));
});

gulp.task('html', ['styles'], function () {

  return gulp.src('app/*.html')
    .pipe($.useref.assets({searchPath: '{.tmp,app}'}))
    .pipe($.if('*.css', $.csso()))
    .pipe($.useref.restore())
    .pipe($.useref())
    .pipe(gulp.dest('dist'));
});

gulp.task('images', function () {
  return gulp.src('app/images/**/*')
    .pipe($.cache($.imagemin({
      progressive: true,
      interlaced: true
    })))
    .pipe(gulp.dest('dist/images'));
});

gulp.task('fonts', function () {
  return gulp.src('app/fonts/**/*')
    .pipe(gulp.dest('dist/fonts'));
});

gulp.task('extras', function () {
  return gulp.src(['app/*.*', '!app/*.html'], {dot: true})
    .pipe(gulp.dest('dist'));
});

gulp.task('clean', function (cb) {
  return $.cache.clearAll(cb, function() {
    return rimraf('.tmp', function () {
      return rimraf('dist', cb);
    });
  });
});

gulp.task('connect', function () {
  var connect = require('connect');
  var app = connect()
    .use(require('connect-livereload')({port: 35729}))
    .use(connect.static('app'))
    .use(connect.static('.tmp'))
    // paths to bower_components should be relative to the current file
    // e.g. in app/index.html you should use ../bower_components
    .use('/bower_components', connect.static('bower_components'))
    .use(connect.directory('app'));

  require('http').createServer(app)
    .listen(9000)
    .on('listening', function () {
      console.log('Started connect web server on http://localhost:9000');
    });
});

gulp.task('serve', ['connect'], function () {
  require('opn')('http://localhost:9000');
});

// inject bower components
gulp.task('wiredep', function () {
  var wiredep = require('wiredep').stream;

  gulp.src('app/*.html')
    .pipe(wiredep({
      directory: 'bower_components'
    }))
    .pipe(gulp.dest('app'));
});

gulp.task('watch', ['connect', 'serve'], function () {
  $.livereload.listen();

  // watch for changes
  gulp.watch([
    'app/*.html',
    '.tmp/styles/**/*.css',
    'app/scripts/**/*.js',
    'app/images/**/*'
  ]).on('change', $.livereload.changed);

  gulp.watch('app/styles/**/*.css', ['styles']);
  gulp.watch('bower.json', ['wiredep']);
});

gulp.task('build', ['html', 'images', 'fonts', 'extras'], function () {
  return gulp.src('dist/**/*').pipe($.size({title: 'build', gzip: true}));
});

gulp.task('default', ['clean'], function () {
  gulp.start('build');
});

// Push a subtree from our `dist` folder
gulp.task('deploy', function() {

  gulp.src('/')
    .pipe(prompt.prompt({
        type: 'confirm',
        name: 'task',
        message: 'This will deploy to GitHub Pages. Have you already built your application and pushed your updated master branch?'
    }, function(res){
      if (res.task){
        console.log('Attempting: "git subtree push --prefix dist origin gh-pages"');
        exec('git subtree push --prefix dist origin gh-pages', function(err, stdout, stderr) {
            console.log(stdout);
            console.log(stderr);
        });
      } else { console.log('Please do this first and then run `gulp deploy` again.'); }
    }));

});

// Test your app in the browser
// Needs to be better, but needed something quick
gulp.task('test-server', function() {

  // Open Test Page
  var connect = require('connect');
  var app = connect()
    .use(require('connect-livereload')({port: 35729}))
    .use(connect.static('test'))
    .use('/app', connect.static('app'))
    .use('/bower_components', connect.static('bower_components'))
    .use(connect.directory('test'));

  require('http').createServer(app)
    .listen(8000)
    .on('listening', function () {
      console.log('Started connect testing server on http://localhost:8000');
    });

  require('opn')('http://localhost:8000');

  // Watch for changes in either the test/spec folder or app/scripts folder
  $.livereload.listen();

  gulp.watch([
    'app/scripts/**/*.js',
    'test/spec/**/*.js'
  ]).on('change', $.livereload.changed);

});

//load plugins
var gulp             = require('gulp'),
    compass          = require('gulp-compass'),
    autoprefixer     = require('gulp-autoprefixer'),
    minifycss        = require('gulp-minify-css'),
    uglify           = require('gulp-uglify'),
    rename           = require('gulp-rename'),
    concat           = require('gulp-concat'),
    notify           = require('gulp-notify'),
    livereload       = require('gulp-livereload'),
    plumber          = require('gulp-plumber'),
    path             = require('path'),
    tsc = require('gulp-typescript'),
    tsProject = tsc.createProject('tsconfig.json'),
    sourcemaps = require('gulp-sourcemaps'),
    browserSync = require('browser-sync').create(),
    reload = browserSync.reload;

//the title and icon that will be used for the Grunt notifications
var notifyInfo = {
    title: 'Gulp',
    icon: path.join(__dirname, 'gulp.png')
};

//error notification settings for plumber
var plumberErrorHandler = { errorHandler: notify.onError({
        title: notifyInfo.title,
        icon: notifyInfo.icon,
        message: "Error: <%= error.message %>"
    })
};

//styles
gulp.task('styles', function() {
    return gulp.src(['src/scss/**/*.scss'])
        .pipe(plumber(plumberErrorHandler))
        .pipe(compass({
            config_file: 'config.rb',
            css: 'html/css',
            sass: 'src/scss',
            image: 'html/images'
        }))
        //.pipe(autoprefixer('last 2 version', 'safari 5', 'ie 7', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
        .pipe(gulp.dest('html/css'))
        .pipe(rename({ suffix: '.min' }))
        .pipe(minifycss())
        .pipe(gulp.dest('html/css'));
});

//scripts
gulp.task('scripts', function() {
    return gulp.src('src/js/**/*.js')
        .pipe(plumber(plumberErrorHandler))
        .pipe(concat('main.js'))
        .pipe(gulp.dest('html/js'))
        .pipe(rename({ suffix: '.min' }))
        .pipe(uglify())
        .pipe(gulp.dest('html/js'));
});

//watch
gulp.task('live', function() {
    livereload.listen();

    //watch .scss files
    gulp.watch('src/scss/**/*.scss', ['styles']);

    //watch .js files
    gulp.watch('src/js/**/*.js', ['scripts']);

    //reload when a template file, the minified css, or the minified js file changes
    gulp.watch(['templates/**/*.html', 'html/css/styles.min.css', 'html/js/main.min.js','html/*.html'], function(event) {
      //  gulp.src(event.path)
      //      .pipe(plumber())
      //      .pipe(livereload())
     // //      .pipe(notify({
      //          title: notifyInfo.title,
      //          icon: notifyInfo.icon,
      // //         message: event.path.replace(__dirname, '').replace(/\\/g, '/') + ' was ' + event.type + ' and reloaded'
      //      })
      //  );
            browserSync.reload();
    });
});
// server
gulp.task('serve', function() {
    browserSync.init({
        server: {
            baseDir: './html'
        },
            notify:false
    })});

gulp.task('reloady', ['live'], function() {
    console.log("Reload SHOULD have happened.");
    browserSync.reload();
});
//Typescript task
gulp.task('compile-ts', function() {
    var sourceTsFiles = [
        config.allTs,
        config.typings
    ];

    var tsResult = gulp
        .src(sourceTsFiles)
        .pipe(sourcemaps.init())
        .pipe(tsc(tsProject));

    return tsResult.js
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(config.tsOutputPath))
});
gulp.task('default',['serve','styles','scripts','reloady']);
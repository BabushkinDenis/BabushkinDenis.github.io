'use strict';
//http://habrahabr.ru/post/250569/

//git config --global url."https://".insteadOf git://
var gulp = require('gulp'),
    watch = require('gulp-watch'),
    prefixer = require('gulp-autoprefixer'),
    uglify = require('gulp-uglify'),
    sass = require('gulp-sass'),
    sourcemaps = require('gulp-sourcemaps'),
    rigger = require('gulp-rigger'),
    cssmin = require('gulp-minify-css'),
    imagemin = require('gulp-imagemin'),
    pngquant = require('imagemin-pngquant'),
    rimraf = require('rimraf'),
    stylus = require('gulp-stylus'),
    source = require('vinyl-source-stream'),
    filter    = require('gulp-filter'),
    base64 = require('gulp-base64'),
    browserify = require('browserify'),
    browserSync = require('browser-sync').create();



var path = {
        build: { //Тут мы укажем куда складывать готовые после сборки файлы
            js: 'build/js/',
            style: 'build/css/',
            img: 'build/img/',
            fonts: 'build/fonts/',
            sprite : 'build/sprite/'
        },
        src: { //Пути откуда брать исходники
            js: {
                index: 'assets/js/app.js'
            },
            style: {
                index: 'assets/css/collector.scss'
            },
            img: 'assets/img/**/*.*', //Синтаксис img/**/*.* означает - взять все файлы всех расширений из папки и из вложенных каталогов
            fonts: 'assets/fonts/**/*.*',
            sprite: 'assets/img/sprite-svg/*.svg'
        },
        watch: { //Тут мы укажем, за изменением каких файлов мы хотим наблюдать
            html: 'assets/**/*.html',
            js: 'assets/js/**/*.js',
            style: 'assets/css/**/*.*css',
            img: 'assets/img/**/*.*'
        },
        clean: './build'
    };

gulp.task('clean', function (cb) {
    rimraf(path.clean, cb);
});

gulp.task('image:build', function () {
    gulp.src(path.src.img) //Выберем наши картинки
        .pipe(imagemin({ //Сожмем их
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()],
            interlaced: true
        }))
        .pipe(gulp.dest(path.build.img)) //И бросим в build
        .pipe(browserSync.reload({stream: true}));
});


gulp.task('style:build', function () {
    gulp.src(path.src.style.index) 
        //.pipe(sourcemaps.init())
        .pipe(sass({
            includePaths: ['src/css/'],
            outputStyle: 'compressed',
            //sourceMap: true,
            errLogToConsole: true
        }))
        .pipe(prefixer())
        .pipe(cssmin())
        //.pipe(sourcemaps.write())
        .pipe(gulp.dest(path.build.style))
        .pipe(browserSync.reload({stream: true}));
});






gulp.task('js:build', function() {
    return browserify(path.src.js.index)
        .bundle()
        // Передаем имя файла, который получим на выходе, vinyl-source-stream
        .pipe(source('index.js'))
        .pipe(gulp.dest(path.build.js))
        .pipe(browserSync.reload({stream: true}));
});



gulp.task('build', [
    'js:build',
    'style:build',
    'image:build'
]);


gulp.task('watch', function(){
    watch([path.watch.style], function(event, cb) {
        setTimeout(function(){gulp.start('style:build');},500);
        
    });
    watch([path.watch.js], function(event, cb) {
        gulp.start('js:build');
    });
    watch([path.watch.img], function(event, cb) {
        gulp.start('image:build');
    });

});



gulp.task('start', ['build', 'watch'],function(){
    browserSync.init({
        server: {
            baseDir: "./"
        },
        notify: false
        // proxy: "http://127.0.0.10",
        // serveStatic: ['../public']
    });
});

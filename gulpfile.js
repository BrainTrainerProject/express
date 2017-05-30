var gulp = require('gulp');
var babel = require('gulp-babel');
var eslint = require('gulp-eslint');
var mocha = require('gulp-mocha');
var _ = require('underscore');
var mkdirp = require('mkdirp');
var runSequence = require('run-sequence');
var shell = require('gulp-shell');
var clean = require('gulp-clean');

gulp.task('build', ['copyConfig', 'lint'], function () {
    return gulp.src(['src/**/**.js'])
        .pipe(babel())
        .pipe(gulp.dest('lib'))
});

gulp.task('copyConfig', function () {
    return gulp.src(['src/**/**.json'])
        .pipe(gulp.dest('lib'))
});

gulp.task('lint', function () {
    return gulp.src(['gulpfile.babel.js', 'src/**/*.js',])
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failAfterError())
});

gulp.task('test', ['build'], function () {
    return gulp.src('lib/test/**/*.js')
        .pipe(mocha())
});


// Build Webview

const cycleFolder = './node_modules/bt-cyclejs/';
const buildFolder = './node_modules/bt-cyclejs/build/';
const moveToFolder = './public/';

gulp.task("build:webview", function (callback) {
    runSequence(
        'preclean',
        'ts',
        [
            'styles',
            'templates',
            'images'
        ],
        'bundle',
        'move',
        'postclean', callback);
});

const folders = [
    buildFolder + 'src/js',
    buildFolder + 'src/css',
];

gulp.task("make-folders", function () {
    _.each(folders, function (file) {
        mkdirp.sync(file, function (err) {
            if (err) console.error(err)
            else console.log("File created: " + file)
        });
    })
});

gulp.task("move", function () {
    return gulp.src(buildFolder + '**/*').pipe(gulp.dest(moveToFolder))
});

gulp.task("preclean", function () {
    return gulp.src([moveToFolder], {read: false})
        .pipe(clean());
});

gulp.task("postclean", function () {
    return gulp.src([buildFolder, cycleFolder + 'lib'], {read: false})
        .pipe(clean());
});

gulp.task("bundle", ["make-folders"], function () {
    return gulp.src(cycleFolder + 'lib/main.js', {read: false})
        .pipe(shell(['mkdirp ' + buildFolder + 'src/js/']))
        .pipe(shell(['browserify ' + cycleFolder + 'lib/main.js --outfile=' + buildFolder + 'src/js/bundle.js']))
});

gulp.task("images", function () {
    return gulp.src(cycleFolder + 'src/sources/img/**/*')
        .pipe(gulp.dest(cycleFolder + 'src/img/'));
});

gulp.task("styles", function () {
    const stylus = require('gulp-stylus');
    return gulp.src(cycleFolder + 'src/sources/css/*.styl')
        .pipe(stylus())
        .pipe(gulp.dest(buildFolder + 'src/css/'));
});

gulp.task("templates", function () {
    return gulp.src(cycleFolder + 'src/sources/templates/*.html')
        .pipe(gulp.dest(buildFolder));
});

gulp.task("ts", function () {
    var ts = require('gulp-typescript');
    var project = ts.createProject(cycleFolder + 'tsconfig.json');
    return gulp.src(cycleFolder + "src/**/*.ts")
        .pipe(project())
        .pipe(gulp.dest(cycleFolder + 'lib'));
});
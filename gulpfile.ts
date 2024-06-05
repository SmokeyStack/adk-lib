const gulp = require('gulp');
const ts = require('gulp-typescript');

const adkLib = ts.createProject('tsconfig.json');

gulp.task('dev-beta', function () {
    const source = ['scripts/beta/**/*.ts'];

    return gulp
        .src(source)
        .pipe(ts(adkLib))
        .pipe(gulp.dest('packs/BP/scripts'));
});

gulp.task('build-beta', function () {
    const source = ['scripts/stable/**/*.ts'];

    return gulp
        .src(source)
        .pipe(ts(adkLib))
        .pipe(gulp.dest('packs/BP/scripts'));
});

gulp.task('dev-stable', function () {
    const source = ['scripts/beta/**/*.ts'];

    return gulp
        .src(source)
        .pipe(ts(adkLib))
        .pipe(gulp.dest('packs/BP/scripts'));
});

gulp.task('build-stable', function () {
    const source = ['scripts/stable/**/*.ts'];

    return gulp
        .src(source)
        .pipe(ts(adkLib))
        .pipe(gulp.dest('packs/BP/scripts'));
});

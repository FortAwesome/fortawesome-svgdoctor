const gulp = require('gulp');
const babel = require('gulp-babel');

gulp.task('default', () =>
  gulp.src('src/**/*')
    .pipe(babel({
      presets: ['es2015']
    }))
    .pipe(gulp.dest('lib'))
);

gulp.task('watch', ['default'], () =>
  gulp.watch('src/**/*', ['default'])
);

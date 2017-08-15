var gulp         = require('gulp'),
    sass         = require('gulp-sass'),
    browsersync  = require('browser-sync'),
    concat       = require('gulp-concat'),
    uglify       = require('gulp-uglifyjs'),
    cssnano      = require('gulp-cssnano'),
    rename       = require('gulp-rename'),
    del          = require('del'),
    imagemin     = require('gulp-imagemin'),
    pngquant     = require('imagemin-pngquant'),
    cache        = require('gulp-cache'),
    autoprefixer = require('gulp-autoprefixer');

gulp.task('sass', function (){
    return gulp.src('scss/**/*.scss')
        .pipe(sass())
        .pipe(autoprefixer(['last 15 versions', '>1%', 'ie 8', 'ie 7'], { cascade: true }))
        .pipe(gulp.dest('css'))
        .pipe(browsersync.reload({stream: true}))
});

gulp.task('scripts', function(){
   return gulp.src([
       'app/libs/jquery/jquery.min.js',
       'app/libs/magnific-popup/dist/jquery.magnific-popup.min.js',
   ])
    .pipe(concat('libs.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('js')); 
});

gulp.task('css-libs', ['sass'], function() {
    return gulp.src('css/libs.css')
    .pipe(cssnano())
    .pipe(rename({suffix:'.min'}))
    .pipe(gulp.dest('css'));
});

gulp.task('browser-sync', function(){
    browsersync({
        server: {
            baseDir: ''
        },
        notify: false
    })
});

gulp.task('clean', function(){
    return del.sync('dist'); 
});

gulp.task('clear', function(){
    return cache.clearAll(); 
});

gulp.task('img', function(){
    return gulp.src('img/**/*')
    .pipe(cahce(imagemin({
        interlaced: true,
        progressive: true,
        svgoPlugins: [{removeViewBox: false}],
        une: [pngquant()]
    })))
    .pipe (gulp.dest('dist/img'));
});

gulp.task('watch',['browser-sync', 'css-libs', 'scripts'], function(){
    gulp.watch('scss/**/*.scss', ['sass']);
    gulp.watch('*.html', browsersync.reload);
    gulp.watch('js/**/*.js', browsersync.reload);
});

gulp.task('build', ['clean', 'img', 'sass', 'scripts'], function(){
    
    var buidCss = gulp.src([
            'app/css/main.css',
            'app/css/libs.min.css',
        ])
        .pipe(gulp.dest('dist/css'));
    
    var buildFonts = gulp.src('app/fonts/**/*')
        .pipe(gulp.dest('dist/fonts'));
    
    var buildJs = gulp.src('app/js/**/*')
        .pipe(gulp.dest('dist/js'));
    
    var buildHtml = gulp.src('app/*.html')
        .pipe(gulp.dest('dist'));
});





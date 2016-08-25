// ////////////////////////////////////////////////////////
// Required
// ///////////////////////////////////////////////////////

var gulp =  require('gulp'),
    gutil = require('gulp-util'),
    source = require('vinyl-source-stream'),
	less = require('gulp-less'),
	browserSync = require('browser-sync'),
    browserify = require('browserify'),
    watchify = require('watchify'),
    reload = browserSync.reload,
    dependencies = ['knockout', 'jquery', 'moment', 'melement'];

// ////////////////////////////////////////////////////////
// Less Tasks
// ///////////////////////////////////////////////////////
gulp.task('less', function(){
	gulp.src('less/**/style.less')
		.pipe(less())
		.pipe(gulp.dest('css'))
		.pipe(reload({
			stream: true
		}));
});

// ////////////////////////////////////////////////////////
// HTML Tasks
// ///////////////////////////////////////////////////////
gulp.task('html', function(){
	gulp.src('**/*.html')
	.pipe(reload({
		stream: true
	}));
});


// ////////////////////////////////////////////////////////
// Fonts Tasks
// ///////////////////////////////////////////////////////
gulp.task('fonts', function() {
  return gulp.src('node_modules/font-awesome/fonts/*')
    .pipe(gulp.dest('fonts'))
});

// ////////////////////////////////////////////////////////
// BrowserSync Tasks
// ///////////////////////////////////////////////////////
gulp.task('browser-sync', function(){
	browserSync({
		server: {
			baseDir: "./"
		}
	})
});

// ////////////////////////////////////////////////////////
// Scripts Tasks
// ///////////////////////////////////////////////////////
gulp.task('app', function() {

    var appBundler = browserify({
        entries: 'js/script.js',
        cache: {},
        packageCache: {}
    });

    appBundler.external(dependencies);

    var rebundle = function () {

        var start = Date.now();
        console.log( gutil.colors.grey('Building APP bundle') );

        appBundler.bundle().on('error', gutil.log)
            .pipe(source('app.js') )
            .pipe(gulp.dest('./build'))
            .pipe(reload({
                stream: true
            }));

        appBundler.on('error', function () {
            console.log("bundle error", arguments);
        });
    }
    rebundle();
    
    watchify(appBundler, {poll: 750})
        .on('update', rebundle);
    
});

// ////////////////////////////////////////////////////////
// Scripts Dependencies Tasks
// ///////////////////////////////////////////////////////

gulp.task('vendor', function()
{
    var vendorsBundler = browserify({
        cache: {},
        packageCache: {},
        require: dependencies,
        fullPaths: true
    });

    var start = new Date();

    console.log( gutil.colors.grey('Building VENDORS bundle') );

    vendorsBundler.bundle().on('error', gutil.log)
        .pipe(source('vendors.js'))
        .pipe(gulp.dest('./build'));
        
});

// ////////////////////////////////////////////////////////
// Watch Tasks
// ///////////////////////////////////////////////////////
gulp.task('watch', function() {
	gulp.watch('less/**/*.less', ['less'])
	gulp.watch('**/*.html', ['html'])
});


// ////////////////////////////////////////////////////////
// Default Tasks
// ///////////////////////////////////////////////////////
gulp.task('default', ['less', 'html', 'fonts', 'browser-sync', 'watch', 'vendor', 'app']);


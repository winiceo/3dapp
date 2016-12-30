/**
 * Created by leven on 16/8/21.
 */

var gulp = require('gulp')

var del = require('del')
var rev = require('gulp-rev');


var sftp = require('gulp-sftp');

var config={
    dest:'../public',
    rev:{//use rev to reset html resource url
        revJson: "../dist/**/*.json",
        src: "../dist/app/*.html",//root index.html
        dest: ""
    }
}

gulp.task('ftp', function() {


    return gulp.src(['./dist/**'])
        .pipe(sftp({
            host: 'mm.71an.com',
            remotePath: '/data/app/kphd-server/web/',
            user: 'leven',
            pass: '56os.com'
        }))
})




var cleanTask = function(cb) {
    del(['./dist']).then(function(paths) {
        cb()
    })
}

gulp.task('clean', cleanTask)


var config

gulp.task('js', function(){
    return gulp.src('../dist')
        .pipe(rev())  //set hash key
        .pipe(gulp.dest("../public"))
        .pipe(rev.manifest({
            merge: true
        }))
        .pipe(gulp.dest("../public")); //dest hash key json
});


gulp.task('default', ['clean'])

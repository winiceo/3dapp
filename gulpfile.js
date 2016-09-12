/**
 * Created by leven on 16/8/21.
 */

var gulp = require('gulp')
 
var del = require('del')
 

var sftp = require('gulp-sftp');
 
 
gulp.task('deploy', function() {
   

  return gulp.src(['./dist/**'])
    .pipe(sftp({
      host: 'pmker.com',
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
 
 

gulp.task('default', ['clean'])

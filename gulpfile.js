const gulp = require('gulp');
const concat = require('gulp-concat');
const autoprefixer = require('gulp-autoprefixer');
const cleanCSS = require('gulp-clean-css');
const uglify = require('gulp-uglify');
const del = require('del');
const browserSync = require('browser-sync').create();
const sourcemaps =  require('gulp-sourcemaps');
const less = require("gulp-less");

//Порядок подключения css файлов
const lessFiles = [
   './src/less/main.less'

]
//Порядок подключения js файлов
const jsFiles = [
   './src/js/lib.js',
   './src/js/main.js'
]

//Таск на стили CSS
function styles() {
   return gulp.src(lessFiles)
   .pipe(sourcemaps.init())
   .pipe(less())
   //Объединение файлов в один
   .pipe(concat('style.css'))
   //Добавить префиксы
   .pipe(autoprefixer(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], { cascade: true }))
   //Минификация CSS
   .pipe(cleanCSS({
      level: 2
   }))
   .pipe(sourcemaps.write("./"))
   //Выходная папка для стилей
   .pipe(gulp.dest('./build/css'))
   .pipe(browserSync.stream());
}

//Таск на скрипты JS
function scripts() {
   //Шаблон для поиска файлов JS
   //Всей файлы по шаблону './src/js/**/*.js'
   return gulp.src(jsFiles)
   //Объединение файлов в один
   .pipe(concat('script.js'))
   //Минификация JS
   .pipe(uglify({
      toplevel: true
   }))
   //Выходная папка для скриптов
   .pipe(gulp.dest('./build/js'))
   .pipe(browserSync.stream());
}

//Удалить всё в указанной папке
function clean() {
   return del(['build/css/*'],['build/js/*'])
}

//Просматривать файлы
function watch() {
   browserSync.init({
      server: {
          baseDir: "./"
      }
  });
  //Следить за less файлами
  gulp.watch('./src/less/**/*.less', styles)
  //Следить за JS файлами
  gulp.watch('./src/js/**/*.js', scripts)
  //При изменении HTML запустить синхронизацию
  gulp.watch("./*.html").on('change', browserSync.reload);
}

//Таск вызывающий функцию styles
gulp.task('styles', styles);
//Таск вызывающий функцию scripts
gulp.task('scripts', scripts);
//Таск для очистки папки build
gulp.task('del', clean);
//Таск для отслеживания изменений
gulp.task('watch', watch);
//Таск для удаления файлов в папке build и запуск styles и scripts
gulp.task('build', gulp.series(clean, gulp.parallel(styles,scripts)));
//Таск запускает таск build и watch последовательно
gulp.task('dev', gulp.series('build','watch'));
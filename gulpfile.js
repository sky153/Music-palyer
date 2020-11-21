//以下是gulp4.0的写法

var gulp = require('gulp');
//压缩图片插件
var imagemin = require('gulp-imagemin');
//压缩html插件
var htmlclean = require('gulp-htmlclean');
//压缩js插件
var uglify = require('gulp-uglify');
//去除js中的调试代码(console.log()、debugger)
var stripDebug = require('gulp-strip-debug');
//合并文件(减少HTTP网络请求)
var concat = require('gulp-concat');
//根据注释排序要编译的代码顺序
var deporder = require('gulp-deporder');
//将less文件解析为css文件
var less = require('gulp-less');
//解析css,可在其中添加其它css插件
var postcss = require('gulp-postcss');
//自动添加css前缀(兼容其它浏览器)
var autoprefixer = require('autoprefixer');
//压缩css插件
var cssnano = require('cssnano');
//创建虚拟服务器
var connect = require('gulp-connect');

//定义文件路径对象
var folder = {
	src : "src/",
	dist: "dist/"
}

//判断当前是开发环境还是生产环境(运行环境)
var devMode = process.env.NODE_ENV !== "production";

//添加gulp的任务事件 可以用return的方法或者执行回调函数来表示任务已经执行
gulp.task("html", function() {
	var page = gulp.src(folder.src + "html/index.html") //选择所读取的文件
				   .pipe(connect.reload())	//使浏览器自动刷新
	if(!devMode){
		page.pipe(htmlclean()); //如果是生产环境,对代码进行压缩
	}
	return page.pipe(gulp.dest(folder.dist + "html/")) //将读取的文件以流传输方式放到该文件夹下
})

gulp.task("images", function() {
	return gulp.src(folder.src + "images/*")
		.pipe(imagemin())
		.pipe(gulp.dest(folder.dist + "images/"))
})

gulp.task("js", function() {
	var js = gulp.src(folder.src + "js/*")
				 .pipe(connect.reload())
				 .pipe(gulp.dest(folder.dist + "js/"));
	if(!devMode) {
		js.pipe(uglify())
		  .pipe(stripDebug())
	}
	return js;
})

gulp.task("css", function() {
	var css = gulp.src(folder.src + "css/*")
				  .pipe(connect.reload())
				  .pipe(less());
	var options = [autoprefixer()];
	if(!devMode) {
		options.push(cssnano());
	}
	return css.pipe(postcss(options))
	   .pipe(gulp.dest(folder.dist + "css/"))
})

gulp.task("watch", function() {
	//监听路径下的文件,如果文件发送变化,执行后面数组中所对于的任务
	gulp.watch(folder.src + "html/*",gulp.series('html'));
    gulp.watch(folder.src + "css/*",gulp.series('css'));
    gulp.watch(folder.src + "js/*",gulp.series('js'));
    gulp.watch(folder.src + "images/*",gulp.series('images'));

})

gulp.task("server", function(cb) {
	connect.server({
		//自定义服务器端口号,没有此配置项默认是 8080
		port : "8888",
		////启用实时刷新的功能
		livereload : true
	});
	//执行回调,表示这个异步任务已经完成,起通作用,这样才会执行下个任务
	cb();
})


//gulp.series|4.0 依赖顺序执行
//gulp.parallel|4.0 多个依赖嵌套并行

//执行所定义的任务
gulp.task('default',gulp.series(gulp.parallel('html','images','js','css','server'),'watch'));
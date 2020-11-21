var $ = window.Zepto;
var root = window.player;

var $scope = $(document.body);
var songList = null;
var index = 0;
var controlManager = null;
var audio = new root.audioControl();

//按键点击绑定事件 移动端click有300ms延迟
function bindClick(){
	//歌曲切换事件
	$scope.on("play:change",function(event,index,flag){
		//设置音频播放路径及加载音频资源
		audio.getAudio(songList[index].audio);
		//若当前音频状态为play进行切歌则播放音频,或者通过播放列表切歌时也直接播放音频
		if(audio.status == "play" || flag){
			//播放音频
			audio.play();
		}
		//渲染歌曲总时间
		root.processor.renderAllTime(songList[index].duration);
		//渲染歌曲其它详细信息
		root.render(songList[index]);
		//切歌时重新开始渲染(传递true以标识是切歌状态的重新加载,而不是暂停后播放的重新加载)
		root.processor.start(true)
	})

	$scope.on("click",".prev-btn",function(){
		var index = controlManager.prev(); //对index的处理可直接用封装好的index处理函数
		$scope.trigger("play:change",index);
	})
	$scope.on("click",".next-btn",function(){
		var index = controlManager.next();
		$scope.trigger("play:change",index);
		
	})	
	$scope.on("click",".play-btn",function(){
		//修改音频播放状态并同时修改播放状态属性值status
		if(audio.status == "play"){
			audio.pause();
			//点击暂停时取消实时更新
			root.processor.stop();
		}else{
			audio.play();
			//点击播放时调用时间和进度条更新函数
			root.processor.start(false);
		}
		//切换播放暂停图标
		$(this).toggleClass("playing");
	})
	$scope.on("click",".list-btn",function(){
        root.playList.show(controlManager);
    })
}

//进度条触摸绑定事件 
function bindTouch(){
	var $sliderPoint = $(document.body).find(".slider-point");

	var offset = $scope.find(".pro-wrapper").offset();
	var left = offset.left; //获取包裹进度条的父级盒子相对文档左边的left值
	var width = offset.width; //获取包裹进度条的父级盒子的宽度
	var per ;
	$sliderPoint.on('touchstart',function(){

		root.processor.stop();//鼠标点击准备拖动时令进度条实时更新渲染过程停止
	}).on('touchmove',function(e){

		var x = e.changedTouches[0].clientX; //获取鼠标相对文档的X轴坐标
		per = (x - left) / width; //获取拖动距离相对于包裹进度条盒子宽度的百分比

		// 当拖动百分比小于0%时将per置0
		if(per < 0 ){
			per = 0;
		}
		//当拖动百分比小于100%时将per置为100%
		if(per > 1){
			per = 1;
		}

		root.processor.updata(per,true);//调用实时更新函数,传递参数true标识以使updata更新lastPer为当前per
	}).on("touchend",function(e){

		//通过controlManager构造函数获取当前歌曲index,以获取歌曲总时长
		var curDuration = songList[controlManager.index].duration;
		var curTime = per * curDuration;

		audio.playTo(curTime);//对音频当前播放时间currentTime属性进行处理
		root.processor.start(false);//拖动结束时重新调用实时更新入口函数让它实时渲染更新数据(还不能将lastPer清零,所以传入false)
	})
}


function getData(url){
	$.ajax({
		type : "GET",
		url : url,
		success : function(data){
			root.render(data[0]);
			songList = data;
			bindClick();
			bindTouch();
			root.playList.renderList(data);
			//创建controlManger构造函数,让controlManger变成一个对象,this隐式指向controlManager函数对象本身
			controlManager = new root.controlManager(data.length);
			//触发音乐切换事件,默认传入参数0(当前默认播放状态为pause,所以只会渲染信息不会播放)
			$scope.trigger("play:change",0); 

		},
		error : function(e){
			console.log(e.error);
		}
	})
}

//传入数据接口
getData("../mock/data.json");
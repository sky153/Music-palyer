//渲染进度条和播放时间点
(function($,root){
	var $scope = $(document.body);
	var curDuration; //记录音乐总时长
	var frameId; //用来记录requestAnimationFrame()函数
	var startTime;
	var lastPer = 0; //上次缓存量

	//处理时间格式：将秒转换成分钟
	function formatTime(time){
		time = Math.round(time); //先将时间取整 (Math.round()四舍五入函数)
		var minute = Math.floor(time / 60); //Math.floor(x)返回小于等于x的最大整数
		var second = time - minute * 60;
		if(minute < 10){
			minute = "0" + minute;
		}
		if(second < 10){
			second = "0" + second;
		}
		return minute + ":" + second;
	}

	//渲染当前总时间
	function renderAllTime(duration){
		curDuration = duration; //将歌曲总时长赋给全局变量curDuration
		var allTime = formatTime(duration);
		$scope.find('.all-time').html(allTime);
	}

	//实时更新时间和进度条
	function updata(percent,flag){
		//用来标记是否为拖动进度条后放下触发的updata(),如果是将已缓存量替换为拖动进度条时计算的拖动百分比
		if(flag){
			lastPer = percent;
		}

		//获取当前秒数
		var curTime = percent * curDuration;
		//将当前秒数转换为分钟格式
		curTime = formatTime(curTime);
		//渲染当前秒数
		$scope.find('.cur-time').html(curTime);

		//渲染进度条,因为translateX往右移需要从-100%到-0%过渡,所以写为percent-1(将原来左移的百分比减小)
		var percentage = (percent - 1) * 100 + "%";
		$scope.find(".pro-top").css({
			'transform':'translateX(' + percentage + ')'
		})
	}

	//改变时间和进度条的入口函数
	function start(flag){
		//每次当是在歌曲切歌下调用的start()时,将上次缓存的lastPer清零
		if(flag){
			lastPer = 0;
		}
		//因为requestAnimationFrame函数是在页面重绘时触发,当你暂停后再点击时,还没等到startTime更新,frame()函数就被先执行了,会导致时间更新出错,所以先清除
		cancelAnimationFrame(frameId);

		startTime = new Date().getTime();
		function frame(){
			var curTime = new Date().getTime();
			/*
			 * 已播放时长占总时长(需要将总时长curDuration换成毫秒,所以curDuration * 1000)
			 * 这里注意要把lastPer加上,不然重新点击开始按钮,进度条和秒数的渲染永远会从头开始
			*/
			var percent = lastPer + (curTime - startTime) / (curDuration * 1000);
			
			//当歌曲播放完毕不再实时更新时间和进度条
			if(percent < 1){
				//requestAnimationFrame会在浏览器重绘时被调用
				frameId = requestAnimationFrame(frame);
                //将计算好的百分比传给实时更新函数
				updata(percent);
			}else{
				cancelAnimationFrame(frameId);
				//当歌曲播放完毕且歌曲为播放状态自动跳到下一首
				if(audio.status == "play"){
					$scope.find(".next-btn").trigger("click");
				}
			}
			
			//如果是暂停状态下拖动进度条触发的start(),不进行实时更新时间和进度条
			if(audio.status == "pause"){
				cancelAnimationFrame(frameId)
			}
		}
		frame();
	}

	//取消实时渲染
	function stop(){
		var stopTime = new Date().getTime();
		//这里注意要把lastPer加上,不然每次暂停lastPer的更新会错误
		lastPer = lastPer + (stopTime - startTime) / (curDuration * 1000);
		//取消requestAnimationFrame函数
		cancelAnimationFrame(frameId);
	}
	
	root.processor = {
		renderAllTime : renderAllTime,
		start : start,
		stop : stop,
		updata : updata
	}
})(window.Zepto,window.player || (window.player = {}))
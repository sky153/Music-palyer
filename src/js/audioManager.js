//控制音乐的播放
(function($,root){
	function audioControl(){
		//创建Audio对象
		this.audio = new Audio();
		//播放状态默认为暂停
		this.status = "pause";
	}
	audioControl.prototype = {
		play:function(){
			this.audio.play();
			this.status = "play";
		},
		pause:function(){
			this.audio.pause();
			this.status = "pause";
		},
		getAudio:function(src){
			this.audio.src = src;
			this.audio.load();
		},
		playTo:function(time){
			//Audio对象的currentTime属性设置或返回音频/视频播放的当前位置（以秒计）。
			this.audio.currentTime = time;
			//拖动进度条放下后如果歌曲原本是播放的就让它继续播放
			if(this.status == "play"){
				this.play();
			}

		}
	}
	root.audioControl = audioControl;
})(window.Zepto,window.player)
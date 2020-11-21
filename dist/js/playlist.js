(function($,root){
	var $scope = $(document.body);
    var control;
    var $playList = $("<div class = 'play-list'>"+
        "<div class='play-header'>播放列表</div>" + 
        "<ul class = 'list-wrapper'></ul>" +
        "<div class='close-btn'>关闭</div>"+
    "</div>")

    //渲染播放列表
    function renderList(songList){
        var html = '';
        for(var i = 0;i < songList.length;i++){
            html += "<li><h3 >"+songList[i].song+"-<span>"+songList[i].singer+"</span></h3></li>"
        }
        $playList.find("ul").html(html);
        $scope.append($playList);
        bindEvent();
    }
    //显示播放列表
    function show(controlmanager){
    	control = controlmanager; //将控制index的构造函数controlManager赋给control
    	$playList.addClass("show");
    	singSong(control.index);//给当前正在播放的歌曲加上样式
    }
    //播放列表点击事件
    function bindEvent(){
    	//点击关闭隐藏列表
    	$playList.on("click",".close-btn",function(){
    		$playList.removeClass("show");
    	})
    	//歌曲点击事件
    	$playList.find("li").on("click",function(){
    		var index = $(this).index();
    		singSong(index);
    		control.index = index; //将所点击的歌曲的index赋给controlManager()构造函数里的index
    		$scope.trigger("play:change",[index,true]);
    		$scope.find(".play-btn").addClass("playing");

    		//点击列表歌曲后200毫秒使列表隐藏
    		setTimeout(function(){
    			$playList.removeClass("show")
    		},200);
    	})
    }

    //给列表正在播放的歌曲添加样式
    function singSong(index){
    	$playList.find(".sign").removeClass("sign");
    	$playList.find("ul li").eq(index).addClass("sign");
    }

    root.playList = {
        renderList : renderList,
        show : show
    }

})(window.Zepto,window.player || (window.player = {}))
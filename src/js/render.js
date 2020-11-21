/*
	渲染数据
	给立即执行函数传入全局变量作为参数的好处：封装作用域,可以将立即执行函数里的变量或者函数赋值到全局
	变量window.player上又不会污染全局变量
*/
(function($,root){
	var $scope = $(document.body);
	//渲染当前这首歌的信息
	function renderInfo(info){
		var html = '<div class="song-name">'+info.song+'</div>'+
        '<div class="singer-name">'+info.singer+'</div>'+
        '<div class="album-name">'+info.album+'</div>';
        $scope.find(".song-info").html(html)
	}
	//渲染当前这首歌的图片
    function renderImg(src){
    	//创建背景图片
        var img = new Image();
        img.src = src;

        img.onload = function(){
            root.blurImg(img,$scope);//对背景图片进行高斯模糊处理(调用高斯模糊js里的blurImg方法)
        }
        
        $scope.find(".song-img img").attr("src",src);//同时将图片加载到歌曲相册上
    }
    //渲染是否是喜欢的歌
    function renderIsLike(isLike){
        if(isLike){
            $scope.find(".like-btn").addClass("liking");
        }else{
            $scope.find(".like-btn").removeClass("liking");
            
        }
    }

    root.render = function(data){
        renderInfo(data);
        renderImg(data.image);
        renderIsLike(data.isLike)
    }
})(window.Zepto,window.player || (window.player = {})) //容错处理,当window.player为undefined时初始化为空对象
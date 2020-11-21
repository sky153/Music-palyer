//处理并获取当前歌曲index
(function($,root){
    function controlManager(len){
    	//这两个变量是为下面处理index做准备
		this.index = 0;
		this.len = len;
	}
    //面向对象编程：原型上进行编程
    controlManager.prototype = {
        prev : function(){
        	// index--;
            return this.getIndex(-1);
        },
        next : function(){
        	//index++;
            return this.getIndex(1);
        },
        //写一个总方法来处理index,就不用在上面的prev和next方法下各自处理index
        getIndex : function(val){
            var index = this.index;
            var len = this.len;
            var curIndex = (index + val + len) % len;//小算法,用来处理index,让index可以在0~len-1之间循环

            this.index = curIndex;//刷新现在的index
            return curIndex;
        }
    }
    //将controlManger函数暴露到全局window.play变量上
    root.controlManager = controlManager;
})(window.Zepto,window.player || (window.player = {}));
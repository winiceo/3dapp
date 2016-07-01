;(function() {
	var defaultHead = wwwdomain + 'images/wall/unname.jpg';
	ImgUtils.loadImg(defaultHead);
	/** **************************弹幕 Start********************** */
	//创建弹幕对象
	var WallDanmu = function(wall){
		this.wall = wall;
		this.walldanmuConfig = null;
		this.dm = null;//生成弹幕对象
		this.curSort = 0;// 当前的消息标识
		this.openInterval = null;
		this.danmuLoop = true;//默认循环播放内容
	};
	WallDanmu.prototype = {
		firstInit: function(){
			var This = this;
			This.wall.register(Wall.Note.type.UPDATE_GLOBAL, function(data) {//设置修改实时通知
				if (data.noteType == 'walldanmuConfig') {
					//比较有哪些修改
					var changeArr = [];//修改的设置
					function checkChange(){
						var oldObj = This.walldanmuConfig;
						var newObj = data;
						for(var i = 0;i < arguments.length;i++){
							var key = arguments[i];
							if(oldObj[key] != newObj[key]){
								changeArr.push(key);
							}
						}
					}
					checkChange('circulate','style','position','fontsize','speed');
					This.walldanmuConfig = data;
					if(changeArr.length == 1 && changeArr[0] == 'speed'){
						//只改了速度
						var dmWidth = document.body.clientWidth;
						This.dm.conf.minTime = dmWidth/parseFloat(data.speed) - 1000;
						This.dm.conf.maxTime = dmWidth/parseFloat(data.speed) + 1000;
					}else if(changeArr.length == 1 && changeArr[0] == 'circulate'){
						This.danmuLoop = data.circulate;
					}else{
						//除速度以外的其他修改
						This.danmuLoop = data.circulate;
						This.initDanmu();
					}
				}
			});
			This.wall.getWallGlobalItem('walldanmuConfig', function(item) {
				This.walldanmuConfig = item;
				This.danmuLoop = item.circulate;
				This.initDanmu();
			});
			// 绑定事件
			$('#danmu').click(function(){
				var _this = $(this);
				if(_this.attr("class") == 'danmu-ban'){
					//要播放
					_this.removeClass('danmu-ban').addClass('danmu-open');
					$('#danmu-wall').fadeIn().css('opacity','1');
					clearInterval(This.openInterval);
					This.openInterval = setInterval(function(){
						This.wall.getWallMessage(This.curSort,1,'next',function(data){
							var obj = data.shift();
							if(obj){
								//记录当前sort
								This.curSort = obj.sort;
								if(obj.contentType === 'text'){
									obj.imgpath = obj.imgpath ? obj.imgpath.dealUrl() : defaultHead;
									This.dm.push(obj);
								}
							}else if(This.danmuLoop){//消息循环
								This.curSort = 0;
							}
						});
					},500);
				}else{
					//要暂停
					clearInterval(This.openInterval);
					This.openInterval = null;
					_this.removeClass('danmu-open').addClass('danmu-ban');
					$('#danmu-wall').css('opacity','0');
					$(this).find('.msg').remove();
				}
			});
		},
		initDanmu:function(){
			var This = this;
			var item = This.walldanmuConfig;
			var dmWidth = document.body.clientWidth;
			var fontsize = item.font_size;
			//生成对象
			This.dm = $('#danmu-wall').danMu({
				minTime : dmWidth/parseFloat(item.speed) - 1000,
				maxTime : dmWidth/parseFloat(item.speed) + 1000,
				position : item.position
			});

			if(item.style == 1){
				if(fontsize == 48){
					This.dm.conf.lineHeight = 78;
				}else{
					This.dm.conf.lineHeight = 64;
				}
				This.dm.conf.getMsgHtml = function(msgData){
					var arr = [];
					arr.push('<div class="simply simply');
					arr.push(Math.round(Math.random() * 4));
					arr.push(' font'+ fontsize +'"><img src="');
					arr.push(msgData.imgpath);
					arr.push('"><p>');
					arr.push(msgData.content);
					arr.push('</p></div>');
					return arr.join('');
				};
			}else{
				This.dm.conf.lineHeight = fontsize + 4;
				This.dm.conf.getMsgHtml = function(msgData){
					var arr = [];
					arr.push('<div class="rough font'+ fontsize +' rough'+ Math.round(Math.random() * 4) +'">');
					arr.push(msgData.content);
					arr.push('</div>');
					return arr.join('');
				};
			}
			This.dm.init();
		}
	};
	var wallDanmu = null;
	//实例化弹幕对象
	jQuery.wall.wallDanmu = function(wall) {
		if(wallDanmu) return wallDanmu;
		wallDanmu = new WallDanmu(wall);
		wallDanmu.firstInit();
		return wallDanmu;
	};
	$(window).resize(function(){
		setTimeout(function(){
			if(!wallDanmu) return;
			if(!wallDanmu.walldanmuConfig) return;
			dmWidth = document.body.clientWidth;
			var speed = wallDanmu.walldanmuConfig.speed;
			wallDanmu.dm.conf.minTime = dmWidth/parseFloat(speed) - 1000;
			wallDanmu.dm.conf.maxTime = dmWidth/parseFloat(speed) + 1000;
			//行数变化
		},500);
	});
})(jQuery);
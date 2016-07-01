;(function(){
	// 消息墙定义
	/******************************消息墙 start*********************************/
	/*获取指定数量、方向和开始位置的消息(direction: pre,next)*/
	Wall.prototype.getWallMessage = function(sort,count,direction,fn){
		var messageArr = [];
		var range = null;
		direction = direction.toLowerCase();
		if(sort){
			if('prev' == direction){
				range = [0,sort,true,true];
			} else {
				range = [sort,maxSort,true,true];
			}
		}
		this.db.objectStore(this.messageDb).index('sort').each(function(item){
			if(messageArr.length < count){
				if('Y' != item.value.hide && 'Pass' == item.value.auditState){
					if('prev' == direction){
						messageArr.unshift(item.value);//添加到开始
					}else{
						messageArr.push(item.value);
					}
				}
			}else{
				return false;
			}
		},range,direction).then(function(){
			fn(messageArr);
		},function(e){
			Debug.log('wall','getWallMessage错误消息',e);
			fn([]);
		});
	};
	/*获取指定Id的消息*/
	Wall.prototype.getWallMessageById = function(id,fn){
		if(!fn){fn = function(){};}
		try{
			this.db.objectStore(this.messageDb).get(parseInt(id)).then(function(item){
				fn(item);
			},function(e){
				Debug.log('wall','getWallMessageById错误消息',e);
				fn(null);
			});
		}catch(e){
			fn(null);
			console.error(e);
		}
	};
	/*--------------------------------------------------------------上面的操作都是针对数据库和后台交互使用----------------------------------------------------------------*/
	/*绑定热键*/
	var bindHotkeys = function(){
		$(document).bind('keyup.left',function (evt){
			$('#firstPage:visible').click();
		});
		$(document).bind('keyup.up',function (evt){
			$('#prevPage:visible').click();
		});
		$(document).bind('keyup.space',function (evt){
			$('#playPause:visible').click();
		});
		$(document).bind('keyup.down',function (evt){
			$('#nextPage:visible').click();
		});
		$(document).bind('keyup.right',function (evt){
			$('#lastPage:visible').click();
		});
	};
	/*解绑热键*/
	var unBindHotkeys = function(){
		$(document).unbind('keyup.left');
		$(document).unbind('keyup.up');
		$(document).unbind('keyup.space');
		$(document).unbind('keyup.down');
		$(document).unbind('keyup.right');
	};
	var WallMessage = function(wall) {
		this.initAlready = false;
		this.wall = wall;
		this.wallConfig = wallJson;
		this.autoPlayFlag = true;
		this.wallMessageConfig = null;
		this.onWallMessage = [];// 当前墙上的消息
		this.autoPlayControl = null;
		this.alreadyOnWallImg = [];//保存所有弹出过的图片url
		this.singleShow = false;//单条显示信息状态

		// 长时间没消息的处理
		this.autoLongTimeControl = null;
		this.oldWallMessage = [];

		// 设置消息条数
		this.tempStyle = JSON.parse(this.wallConfig.tempStyle);
		this.msgLg = this.tempStyle&&this.tempStyle.msglength ? parseInt(this.tempStyle.msglength) : 3 ;
	};
	// 初始化一次消息墙
	WallMessage.prototype.firstInit = function(fn) {
		Debug.log('WallMessage','firstInit');
		var _this = this;
		if(_this.initAlready){
			fn(true);
			return;
		}
		this.initAlready = true;
		// 做初始化
		/*------------------------------------更新通知注册-------------------------------------*/
		// 注册消息配置修改通知
		_this.wall.register(Wall.Note.type.UPDATE_GLOBAL,function(data){
			if (data.noteType == 'wallmsgConfig') {
				_this.wallMessageConfig = data;
				_this.autoPlay();
				if(data.showCount == 'Y'){
					$('#msgCount,#msgCount::before').show();
				}else{
					$('#msgCount,#msgCount::before').hide();
				}
			}
		});
		// 墙配置修改通知
		_this.wall.register(Wall.Note.type.UPDATE_WALL,function(data){
			var newTempStyle = JSON.parse(data.tempStyle);
			if(!newTempStyle.msglength){
				newTempStyle.msglength = 3;
			}
			if(_this.msgLg != newTempStyle.msglength){
				if(_this.msgLg > newTempStyle.msglength && _this.onWallMessage.length > newTempStyle.msglength){
					var lgs = _this.msgLg - newTempStyle.msglength;
					for(var i = 0; i < lgs; i++){
						$('.wall-multiple-info .wall-list').find('li').eq(0).remove();
						_this.onWallMessage.shift();
					}
				}
				_this.msgLg = newTempStyle.msglength ? parseInt(newTempStyle.msglength): 3;
			}
			if(data){
				_this.wallConfig = data;
			}
		});
		// 注册新消息通知
		_this.wall.register(Wall.Note.type.UPDATE_MESSAGE_COUNT,function(){
			// 还原旧数据到缓存
			if(_this.oldWallMessage.length > 0){
				_this.clearState();
				_this.onWallMessage = _this.oldWallMessage;
				_this.oldWallMessage = [];
				_this.reloadState();
			}
		});
		// 获取配置
		_this.wall.getWallGlobalItem('wallmsgConfig',function(item){
			_this.wallMessageConfig = item;
			fn(false);
		});
	};
	/*进入消息墙触发*/
	WallMessage.prototype.beforeActivity = function() {
		Debug.log('WallMessage','beforeActivity');
		var _this = this;
		// 绑定上一页下一页暂停等事件
		$('#firstPage').bind("click",function() {
			Debug.log('WallMessage','click','firstPage');
			_this.clearState();

			if(_this.singleShow){
				if($('.wall-single-list').is(':animated')) return;
				_this.singleFirstPage(function(){
					_this.reloadState();
				});
			}else{
				_this.firstPage(function(){
					_this.reloadState();
				});
			}
		});
		$('#prevPage').bind("click",function() {
			Debug.log('WallMessage','click','prevPage');
			_this.clearState();
			if(_this.singleShow){//进入单条模式
				if($('.wall-single-list').is(':animated')) return;
				_this.singlePrevPage(function(){
					_this.reloadState();
				});
			}else{
				_this.prevPage(function(){
					_this.reloadState();
				});
			}
		});
		$('#playPause').bind("click",function() {
			Debug.log('WallMessage','click','playPause');
			//播放暂停按钮的切换
			var _btn = $(this),
			_btni = _btn.find("i")[1];
			if (_btn.hasClass('noClick')) return false;
			if ($(_btni).hasClass("fa-pause")) {
				$(_btni).removeClass("fa-pause").addClass("fa-play");
				_btn.tooltipster('content', "开始，快捷键[空格]");
				_this.clearState();
				_this.autoPlayFlag = false;
			} else if ($(_btni).hasClass("fa-play")) {
				$(_btni).removeClass("fa-play").addClass("fa-pause");
				_btn.tooltipster('content', "暂停，快捷键[空格]");
				_this.autoPlayFlag = true;
				_this.reloadState();
			}
		});
		$('#nextPage').bind("click",function() {
			Debug.log('WallMessage','click','nextPage');
			if(_this.singleShow){//进入单条模式
				if($('.wall-single-list').is(':animated')) return;
				_this.singleNextPage(function(){
					_this.reloadState();
				});
			}else{
				_this.nextPage(function(){
					_this.reloadState();
				});
			}
		});
		$('#lastPage').bind("click",function() {
			Debug.log('WallMessage','click','lastPage');
			_this.clearState();
			if(_this.singleShow){
				//单条模式
				if($('.wall-single-list').is(':animated')) return;
				_this.singleLastPage(function(){
					_this.reloadState();
				});
			}else{
				_this.lastPage(function(){
					_this.reloadState();
				});
			}
		});
		// 绑定热键
		bindHotkeys();

		$('.wall-list').delegate('li .infostyle-show','click',function(){
			// 获取id
			var id = $(this).parents('li').attr('data-id');
			// 进入单条事件
			_this.single(id,function(){});
			_this.reloadState();
		});
		$('#wlk-wall-block').show();
		$('#wallcontrol .fr').hide();
		$('#wallcontrol #play-handle').css('display','inline');
		$('#audio-control').css('display', 'inline');
		_this.firstInit(function(flag){
			if(_this.wallMessageConfig.showCount == 'Y'){
				$('#msgCount,#msgCount::before').show();
			}else{
				$('#msgCount,#msgCount::before').hide();
			}
			/*活动初始化*/
			// 初始化消息的自动播放
			if(flag){
				_this.reloadState();
			}else{
				_this.nextPage(function(){
					_this.reloadState();
				});
			}
		});
	};
	/*离开消息墙触发*/
	WallMessage.prototype.afterActivity = function() {
		Debug.log('WallMessage','afterActivity');
		$('#wlk-wall-block').hide();
		$('#msgCount,#msgCount::before').hide();
		$('#wallcontrol .fr').css('display','none');
		this.clearState();
		//解绑播放，上一页，下一页按钮的点击事件
		$('#firstPage').unbind("click");
		$('#prevPage').unbind("click");
		$('#playPause').unbind("click");
		$('#nextPage').unbind("click");
		$('#lastPage').unbind("click");
		unBindHotkeys();// 解绑热键
	};
	/*清除当前的自动播放状态*/
	WallMessage.prototype.clearState = function(){
		Debug.log('WallMessage','clearState');
		clearInterval(this.autoPlayControl);
		this.autoPlayControl = null;
	};
	/*还原当前的自动播放状态*/
	WallMessage.prototype.reloadState = function(){
		Debug.log('WallMessage','reloadState');
		var _this = this;
		if(_this.autoPlayFlag){
			if(_this.singleShow){
				//单条轮播
				_this.singleAutoPlay();
			}else{
				//多条轮播
				_this.autoPlay();
			}
		}
		var _btn = $('#playPause');
		var _btni = _btn.find("i")[1];
		var toggleState = function(){
			if (_btn.hasClass('noClick')) return false;
			if ($(_btni).hasClass("fa-pause")) {
				$(_btni).removeClass("fa-pause").addClass("fa-play");
				_btn.attr("title", "开始").tooltipster('content', "开始");
				_this.clearState();
				_this.autoPlayFlag = false;
			} else if ($(_btni).hasClass("fa-play")) {
				$(_btni).removeClass("fa-play").addClass("fa-pause");
				_btn.attr("title", "暂停").tooltipster('content', "暂停");
				_this.autoPlayFlag = true;
				_this.reloadState();
			}
		};
		if(this.autoPlayFlag && $(_btni).hasClass("fa-play")){
			toggleState();
		}
		if(!this.autoPlayFlag && $(_btni).hasClass("fa-pause")){
			toggleState();
		}
	};
	/* 自动播放事件控制，autoPlayFlag=true为开始自动播放，autoPlayFlag=false暂停播放 */
	WallMessage.prototype.autoPlay = function() {
		Debug.log('WallMessage','autoPlay');
		var _this = this;
		if(_this.autoPlayFlag){
			clearInterval(_this.autoPlayControl);
			var time = ( _this.wallMessageConfig.turnTime || 4) * 1000;
			_this.autoPlayControl = setInterval(function(){
				_this.nextPage();
			},time);
		}else{
			_this.nextPage();
		}
	};
	/* 单条自动播放*/
	WallMessage.prototype.singleAutoPlay = function(){
		var _this = this;
		if(_this.autoPlayFlag){
			clearInterval(_this.autoPlayControl);
			var time = ( _this.wallMessageConfig.turnTime || 4) * 1000;
			_this.autoPlayControl = setInterval(function(){
				_this.singleNextPage();
			},time);
		}else{
			_this.singleNextPage();
		}
	};
	// 判断消息是否有在墙上
	var hasOnMessage = function(messageArr,onMessageArr){
		try {
			for(var i = 0;i < messageArr.length;i++){
				var itemMsg = messageArr[i];
				for(var j = 0;j < onMessageArr.length;j++){
					if(itemMsg.id == onMessageArr[j].id){
						return true;
					}
				}
			}
			return false;
		} catch (e) {
			return false;
		}
	};
	/*到首页*/
	WallMessage.prototype.firstPage = function(fn) {
		var _this = this;
		_this.wall.getWallMessage(0, _this.msgLg*2, 'next', function(nextMessage) {
			var count = nextMessage.length;
			if( _this.onWallMessage[0].id == nextMessage[0].id ){
				return;
			}
			if(count == _this.msgLg*2){
				for(var k=0; k<_this.msgLg; k++ ){
					_this.onWallMessage[k] = nextMessage[parseInt(_this.msgLg) + k ];
				}
			}
			_this.prevPage(fn);
		});
	};
	/* 上一页 */
	WallMessage.prototype.prevPage = function(fn) {
		Debug.log('WallMessage','prevPage');
		if(!fn){fn = function(){};}
		if($('.wall-list').is(":animated")){
			fn();
			return;
		}
		var _this = this;
		var sort = null;
		if (_this.onWallMessage.length) {
			sort = _this.onWallMessage[0].sort;
		}
		_this.wall.getWallMessage(sort, _this.msgLg, 'prev', function(prevMessage) {
			Debug.log('WallMessage','prevPage',sort,3,'next',prevMessage.length);
			if (prevMessage && prevMessage.length) {
				if(prevMessage.length < _this.msgLg){
					var arr = prevMessage.concat(_this.onWallMessage);
					if(arr.length > _this.msgLg){
						_this.onWallMessage = arr.slice(0,_this.msgLg);
					}else{
						_this.onWallMessage = arr;
					}
				}else{
					_this.onWallMessage = prevMessage;//存储数据
				}
				_this.animation(prevMessage,'prev',function(dataList){
					fn();
				});
			}else{
				fn();
			}
		});
	};
	/* 下一页 */
	WallMessage.prototype.nextPage = function(fn) {
		Debug.log('WallMessage','nextPage');
		if(!fn){fn = function(){};}
		if($('.wall-list').is(":animated")){
			fn();
			return;
		}
		var _this = this;
		var sort = null;
		if (_this.onWallMessage.length) {
			sort = _this.onWallMessage[_this.onWallMessage.length - 1].sort;
		}
		var count = _this.msgLg - _this.onWallMessage.length;
		if(count < 1){
			count = _this.msgLg;
		}
		_this.wall.getWallMessage(sort, count, 'next', function(nextMessage) {
			Debug.log('WallMessage','nextPage',sort,count,'next',nextMessage.length);
			if (nextMessage && nextMessage.length) {
				clearTimeout(_this.autoLongTimeControl);// 清除倒计时
				_this.autoLongTimeControl = null;
				if(nextMessage.length < _this.msgLg){
					var arr = _this.onWallMessage.concat(nextMessage);
					if(arr.length > _this.msgLg){
						_this.onWallMessage = arr.slice(arr.length - _this.msgLg);
					}else{
						_this.onWallMessage = arr;
					}
				}else{
					_this.onWallMessage = nextMessage;//存储数据
				}
				_this.animation(nextMessage,'next',function(dataList){
					// 翻页动画结束
					if(_this.wallConfig.useMode == 'Y'){
						// 进行图片的大图弹出展示
						_this.clearState();
						var imgAnimationArr = jQuery.extend(true,{}, nextMessage);
						var arr = [];
						for(var i = 0 ;i < nextMessage.length;i++){
							arr.push(imgAnimationArr[i]);
						}
						_this.imgAnimation(arr,function(){
							_this.reloadState();
							fn();
						});
					}else{
						try {
							// 非流畅模式要默认把图片url放入到缓存中
							for(var j = 0;j < nextMessage.length;j++){
								var item = nextMessage[i];
								if(item.contentType == 'image'){
									_this.alreadyOnWallImg.push(item.content);
								}
							}
						} catch (e) {
							Debug.log('WallMessage','图片消息缓存失败',e);
						}
						fn();
					}
				});
			}else{
				// 开始3分钟倒计时
				var count = parseInt($('#msgCount span').html());
				if(isNaN(count)){
					count = 0;
				}
				if(null == _this.autoLongTimeControl && count > _this.msgLg){
					_this.autoLongTimeControl = setTimeout(function(){
						_this.oldWallMessage = _this.onWallMessage;
						_this.onWallMessage = [];
						_this.autoLongTimeControl = null;
					},180000);
				}
				fn();
			}
		});
	};
	/*到尾页*/
	WallMessage.prototype.lastPage = function(fn) {
		var _this = this;
		_this.wall.getWallMessage(maxSort, _this.msgLg*2, 'prev', function(nextMessage) {
			if( _this.onWallMessage[_this.onWallMessage.length-1].id == nextMessage[nextMessage.length-1].id ){
				return;
			}
			var count = nextMessage.length;
			if(count == _this.msgLg*2 ){
				for(var k=0; k<_this.msgLg; k++ ){
					_this.onWallMessage[k] = nextMessage[ k ];
				}
			}
			_this.nextPage(fn);
		});
	};
	/*单条下一页*/
	WallMessage.prototype.singleNextPage = function(fn){
		var _this = this;
		var sort = null;
			sort = parseInt($('.wall-single-list').find('li').attr('data-sort'));
		var count = 1;
		var upMoreMsg = false;
		_this.wall.getWallMessage(sort, count, 'next', function(nextMessage) {
			if(nextMessage.length){
				clearTimeout(_this.autoLongTimeControl);// 清除倒计时
				_this.autoLongTimeControl = null;
				var html = _this.singleHtml(nextMessage[0]);
				for(var i=0; i<_this.onWallMessage.length; i++){
					if(nextMessage[0].sort != _this.onWallMessage[i].sort){
						upMoreMsg = true;
					}else{
						upMoreMsg = false;
						break;
					}
				}
				$('.wall-single-list').append(html);
				$('.wall-single-list').animate({"left":"-100%"},300,function(){
					$('.wall-single-list').find('li').eq(0).remove();
					$('.wall-single-list').css('left',0);
					fn && fn();
				});
				if(upMoreMsg ){
					_this.onWallMessage.push(nextMessage[0]);
					_this.onWallMessage.shift();
					_this.animation(nextMessage,'next');
				}
			}else{
				var count = parseInt($('#msgCount span').html());
				if(isNaN(count)){
					count = 0;
				}
				if(!_this.autoLongTimeControl && count > _this.msgLg){
					_this.autoLongTimeControl = setTimeout(function(){
						_this.oldWallMessage = _this.onWallMessage;
						_this.onWallMessage = [];
						_this.autoLongTimeControl = null;
					},180000);
				}
				fn && fn();
			}
		});
	};
	/*单条到尾页*/
	WallMessage.prototype.singleLastPage = function(fn) {
		var _this = this;
		_this.wall.getWallMessage(maxSort, _this.msgLg, 'prev', function(nextMessage) {
			if(nextMessage.length){
				clearTimeout(_this.autoLongTimeControl);// 清除倒计时
				_this.autoLongTimeControl = null;
				var sort = parseInt($('.wall-single-list li').attr('data-sort'));
				if(sort == nextMessage[nextMessage.length - 1 ].sort) return;
				var count = nextMessage.length;
				if(count > 0 ){
					for(var k=0; k<count; k++ ){
						_this.onWallMessage[k] = nextMessage[ k ];
					}
				}
				var html = _this.singleHtml(nextMessage[nextMessage.length-1]);
				$('.wall-single-list').append(html);
				$('.wall-single-list').animate({"left":"-100%"},300,function(){
					$('.wall-single-list').find('li').eq(0).remove();
					$('.wall-single-list').css('left',0);
				});
				_this.animation(nextMessage,'prev');
				fn && fn();
			}else{
				var count = parseInt($('#msgCount span').html());
				if(isNaN(count)){
					count = 0;
				}
				if(!_this.autoLongTimeControl && count > _this.msgLg){
					_this.autoLongTimeControl = setTimeout(function(){
						_this.oldWallMessage = _this.onWallMessage;
						_this.onWallMessage = [];
						_this.autoLongTimeControl = null;
					},180000);
				}
				fn();
			}
		});
		//fn&&fn();
	};
	/*单条上一页*/
	WallMessage.prototype.singlePrevPage = function(fn){
		var _this = this;
		var sort = null;
		sort = parseInt($('.wall-single-list').find('li').attr('data-sort'));
		var count = 1;
		var upMsg = false;
		_this.wall.getWallMessage(sort, count, 'prev', function(nextMessage) {
			if(!nextMessage.length) return;
			console.log(nextMessage);
			for(var k=0; k<_this.onWallMessage.length; k++){
				if(nextMessage[0].sort != _this.onWallMessage[k].sort){
					upMsg = true;
				}else{
					upMsg =false;
					break;
				}
			}
			if( upMsg ){
				_this.onWallMessage.pop();
				_this.onWallMessage.unshift(nextMessage[0]);
				_this.animation(nextMessage,'prev');
			}
			var html = _this.singleHtml(nextMessage[0]);
			$('.wall-single-list li').before(html);
			$('.wall-single-list').css('left','-100%').animate({"left":"0"},300,function(){
				$('.wall-single-list').find('li').last().remove();
				fn && fn();
			});
		});
	};
	/*单条到首页*/
	WallMessage.prototype.singleFirstPage = function(fn){
		var _this = this;
		_this.wall.getWallMessage(0, this.msgLg, 'next',function(nextMessage){
			if( !nextMessage ) return;
			var sort = $('.wall-single-list').find('li').attr('data-sort');
			if(sort == nextMessage[0].sort) return;
			for(var i=0; i<nextMessage.length ; i++){
				_this.onWallMessage[i] = nextMessage[i];
			}
			var html = _this.singleHtml(nextMessage[0]);
			$('.wall-single-list li').before(html);
			$('.wall-single-list').css('left','-100%').animate({"left":"0"},300,function(){
				$('.wall-single-list').find('li').last().remove();
			});
			_this.animation(nextMessage,'next');
		});
		fn && fn();
	};
	/*图片弹出动画*/
	WallMessage.prototype.imgAnimation = function(dataList,fn) {
		Debug.log('WallMessage','imgAnimation');
		if(!fn){
			fn = function(){};
		}
		if(!dataList.length){
			fn();
			return;
		}
		var _this = this;
		var item = dataList.shift();
		if(item.contentType == 'image'){
			// 弹出图片
			var url = item.content;
			var styleObj = item.style;
			var rotate = 0;
			if(styleObj){
				try{
					var styleJson = JSON.parse(styleObj);
					rotate = styleJson.rotate;
				}catch(e){
				}
			}
			if(_this.alreadyOnWallImg.indexOf(url) == -1){
				_this.alreadyOnWallImg.push(url);
				// 判断是否是消息墙
				if(_this.wall.currentActivityType == Wall.Activity.type.ACTIVITY_MSG){
					ImgView.show({
						url: url,
						rotate: rotate,
						autoCloseMillisecond: 3000,
						close: function(){
							_this.imgAnimation(dataList,fn);
						}
					});
				}
			}else{
				_this.imgAnimation(dataList,fn);
			}
		}else{
			_this.imgAnimation(dataList,fn);
		}
	};
	/*播放动画*/
	WallMessage.prototype.animation = function(dataList,direction,fn) {
		Debug.log('WallMessage','animation');
		var html = '',
			_this = this,
			length = dataList.length,
			scrollHeight = 180;
		if(_this.msgLg == 3){
			scrollHeight = 180;
		}else if(_this.msgLg == 4 ){
			scrollHeight = 135;
		}else if(_this.msgLg == 5 ){
			scrollHeight = 110;
		}
		var lineNum = [] ;  //控制消息显示多少行
		for ( var i = 0;i < length;i++ ) {
			lineNum[i] = 0;
			var item = dataList[i];
			var avarta = item && item['imgpath'] ? item['imgpath'].dealUrl() :'/images/wall/example-ico.png';//头像
			var nickName = item && item['nickName'] ? item['nickName'] :'';//昵称
			var updateDate = item && item['updateDate'] ? item['updateDate'].formatDate('yyyy-MM-dd hh:mm') : '';

			if(showFullName){
				var signUser = cacheSignUser[item.wxUserId];
				if(signUser){
					nickName = signUser.noteName || signUser.name || nickName;
				}
			}

			var content = '';
			if(item.contentType == 'image'){
				//消息类型为图片
				if(!item.content){
					item.content = '';
				}
				var styleObj = item.style;
				var rotate = 0;
				if(styleObj){
					var styleJson = JSON.parse(styleObj);
					rotate = styleJson.rotate;
				}
				var style = 'transform: rotate(' + rotate + 'deg);';
				content = '<img style="' + style + '" width="80" height="80" src="'+item.content.dealUrl()+'">';
			}else {
				//消息类型为文字
				content = item.content;
				var styleName = _this.wallConfig.styleName ?_this.wallConfig.styleName :'defaults';
				var grid = window.tempGlobal[styleName].style;
				if(grid == 'grid-top'){
					//设置显示多少行
					if(content.length < 8 ){
						lineNum[i] = 1;
					}else if(content.length <31){
						lineNum[i] = 2;
					}else{
						lineNum[i] = 3;
					}
				}else{
					//设置显示多少行
					if(content.length < 6 ){
						lineNum[i] = 1;
					}else if(content.length <13){
						lineNum[i] = 2;
					}else{
						lineNum[i] = 3;
					}
				}
			}
			html += '<li data-id="' + item.id + '"><div class="custom-bg"></div>';
			html += '<div class="infostyle-show">';
			html +=	'<span class="cotrol-style"><i class="fa fa-arrow-circle-o-right"></i></span>';
			html +=	'</div>';
			html +=	'<div class="info-box">';
			html += '<div class="wall-tab wall-ig"><div class="hd-style none"></div>';
			html +=	'<img src="' + avarta + '" width="120" height="120">';
			html +=	'</div>';
			html +=	'<div class="wall-tab wall-conent">';
			html +=	'<div class="wall-nickname">'+nickName+'</div>';
			html +=	'<div class="wall-continfo ';
			if(lineNum[i]){
				html += 'lineText-'+lineNum[i];
			}
			html += '">' + content +'</div></div>';
			html += '<div class="wall-tab wall-time">' + updateDate + '</div>';
			html += '</div></li>';
		}
		if(direction == 'prev'){
			//上一页
			$('.wall-multiple-info .wall-list').prepend(html).show();
			var liLength = $('.wall-list').find('li').length;
			var newLength = dataList.length;

			$('.wall-list').css("margin-top",-(newLength)*scrollHeight);

			$('.wall-list').find('li:lt(' + newLength + ')').addClass('past');
			$('.wall-list').animate({'margin-top':'0'},300,function(){
				$('.wall-list').find("li").slice(_this.msgLg).remove();
				$('.wall-list').find('li').removeClass('past');
				 /* 结束后回调 */
				 if (fn) {fn(dataList);}
			});
		}else{
			//下一页
			$('.wall-multiple-info .wall-list').append(html).show();
			var limtLg = $('.wall-list').find('li').length;
			if(limtLg <= _this.msgLg){
				//第一页,不显示动画
				/* 执行图片的弹出显示动画 */
			    //tobig();
			    /* 结束后回调 */
				 if (fn) {fn(dataList);}
			}else{
				//不是第一页，添加动画
				if(dataList.length == _this.msgLg){
					$('.wall-list').find('li').addClass('future');
				}else{
					var x = $('.wall-list').find('li').length - dataList.length - 1;
					$('.wall-list').find('li:gt(' + x + ')').addClass('future');
				}
				var liLength = $('.wall-list').find('li').length;
				$('.wall-list').animate({'margin-top':-(liLength - _this.msgLg)*scrollHeight},300,function(){
					$('.wall-list').find("li").slice(0,liLength - _this.msgLg).remove();
					$('.wall-list').css('margin-top','0');
					$('.wall-list').find('li').removeClass('future');
					/* 执行图片的弹出显示动画 */
					//tobig();
					/* 结束后回调 */
					if (fn) {fn(dataList);}
				});
			}
		}
	};
	/*单条消息处理*/
	WallMessage.prototype.single = function(id,fn) {
		Debug.log('WallMessage','single');
		var _this = this;
		this.singleShow = true;
		// 查询单条数据
		_this.wall.getWallMessageById(id,function(item){
			if(!item){
				return;
			}
			// 清除播放状态
			var html = _this.singleHtml(item);
			// 放入页面,单条显示
			$('.wall-single-list').empty().append(html);
			if(item.contentType == 'image'){
				$('.wall-single-list li .single-content').css('overflow','hidden');
				ImgUtils.dealImgRotate({
					imgObj: $('.single-content img'),
					maxWidth: 990,
					maxHeight: 350,
					callBack: function(width,height){
						var marginTop = '-' + (height-width)/2 + 'px';
						$('.single-content img').css("margin-top",marginTop);
					}
				});
			}
			$('.wall-single-info').show(function(){
				$('.wall-single-list').delegate('.sing-info-close','click',function(){
					$('.wall-multiple-info').show();
					$('.wall-single-info').hide();
					_this.singleShow = false;
					_this.reloadState();//重启自动播放
				});
			});
			// 多条隐藏
			$('.wall-multiple-info').hide();
		});
	};
	WallMessage.prototype.singleHtml = function(item){
		var html = '';
		// 拼装单条数据
		var avarta = item && item['imgpath'] ? item['imgpath'].dealUrl() :'/images/wall/example-ico.png';//头像
		var nickName = item && item['nickName'] ? item['nickName'] :'';//昵称
		var updateDate = item && item['updateDate'] ? item['updateDate'].formatDate('yyyy-MM-dd hh:mm') : '';

		if(showFullName){
			var signUser = cacheSignUser[item.wxUserId];
			if(signUser){
				nickName = signUser.noteName || signUser.name || nickName;
			}
		}

		var content = '';
		if(item.contentType == 'image'){
			//消息类型为图片
			if(!item.content){
				item.content = '';
			}
			var styleObj = item.style;
			var rotate = 0;
			if(styleObj){
				var styleJson = JSON.parse(styleObj);
				rotate = styleJson.rotate;
			}
			var style = 'transform: rotate(' + rotate + 'deg);';
			content = '<div class="single-content-img"><img style="' + style + '" src="'+item.content.dealUrl()+'"></div>';
		}else {
			//消息类型为文字
			content = item.content;
		}
		html += '<li data-sort="'+item.sort+'"><div class="custom-bg"></div>';
		html += '<div class="sing-info-close">×</div>';
		html += '<div class="single-hd">';
		html += '<div class="single-img"><img src="' + avarta + '" width="100" height="100"></div>';
		html += '<div class="single-nickname">' + nickName + '</div>';
		html += '<div class="single-time">' + updateDate + '</div>';
		html += '</div>';
		html += '<div class="single-content">' + content + '</div>';
		html += '</li>';
		return html;
	};
	jQuery.wall.wallMessage = function(wall){
		Wall.Activity.type.ACTIVITY_MSG = 'ACTIVITY_MSG';
		var wallMessage = new WallMessage(wall);
		wall.registerActivity(Wall.Activity.type.ACTIVITY_MSG,wallMessage);
		return wallMessage;
	};
})(jQuery);
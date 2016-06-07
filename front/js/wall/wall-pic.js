;(function() {
	/** **************************图片墙 Start********************** */
	/* 获取图片墙的列表 */
	Wall.prototype.getWallPicMessage = function(direction, fn) {
		Debug.log('WallPicture', 'getWallPicMessage');
		var flag = false;
		var messageArr = [];
		this.db.objectStore(this.messageDb).index('contentType').each(function(item) {
			var value = item.value;
			if (value.hide != 'Y') {
				if ('prev' == direction.toLowerCase()) {
					messageArr.unshift(value);// 添加到开始
				} else {
					messageArr.push(value);
				}
			}else{
				return false;
			}
		}, ['image'], direction).then(function() {
			fn(messageArr);
		}, function(e) {
			Debug.log('getWallPicMessage', e);
			fn([]);
		});
	}
	/* 获取图片墙的列表 */
	Wall.prototype.getWallLocalPic = function(fn) {
		var picArr = [];
		this.db.objectStore(this.localPicDb).each(function(item) {
			var value = item.value;
			if(value['deleteTag'] == 'N'){
				picArr.push(value);
			}
		}, null, 'next').then(function() {
			fn(picArr);
		}, function(e) {
			Debug.log('getWallLocalPic 错误消息', e);
			fn([]);
		});
	}
	Wall.prototype.insertLocalPic = function(picArr, fn) {
		var _this = this;
		if (!fn) {
			fn = function() {
			};
		}
		if (!picArr || picArr.length == 0) {
			fn(_this);
			return;
		}
		var store = _this.db.objectStore(_this.localPicDb);
		var data = picArr.shift();
		// 图片预加载
		ImgUtils.loadImg(data.imgPath);
		
		store.put(data,data.id).then(function() {
			_this.insertLocalPic(picArr, fn);
		}, function(e) {
			Debug.log('insertLocalPic数据更新失败', data, e);
			_this.insertLocalPic(picArr, fn);
		});// 保存
	}
	// 本地图新增
	Wall.prototype.newLocalPic = function(response){
		var data = response.data;
		var store = this.db.objectStore(this.localPicDb);
		if($.type(data) === 'array'){
			for(var i = 0 ;i < data.length;i++){
				store.put(data[i],data[i].id);
			}
		}else{
			store.put(data,data.id);
		}
	}
	// 本地图删除
	Wall.prototype.deleteLocalPicById = function(response){
		var data = response.data;
		var store = this.db.objectStore(this.localPicDb);
		for (var i = 0; i < data.length; i++) {
			var id = data[i];
			store.get(id).then(function(item){
				item['deleteTag'] = 'Y';
				store.put(item,id);
			});
		}
	}
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
	}
	/*解绑热键*/
	var unBindHotkeys = function(){
		$(document).unbind('keyup.left');
		$(document).unbind('keyup.up');
		$(document).unbind('keyup.space');
		$(document).unbind('keyup.down');
		$(document).unbind('keyup.right');
	}
	var WallPicture = function(wall) {
		Debug.log('WallPicture', 'WallPicture');
		this.initAlready = false;
		this.wall = wall;

		this.autoPlayFlag = true;

		this.interTime = 4000;
		this.opacityTime = 300;
		this.pauseBtn = 15000;

		this.onWallPicture = [];
		this.autoPlayControl = null;

		this.currentIndex = 0;
		this.allPic = [];
		
		this.wallpicConfig = null;
	}
	// 初始化一次消息墙
	WallPicture.prototype.firstInit = function(fn) {
		Debug.log('WallPicture', 'firstInit');
		var _this = this;
		if (_this.initAlready) {
			fn(true);
			return;
		}
		this.initAlready = true;
		// 做初始化
		_this.wall.register(Wall.Note.type.NEW_MESSAGE, function(data) {
			Debug.log('WallPicture', 'newPic');
			// 图片是否
			if(_this.wallpicConfig && _this.wallpicConfig.source != 'LocalPic'){
				if (data.contentType == 'image') {
					var viewPic = new ViewPic();
					viewPic.id = data.id;
					viewPic.imgPath = data.content;
					viewPic.style = data.style;
					if (_this.allPic.indexOf(viewPic) == -1) {
						_this.allPic.insert(_this.currentIndex + 1, viewPic);
					}
				}
			}
		});
		_this.wall.register(Wall.Note.type.UPDATE_GLOBAL, function(data) {
			if (data.noteType == 'wallpicConfig') {
				_this.refresh(data);
			}
		});
		_this.wall.getWallGlobalItem('wallpicConfig', function(item) {
			_this.getShowData(item, function(){
				fn(false);
			});
		});
	}
	WallPicture.prototype.beforeActivity = function() {
		Debug.log('WallPicture', 'beforeActivity');
		var _this = this;
		/* 活动初始化 */
		$('#firstPage').bind("click",function() {
			Debug.log('WallPicture', 'click','firstPage');
			_this.clearState();
			_this.firstPage(function(){
				_this.reloadState();
			});
		});
		$('#prevPage').bind("click", function() {
			Debug.log('WallPicture', 'click','prevPage');
			_this.clearState();
			_this.prevPage(function(){
				_this.reloadState();
			});
		});
		$('#playPause').bind("click", function() {
			// 播放暂停按钮的切换
			var _btn = $(this);
			_btni = _btn.find("i")[1];
			if (_btn.hasClass('noClick'))
				return false;
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
		$('#nextPage').bind("click", function() {
			Debug.log('WallPicture', 'click','nextPage');
			_this.clearState();
			_this.nextPage(function(){
				_this.reloadState();
			});
		});
		$('#lastPage').bind("click",function() {
			Debug.log('WallPicture', 'click','lastPage');
			_this.clearState();
			_this.lastPage(function(){
				_this.reloadState();
			});
		});
		// 绑定热键
		bindHotkeys();

		$('#picture-wall-block').show();
		$('#wallcontrol #play-handle').show();
		_this.firstInit(function(flag) {
			/* 活动初始化 */
			if(flag){
				_this.reloadState();
			}else{
				_this.nextPage(function(){
					_this.reloadState();
				});
			}
		});
	}
	WallPicture.prototype.afterActivity = function() {
		Debug.log('wall-pic', 'afterActivity');
		$('#picture-wall-block').hide();
		$('#wallcontrol .fr').hide();
		this.clearState();
		// 解绑播放，上一页，下一页按钮的点击事件
		$('#firstPage').unbind("click");
		$('#prevPage').unbind("click");
		$('#playPause').unbind("click");
		$('#nextPage').unbind("click");
		$('#lastPage').unbind("click");
		unBindHotkeys();// 解绑热键
	}
	function ViewPic() {
		this.id = 0;
		this.imgPath = '';
		this.style = '';
	}
	/* 清除当前的自动播放状态 */
	WallPicture.prototype.clearState = function() {
		Debug.log('WallPicture', 'clearState');
		clearInterval(this.autoPlayControl);
		this.autoPlayControl = null;
	}
	/* 还原当前的自动播放状态 */
	WallPicture.prototype.reloadState = function() {
		Debug.log('WallPicture', 'reloadState');
		var _this = this;
		if (_this.autoPlayFlag) {
			_this.autoPlay();
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
		}
		if(this.autoPlayFlag && $(_btni).hasClass("fa-play")){
			toggleState();
		}
		if(!this.autoPlayFlag && $(_btni).hasClass("fa-pause")){
			toggleState();
		}
	}
	/* 刷新数据,从第一页开始 */
	WallPicture.prototype.refresh = function(data,fn) {
		Debug.log('WallPicture', 'refresh');
		var _this = this;
		var getDataCallBack = function() {
			if (_this.allPic.length > 0) {
				_this.reloadState();
				if(!fn){
					fn = function(){}
				}
				fn();
			} else {
				setTimeout(function() {
					_this.refresh();
				}, 1000);
			}
		}
		if (data) {
			// 用于外部通知使用
			_this.getShowData(data, getDataCallBack);
			_this.wallpicConfig = data;
		} else {
			_this.wall.getWallGlobalItem('wallpicConfig', function(item) {
				_this.getShowData(item, getDataCallBack);
				_this.wallpicConfig = item;
			});
		}
	}
	// 按照配置信息进行显示
	WallPicture.prototype.getShowData = function(item, fn) {
		Debug.log('WallPicture', 'getShowData');
		if (null != item) {
			var _this = this;
			if (item.source == 'LocalPic') {
				_this.wall.getWallLocalPic(function(
						allMessage) {
					Debug.log('WallPicture', 'LocalPic getWallLocalPic', '图片总数'
							+ allMessage.length);
					// 排重
					var map = new Map();
					for (var i = 0; i < allMessage.length; i++) {
						var viewPic = new ViewPic();
						viewPic.id = allMessage[i].id;
						viewPic.imgPath = allMessage[i].imgPath;
						map.put(viewPic.imgPath, viewPic);
					}
					_this.currentIndex = -1;
					_this.allPic = map.values();
					fn();
				});
			} else {
				_this.wall.getWallPicMessage('next', function(
						allMessage) {
					Debug.log('WallPicture', '微信 getWallLocalPic', '图片总数'
							+ allMessage.length);
					// 排重
					var map = new Map();
					for (var i = 0; i < allMessage.length; i++) {
						var viewPic = new ViewPic();
						viewPic.id = allMessage[i].id;
						viewPic.imgPath = allMessage[i].content;
						viewPic.style = allMessage[i].style;
						map.put(viewPic.imgPath, viewPic);
					}
					_this.currentIndex = -1;
					_this.allPic = map.values();
					fn();
				});
			}
		}
	}
	/* 自动播放事件控制，autoPlayFlag=true为开始自动播放，autoPlayFlag=false暂停播放 */
	WallPicture.prototype.autoPlay = function() {
		var _this = this;
		if (_this.autoPlayFlag) {
			if (null != _this.autoPlayControl) {
				Debug.log('WallPicture autoPlay 重复定时');
				return;
			}
			_this.autoPlayControl = setInterval(function() {
				Debug.log('WallPicture', 'autoPlay');
				_this.nextPage();
			}, 4000);
		}
	}
	/*到首页*/
	WallPicture.prototype.firstPage = function(fn) {
		var _this = this;
		_this.currentIndex = -1;
		_this.nextPage(fn);
	}
	/* 上一页 */
	WallPicture.prototype.prevPage = function(fn) {
		var _this = this;
		_this.currentIndex--;
		Debug.log('WallPicture', 'prevPage', _this.currentIndex);
		var item = _this.allPic[_this.currentIndex];
		if (item) {
			_this.animation(item, fn);
		} else {
			_this.currentIndex = _this.allPic.length - 1;
			_this.animation(_this.allPic[_this.currentIndex],fn);
		}
	}
	/* 下一页 */
	WallPicture.prototype.nextPage = function(fn) {
		var _this = this;
		_this.currentIndex++;
		Debug.log('WallPicture', 'nextPage', _this.currentIndex);
		var item = _this.allPic[_this.currentIndex];
		if (typeof item != 'undefined' && item) {
			_this.animation(item,fn);
		} else {
			_this.refresh(null,function(){
				_this.currentIndex = 0;
				item = _this.allPic[_this.currentIndex];
				_this.animation(item,fn);
			});
		}
	}
	/*到尾页*/
	WallPicture.prototype.lastPage = function(fn) {
		var _this = this;
		var length = _this.allPic.length;
		_this.currentIndex = length - 2;
		_this.nextPage(fn);
	}
	WallPicture.prototype.animation = function(data, fn) {
		Debug.log('WallPicture', 'animation', data);
		if (!fn) {
			fn = function() {
			};
		}
		var imgObj = $('#picture-wall-block .slider img');

		if (imgObj.attr('src') == data.imgPath.dealUrl()) {
			return;
		}
		var styleObj = data.style;
		var rotate = 0;
		if (null != styleObj) {
			try {
				var styleJson = JSON.parse(styleObj);
				rotate = styleJson.rotate;
			} catch (e) {
			}
		}

		var style = 'rotate(' + rotate + 'deg)';
		imgObj.css('transform', style);

		imgObj.fadeOut(200, function() {
			imgObj.attr('src', data.imgPath.dealUrl());
			ImgUtils.dealImgRotate({
				imgObj : imgObj,
				maxWidth : 990,
				maxHeight : 540,
				callBack : function(width,height) {
					if(rotate % 180 != 0){
						var marginTop = '-' + (height-width)/2 + 'px';
						imgObj.css("margin-top",marginTop);
					}				
					imgObj.fadeIn(200, function() {
						fn();
					});
				}
			});
		});
	};
	/** **************************图片墙 end********************** */
	jQuery.wall.wallPicture = function(wall) {
		Wall.Activity.type.ACTIVITY_PIC = 'ACTIVITY_PIC';

		var wallPicture = new WallPicture(wall);

		wall.registerActivity(Wall.Activity.type.ACTIVITY_PIC,wallPicture);

		return wallPicture;
	};
})(jQuery);
;(function() {
	// 数钱人数更新
	Wall.prototype.moneyGuestCount = function(response) {
		var a = this.getActivity(Wall.Activity.type.ACTIVITY_MONEY);
		a.partNum = response.data;
		$('.part-num').html(a.partNum);
	};
	Wall.prototype.wallMoneyStart = function(response){
		try {
			this.noteAll(Wall.Note.type.WALL_MONEY_START,response.data);
		} catch (e) {
		}
	};
	
	// 手机控制台
	Wall.prototype.mcToggleMoneyStart = function(){
		$('#wall-amount-money .money-play-box:visible #amout-moner:visible').trigger('click');
	};
	Wall.prototype.mcToggleMoneyNext = function(){
		$('#wall-amount-money #fight-result:visible .money-double').trigger('click');
	};
	// 数钱游戏定义
	/******************************消息墙 start*********************************/
	/*绑定热键*/
	var bindHotkeys = function() {
		$(document).bind('keyup.space', function(evt) {
			if ($('#amout-moner').is(':visible')) {
				$('#amout-moner:visible').click();
			}
			if ($('.money-double').is(':visible')) {
				$('.money-double:visible').click();
			}
		});
		//活动切换控制热键
		$(document).bind('keyup.up',function(evt){
			$('#prevGame').click();
		});
		$(document).bind('keyup.down',function(evt){
			$('#nextGame').click();
		});
	};
	/*解绑热键*/
	var unBindHotkeys = function() {
		$(document).unbind('keyup.space');
		//活动切换控制热键
		$(document).unbind('keyup.up');
		$(document).unbind('keyup.down');
	};

	function WallMoney(wall) {
		this.wall = wall;
		this.initAlready = false;
		this.wallmoneyConfig = null;

		this.partNum = 0; // 参与人数

		this.control = $('#amout-moner'); //开始按钮
		this.joinUser = $('#wall-amount-money .part-num'); //参加人数
		this.defaultTit = $('#wall-amount-money .stage-tite'); //活动标题
		this.startDown = $('.amount-down-num'); //倒计时标题
		this.timeDown = $('.amount-down-time'); //倒计时数字
		this.countTotal = 3; //倒计时时间
		this.stageResult = $('#fight-result'); //结果页面
		this.defaultWall = $('.money-play-box'); //默认初始的墙

		this.gameWall = {}; //墙的信息
		this.gameSet = {}; //游戏配置
		this.stageBefore = $('.money-play-box'); //游戏未开始
		this.stageLuck = $('#fight-luck'); //拼手气页面

		this.gameTime = $('.time-down-num'); //游戏时间倒计时
		this.timeDownTite = $('#courdown-tite');
		this.interval = null; //监控定时取数据
		this.maxColumnH = 280; //柱形图最大高度
		this.cacheList = null; //缓存有序用户列表

		this.againDom = $('.money-double'); //再来一次

		this.playingAjax = null; //活动进行中进行数据更新
		this.init();

		this.active = false;
	}
	WallMoney.prototype.firstInit = function(fn) {
		var _this = this;
		if (_this.initAlready) {
			fn(true);
			return;
		}
		this.initAlready = true;

		_this.wall.register(Wall.Note.type.UPDATE_GLOBAL, function(data) {
			if (data.noteType == 'wallmoneyConfig') {
				// 配置修改了
				_this.wallmoneyConfig = data;
				_this.cacheList = [];
				$('.scale-user').empty();
				// 重新初始化
				_this.control.show();
				_this.defaultTit.show();
				_this.stageResult.hide();
				_this.startDown.hide();

				_this.getGameSet();
			}
		});
		_this.wall.register(Wall.Note.type.WALL_MONEY_START,function(data){
			if(!_this.active){
				if ($('#amout-moner').is(':visible')) {
					$('#amout-moner:visible').click();
				}
			}
		});
		// 获取配置
		_this.wall.getWallGlobalItem('wallmoneyConfig', function(item) {
			_this.wallmoneyConfig = item;
			new DataContent({
				where: {
					flag: wallFlag
				}
			}).post({
				load: false,
				url: '/web/wallmoney/signCount.html',
				callBack: function(data) {
					if (data.dataContent) {
						_this.partNum = data.dataContent.totalCount;
					}
				},
				complete: function() {
					fn();
				}
			});
		});
	};
	WallMoney.prototype.beforeActivity = function() {
		var _this = this;
		//
		// 快捷键绑定
		bindHotkeys();
		_this.firstInit(function() {
			_this.getGameSet();

			$('#wall-amount-money').show();
			//绑定活动切换
			$('#game-control-switch').css('display', 'inline');
			$('#prevGame').bind('click',function(){
				new DataContent({
					where:{
						flag:wallFlag,
						type : 'up'
					}
				}).post({
					load:false,
					url:'/web/wallmoney/moneySwitch.html',
					callBack:function(data){
						if( data.systemContent.msg.length >0 ){
							layer.msg( data.systemContent.msg );
						}
					}
				});
			});
			$('#nextGame').bind('click',function(){
				new DataContent({
					where:{
						flag:wallFlag,
						type : 'down'
					}
				}).post({
					load:false,
					url:'/web/wallmoney/moneySwitch.html',
					callBack:function(data){
						if( data.systemContent.msg.length >0 ){
							layer.msg( data.systemContent.msg );
						}
					}
				});
			});
		});
	};
	WallMoney.prototype.afterActivity = function() {
		// 快捷键解绑
		unBindHotkeys();
		$('#wall-amount-money').hide();
		// 解除活动切换
		$('#wallcontrol .fr').hide();
		$('#prevGame').unbind('click');
		$('#nextGame').unbind('click');
	};
	WallMoney.prototype.init = function() {
		this.stageResult.find('.result-user').hide();
		this.eveBind();
	};
	WallMoney.prototype.eveBind = function() {
		//绑定时间
		var self = this;
		this.control.bind('click', function() {
			// 发送请求到后台，通知手机端开始倒计时
			new DataContent({
				wallFlag: wallFlag,
				moneyId: self.wallmoneyConfig.moneyId
			}).post({
				load: false,
				url: '/web/wallmoney/moneyStartTime.html',
				complete: function(){
					self.control.hide();
					self.defaultTit.hide();
					self.timeDown.text(self.countTotal);
					self.startDown.addClass('animation-scale').show();
					self.startTime();
				}
			});
		});
		this.startDown.bind('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function() {
			self.startDown.removeClass('animation-scale');
		});
		//again
		this.againDom.bind('click', function() {
			self.againDom.addClass('animate-rotate');
			self.again();
		});
	};
	WallMoney.prototype.startTime = function() {
		var _this = this;
		_this.active = true;
		_this.wall.send({
			system:{
				cmd:'globalNote',
				secondCmd: 'wallMoneyStart'
			},
			data:{
				moneyId: _this.wallmoneyConfig.moneyId
			}
		});
		// 清除所有绑定事件
		this.wall.unBindAllControl();
		//进行开始倒计时
		var time = this.countTotal;
		var self = this;
		var startShow = setInterval(function() {
			if (time > 0) {
				time--;
				self.timeDown.text(time);
				self.startDown.addClass('animation-scale');
			} else if (time <= 0) {
				clearInterval(startShow);
				self.checkStart();
				_this.active = false;
			}
		}, 1000);
	};
	WallMoney.prototype.checkStart = function() {
		//发送ajax去后台开启游戏
		var self = this;
		new DataContent({
			where: {
				wallflag: wallFlag
			}
		}).post({
			load: false,
			url: '/web/wallmoney/fight.html',
			complete: function(){
				self.cacheList = [];
				$('.scale-user').empty();
				self.stageBefore.hide();
				if (self.gameWall.playWay == 'speedTime') {
					self.gameTime.text(self.gameSet.speedTimeTotal);
					self.stageLuck.show();
					self.tagPlaying();
					self.intervalData();
				}
			}
		});
	};
	WallMoney.prototype.commonAjax = function(data, url, success) {
		new DataContent(data).post({
			load: false,
			url: url,
			callBack: success
		});
	};
	WallMoney.prototype.getGameSet = function() {
		this.joinUser.text(this.partNum);
		//获取游戏配置
		var self = this;
		var data = {
			"where": {
				"flag": wallFlag
			}
		};
		var urlStr = '/web/wallmoney/moneyRule.html';

		function gameSet(msg) {
			if (!msg.systemContent.msg.length) {
				self.defaultTit.text(msg.dataContent.wallmoney.title);
				self.gameWall = $.extend(self.gameWall, msg.dataContent.wallmoney);
				//self.gameWall = self.wallmoneyConfig;
				self.upGameSet(msg.dataContent.wallmoney.conf);

				self.timeDownTite.text(msg.dataContent.wallmoney.title);

				self.stageResult.hide();
				self.defaultWall.hide();


				if (msg.dataContent.moneyState == 'Finish') {
					self.wallResult();
				} else {
					self.defaultWall.show();
				}
			}
		}
		this.commonAjax(data, urlStr, gameSet);
	};
	WallMoney.prototype.wallResult = function() {
		var self = this;
		var resultUrl = '/web/wallmoney/result.html';
		var resultData = {
			"where": {
				"moneyId": this.gameWall.id
			}
		};

		function resultSuc(msg) {
			var datas = msg.dataContent;
			self.cacheList = self.arrSort(datas, 'count', 'number');
			self.showResult();
		}
		this.commonAjax(resultData, resultUrl, resultSuc);
	};
	WallMoney.prototype.upGameSet = function(obj) {
		//合并游戏配置
		this.gameSet = $.extend(this.gameSet, obj);
	};
	WallMoney.prototype.tagPlaying = function() {
		//切换到， 游戏时间倒计时
		var self = this;
		var time = this.gameSet.speedTimeTotal;

		function courTime() {
			if (time >= 0) {
				self.gameTime.text(time);
				time--;
				setTimeout(courTime, 1000);
			} else {
				self.wall.bindAllControl();
				clearInterval(courTime);
				self.showResult();
				//接下来去结果页面
			}
		}
		courTime();
	};
	/*排重结果*/
	var repeatUserList = function(userList){
		try {
			var map = new Map();
			for(var i = 0;i < userList.length;i++){
				var item = userList[i];
				var key = item.moneyId + '-' + item.wxUserId;
				var x = map.get(key);
				if(!x){
					map.put(key,item);
				} else {
					if(x.count <= item.count){
						map.put(key,item);
					}
				}
			}
			return map.values();
		} catch (e) {
		}
		return userList;
	};
	WallMoney.prototype.intervalData = function() {
		//定时去后台取数据
		var self = this;
		var postUrl = '/web/wallmoney/userList.html';
		var postData = {
			"where": {
				"flag": wallFlag,
				"moneyId": this.gameSet.moneyId
			}
		};

		function postSuc(msg) {
			if (msg.dataContent.moneyState == 'normal') {
				var list = msg.dataContent.wallmoneyRecordList;
				if (list.length) {
					stortArr = repeatUserList(list);
					stortArr = self.arrSort(stortArr, 'count', 'number');
					stortArr.sort(function(a,b){
						if(a.count == b.count){
				        	var aTime = new Date(a.lastDate).getTime();
				        	var bTime = new Date(b.lastDate).getTime();
				        	if(aTime == bTime){
				        		return a.wxUserId-b.wxUserId;
				        	}else{
				        		return aTime - bTime;
				        	}
						}else{
							return b.count - a.count;
						}
			        });
					self.cacheList = stortArr;
					var htmlStr = '';
					for (var i = 0, l = stortArr.length > 10 ? 10 : stortArr.length; i < l; i++) {
						var weixinUser = stortArr[i].weixinUser;
						var nickName = weixinUser.nickName;
						if(showFullName){
							var signUser = cacheSignUser[weixinUser.id];
							if(signUser){
								nickName = signUser.noteName || signUser.name || nickName;
							}
						}
						var img = weixinUser.imgpath ? weixinUser.imgpath : wwwdomain + 'images/wall/unname.jpg';
						htmlStr += '<div class="scale-user-list scale-list-' + (i + 1) + '">';
						htmlStr += '<span class="gold-hd"></span>';
						htmlStr += '<span class="gold-main" style="height:' + (stortArr[i].count / stortArr[0].count) * self.maxColumnH + 'px;"></span>';
						htmlStr += '<div class="gold-num">' + stortArr[i].count + '</div>';
						htmlStr += '<div class="player-img"><img src="' + img.dealUrl() + '"></div>';
						htmlStr += '<div class="player-name">' + nickName + '</div>';
						htmlStr += '</div>';
					}
					$('.scale-user').html(htmlStr);
				}
				setTimeout(function() {
					self.intervalData();
				}, 1000);
			} else if (msg.dataContent.moneyState == 'Finish') {
				var list = msg.dataContent.wallmoneyRecords;
				if (list && list.length > 0) {
					self.cacheList = list;
				}
				self.showResult();
			}
		}
		this.commonAjax(postData, postUrl, postSuc);
	};
	WallMoney.prototype.arrSort = function(arr, key, num) {
		if (num == 'number') {
			for (var i = 0, j = arr.length; i < j; i++) {
				for (var k = 0, l = arr.length; k < l; k++) {
					if (i != k && arr[k][key] < arr[i][key]) {
						var val = arr[i];
						arr[i] = arr[k];
						arr[k] = val;
					}
				}
			}
		}
		return arr;
	};
	WallMoney.prototype.showResult = function() {
		this.stageLuck.hide();
		this.stageResult.show();
		this.defaultWall.hide();
		this.stageResult.find('.result-user').hide();
		if (this.cacheList && this.cacheList.length) {
			var showLG = this.gameWall.rank < this.cacheList.length ? this.gameWall.rank : this.cacheList.length;
			for (var i = 0; i < showLG; i++) {
				var weixinUser = this.cacheList[i].weixinUser;
				var nickName = weixinUser.nickName;
				if(showFullName){
					var signUser = cacheSignUser[weixinUser.id];
					if(signUser){
						nickName = signUser.noteName || signUser.name || nickName;
					}
				}

				var dom = $('.result-' + (i + 1));
				var img = weixinUser.imgpath ? weixinUser.imgpath : 'http://www.hixianchang.com/images/wall/unname.jpg';
				dom.find('.result-user-img img').attr('src', img.dealUrl());
				dom.find('.raking').html(i + 1);
				dom.find('.name-string').html(nickName);
				dom.find('.result-user-currency').html(this.cacheList[i].count + this.gameSet.speedTimeLimitUnit);
				dom.show();
			}
		}
	};
	WallMoney.prototype.again = function() {
		var self = this;
		var againUrl = '/web/wallmoney/nextRound.html';
		var againData = {
			"where": {
				"flag": wallFlag
			}
		};
		function againSuc(msg) {
			self.againDom.removeClass('animate-rotate');
			self.startDown.hide();
			self.control.show();
			self.defaultTit.show();
			self.stageLuck.find('.scale-user').html(' ');
		}
		this.commonAjax(againData, againUrl, againSuc);
	};
	jQuery.wall.wallMoney = function(wall) {
		Wall.Activity.type.ACTIVITY_MONEY = 'ACTIVITY_MONEY';
		var wallMoney = new WallMoney(wall);
		wall.registerActivity(Wall.Activity.type.ACTIVITY_MONEY, wallMoney);
		return wallMoney;
	};
})(jQuery);
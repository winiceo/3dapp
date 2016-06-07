;(function() {
	Wall.prototype.wallShakeprizeStart = function(response){
		try {
			this.noteAll(Wall.Note.type.WALL_SHAKEPRIZE_START,response.data);
		} catch (e) {
		}
	};
	// 手机端控制通知
	Wall.prototype.mcToggleShakePrizeStart = function(response){
		var goPic = $('#shakeprize-wall-block .start').find('a');
		if(goPic && goPic.length && goPic.is(':visible')){
			goPic.click();
		}
	};
	//通知-更新参与人数
	Wall.prototype.updateWallShakeprizeRegedit = function(response){
		var count = response.data.count;
		if(count){
			$('#shakeRegeditNum').html(count);
			this.getActivity(Wall.Activity.type.ACTIVITY_SHAKEPRIZE).regeditCount = count;
		}
	};
	/** **************************摇奖品墙 Start********************** */
	/*绑定热键*/
	var bindHotkeys = function(){
		$(document).bind('keyup.space',function (evt){
			// 判断摇大奖是否准备好，准备好就开始
			var goPic = $('#shakeprize-wall-block .start').find('a');
			if(goPic && goPic.length && goPic.is(':visible')){
				goPic.click();
			}
		});
		//活动切换控制热键
		$(document).bind('keyup.up',function(evt){
			$('#prevGame').click();
		});
		$(document).bind('keyup.down',function(evt){
			$('#nextGame').click();
		})
	};
	/*解绑热键*/
	var unBindHotkeys = function(){
		$(document).unbind('keyup.space');
		//活动切换控制热键
		$(document).unbind('keyup.up');
		$(document).unbind('keyup.down');
	};
	/* 摇奖品墙 */
	var WallShakeprize = function(wall) {
		this.wall = wall;
		this.wallshakeprizeConfig = null;
		this.initAlready = false;
		this.winnerList = [];
		this.countdown = 60;// 倒计时
		this.downGiftTimer = null;//掉落红包
		this.state = 'NotStarted';// 活动状态
		this.active = false;
		this.regeditCount = 0;//当前参与人数
	};
	/* 初始化一次摇大奖 */
	WallShakeprize.prototype.firstInit = function(fn) {
		Debug.log('WallShakeprize', 'firstInit');
		var _this = this;
		if (_this.initAlready) {
			fn();
			return;
		}
		_this.initAlready = true;
		
		// 做初始化
		_this.wall.register(Wall.Note.type.UPDATE_GLOBAL,function(data){
			if (data.noteType == 'wallshakeprizeConfig') {
				try{
					var update = false;
					if(_this.wallshakeprizeConfig.shakeprizeId != data.shakeprizeId && _this.wall.currentActivityType == 'ACTIVITY_SHAKEPRIZE'){
						update = true;
					}
					_this.wallshakeprizeConfig = data;
					_this.countdown = _this.wallshakeprizeConfig.wallshakeprize.shakeTime;
					if(update){
						_this.afterActivity();
						_this.beforeActivity();
						Debug.log('WallShakeprize', 'firstInit','重新设置');
					}
					_this.refreshShakeprizeRegeditCount(function(){
						$('#shakeRegeditNum').html(_this.regeditCount);
					});
				}catch(e){
				}
			}
		});
		_this.wall.register(Wall.Note.type.WALL_SHAKEPRIZE_START,function(data){
			if(_this.wallshakeprizeConfig.shakeprizeId == data.shakeprizeId){
				_this.go();
			}
		});
		// 获取配置
		_this.wallshakeprizeConfig = cacheWallConfig.wallshakeprizeConfig;
		if(_this.wallshakeprizeConfig && _this.wallshakeprizeConfig.wallshakeprize){
			try{
				_this.countdown = _this.wallshakeprizeConfig.wallshakeprize.shakeTime;
			}catch(e){
			}
			_this.refreshShakeprizeRegeditCount(function(){
				fn();
			});
		}
	};
	WallShakeprize.prototype.beforeActivity = function() {
		//隐藏赞助商
		$('#wallNote,#wallcopyright').css('visibility', 'hidden');
		// 查询该活动的配置，以及该活动的
		var _this = this,isStart = true;
		_this.active = false;
		var startShake = function(){
			var html = '', shakeObj = $('#shakeprize-wall-block .shakeprize'),tipMsg = '';
			// 标题
			if('NoBound' == cacheWallConfig.wall.type){
				tipMsg = '点击互动按钮参与' + _this.wallshakeprizeConfig.wallshakeprize.title;
			}else{
				tipMsg = '发送“' + _this.wallshakeprizeConfig.keyword + '”参与' + _this.wallshakeprizeConfig.wallshakeprize.title;
			}
			html += '<div class="start"><div class="curpeople">参与人数：<span id="shakeRegeditNum">' + _this.regeditCount + '</span>人</div>';
			html += '<div class="startxt"><a href="javascript:void(0);">马上开始</a></div>', 
			html += '<div class="title">' + tipMsg + '</div></div>';
			shakeObj.empty().append(html);
			if(cacheWallConfig.wall.activeState == 'In'){
				shakeObj.find('a').bind('click', function() {
					if(isStart){
						_this.start();
						isStart = false;
					}
					setTimeout(function(){
						isStart = true;
					},2000);
				});
			}
		};
		// 快捷键绑定
		bindHotkeys();
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
				url:'/web/wallshakeprize/switchShakePrize.html ',
				callBack:function(data){
					if( data.systemContent.msg.length > 0){
						layer.msg(data.systemContent.msg);
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
				url:'/web/wallshakeprize/switchShakePrize.html ',
				callBack:function(data){
					if( data.systemContent.msg.length > 0){
						layer.msg( data.systemContent.msg );
					}
				}
			});
		});
		_this.firstInit(function() {
			$('#shakeRegeditNum').html(_this.regeditCount);
			new DataContent({
				where: {
					flag: wallFlag,
					shakeprizeId: _this.wallshakeprizeConfig.shakeprizeId
				}
			}).post({
				load: false,
				url: '/web/wallshakeprize/record.html',
				callBack: function(data){
					if('Right' == data.systemContent.state){
						_this.state = data.dataContent.state;
						_this.wallShakeprizeRanking = data.dataContent.winList;
						if(_this.wallShakeprizeRanking.length > 0){
							_this.finish();
						}else{
							startShake();
						}
						$('#shakeprize-wall-block').show();
					}else{
						layer.alert(data.systemContent.msg);
					}
				}
			});
		});
	};
	WallShakeprize.prototype.afterActivity = function() {
		var _this = this;
		$('#shakeprize-wall-block').hide();
		$('#wallNote,#wallcopyright').css('visibility', 'visible');
		_this.wallShakeprizeRanking = [];
		// 快捷键解绑
		unBindHotkeys();
		// 解除活动切换
		$('#wallcontrol .fr').hide();
		$('#prevGame').unbind('click');
		$('#nextGame').unbind('click');
	};
	//刷新当前参与人数
	WallShakeprize.prototype.refreshShakeprizeRegeditCount = function(fn){
		var _this = this;
		new DataContent({
			where:{
				wallId: wallJson.id,
				shakeprizeId: _this.wallshakeprizeConfig.shakeprizeId,
			}
		}).post({
			url: '/web/wallshakeprizeRegedit/count.html',
			callBack: function(data){
				try{
					var data = data.dataContent;
					if(data.shakeprizeId == _this.wallshakeprizeConfig.shakeprizeId){
						_this.regeditCount = data.count;
					}
				}catch(e){
				}
			},
			complete: function(){
				fn();
			}
		});
	};
	/* 开始倒计时 */
	WallShakeprize.prototype.start = function() {
		var _this = this;
		// 清除所有绑定事件
		_this.wall.unBindAllControl();

		new DataContent({
			where: {
				flag: wallFlag
			}
		}).post({
			load : false,
			url : '/web/wallshakeprize/go.html',
			callBack : function(response) {
				if (response.systemContent.state == 'Right') {
					// 发送通知给所有墙进行开始
					_this.wall.send({
						system:{
							cmd:'globalNote',
							secondCmd: 'wallShakeprizeStart'
						},
						data:{
							shakeprizeId: _this.wallshakeprizeConfig.shakeprizeId
						}
					});
					_this.go();
				}else{
					layer.msg(response.systemContent.msg);
				}
			},
			errorCallBack : function() {
				layer.msg('网络错误，请刷新重试！');
			}
		});
	};
	/* 开始摇大奖 */
	WallShakeprize.prototype.go = function() {
		var _this = this,html = '';
		if(_this.active){
			return;
		}
		_this.active = true;
		_this.state = 'In';
		html += '<div id="downLottery"></div>';
		html += '<div id="lotteryPerson">';
		html += '<ul><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li></ul></div>';
		//进行中界面
		$('#shakeprize-wall-block .shakeprize').empty().append(html);
		//获取中奖人数据，用于弹出中奖人动画
		_this.refreshWinList(function(){
			// 结束了
			_this.finish();
			clearInterval(_this.downGiftTimer);
		});
		_this.animation();
		_this.downGift();
		//倒计时动画
		_this.timer();
	};
	WallShakeprize.prototype.refreshWinList = function(fn) {
		var _this = this;
		var update = function(){
			var isloop = true;
			new DataContent({
				where: {
					flag: wallFlag,
					shakeprizeId: _this.wallshakeprizeConfig.shakeprizeId
				}
			}).post({
				load: false,
				url: '/web/wallshakeprize/record.html',
				callBack: function(data){
					if('Right' == data.systemContent.state){
						_this.state = data.dataContent.state;
						_this.wallShakeprizeRanking = data.dataContent.winList;
						if(_this.state == 'End' || _this.state == 'NotStarted'){
							isloop = false;
						}
					}
				},
				complete: function(){
					loop(isloop);
				}
			});
		};
		var loop = function(isloop){
			if(isloop){
				setTimeout(function(){
					update();
				},2000);
			}else{
				fn && fn();
			}
		};
		update();
	};
	/*倒计时动画*/
	WallShakeprize.prototype.timer = function(){
		var _this = this,
			imgW = 30,		//用于纠错用的偏移量
			times= _this.countdown,		//总时间
			orangePos = times*0.3,	//在什么位置颜色变为橙色
			boxWidth = 970,	//条的 总宽度
			singerOnce = 1/times,//每秒钟移动的距离
			html = '';
		html += '<div id="timer">';
		html += '<div class="timer-main">';
		html += '<div class="timer-obj"><img src="/images/wall/timergift.png"></div>';
		html += '</div></div>';
		$('#downLottery').prepend(html);
		//$('.am-main').css('width',boxWidth+'px');
		function timeLine(){
			//var imgW = 40;
			if(times>0){
				times--;
				var left = times*singerOnce*boxWidth + imgW;
				$('.timer-main').css('width',left+'px');
				if(times < orangePos){
					if(!$('.timer-main').hasClass('orange-bg')){
						$('.timer-main').addClass('orange-bg');
					}
				}
				setTimeout(function(){
					timeLine();
				},1000);
			}else{
				return false;
			}
		}
		timeLine();
	};
	/*掉红包、礼物动画*/
	WallShakeprize.prototype.downGift = function(){
		var _this = this;
		var downgiftUrl = [
   			'/images/wall/gift.png',
   			'/images/wall/hongbao.png',
   			'/images/wall/hongbao2.png',
   			'/images/wall/linepocket.png',
   			'/images/wall/gift.png',
   			'/images/wall/pocketline.png'
   		];

   		var container = $('.shakeprize');
   		realWidth = container.width();
   		realHeight = container.height();
   		//掉落礼物或者红包
		var $giftBox = $('#downLottery');

		//随机掉落礼物或者红包
		function getImagesName () {
			return downgiftUrl[Math.floor(Math.random()*6)];
		}

		//创建一个gift
		function createGift(){
			var url = getImagesName();
			if (url == '/images/wall/linepocket.png' || url == '/images/wall/pocketline.png') {
				return $('<div class="giftbox2">').css('background-image','url('+url+')').addClass('downgift');
			} else{
				return $('<div class="giftbox">').css('background-image','url('+url+')').addClass('downgift');
			}
		}

		_this.downGiftTimer = setInterval(function(){
			//运动的轨迹
			var startPositionLeft = Math.random()*(realWidth + 400),
				endPositionTop = 600,
				endPositionLeft = startPositionLeft - 400,
				duration = Math.random() * 1500;

			var $gift = createGift();
			$gift.css('left',startPositionLeft);
			$giftBox.append($gift);
			setTimeout(function(){
				$gift.remove();
			},1000);
		},80);
	};
	/*弹出中奖人动画*/
	WallShakeprize.prototype.animation = function() {
		var _this = this,downBoxObj = $('.shakeprize'),animationArr = [];
		var nextAnimation = function(){
			if(_this.state === 'End'){
				return;
			}
			var item = animationArr.shift();
			if(!item){
				setTimeout(function(){
					var winnerArr = _this.wallShakeprizeRanking;
					if(winnerArr.length){
						winnerArr.sort(function(a,b){
							return a.id - b.id;
						});
						[].slice.call(winnerArr).forEach(function(i){
							if(i && i.weixinUser){
								// 判断该人是否已经显示或者正在显示
								if(!$('#lotteryPerson ul li[data-id="' + i.weixinUser.id + '"]').length){
									animationArr.push(i);
								}
							}
						});
					}
					nextAnimation();
				},1000);
				return;
			}
			// 动画播放
			var left = Math.random()*(downBoxObj.width()-200)+ 'px',
				top = Math.random()*(downBoxObj.height()-360) + 'px',
				user = item.weixinUser,
				nickName = user.nickName,
				bombObj = '<div data-id="' + user.id + '" class="bomb" style="left:'+left+';top:'+top+';"><img src="/images/wall/starbomb.gif" /></div>',
				html = '';
			if(showFullName){
				var signUser = cacheSignUser[user.id];
				if(signUser){
					nickName = signUser.noteName || signUser.name || user.nickName;
				}
			}
			html += '<img class="hongbao" src="/images/wall/redholder.png">';
			html += '<img class="headimg" src="' + user.imgpath + '">';
			html += '<p class="nickname">' + nickName + '</p>';
			downBoxObj.append(bombObj);
			setTimeout(function(){
				var curLi = null;
				if(!$('#lotteryPerson').length) return;
				if($('#lotteryPerson ul li:not(.winner)').length){
					curLi = $('#lotteryPerson ul li:not(.winner)')[0];
				}else{
					//中奖人排满后删除第一个并在最末添加新的
					$('#lotteryPerson ul li').first().remove();
					$('#lotteryPerson ul').append('<li></li>');
					curLi = $('#lotteryPerson ul li').last();
				}
				$('.bomb').empty().append(html).animate({
					left: $(curLi).offset().left - $('#downLottery').offset().left + 'px',
					top: $(curLi).offset().top - $('#downLottery').offset().top  + 'px',
					opacity:0,
				},{
					easing: 'easeInExpo',
					duration: 1000,
					complete: function(){
						$(curLi).addClass('winner').attr('data-id',user.id).append(html);
						$('.bomb').remove();
						nextAnimation();
					}
				});
			},500);
		};
		nextAnimation();
	};
	/* 结束摇大奖 */
	WallShakeprize.prototype.finish = function() {
		var _this = this,html = '',awards = {};
		var	winnerArr = _this.wallShakeprizeRanking,
			len = winnerArr.length,
			awardsList = _this.wallshakeprizeConfig.wallshakeprize.awardsList;
		winnerArr.sort(function(a,b){
			return a.id - b.id;
		});
		[].slice.call(awardsList).forEach(function(i){
			awards[i.id] = i;
		});
		// 绑定事件
		_this.wall.bindAllControl();
		// 渲染所有数据到结果页面
		html += '<div class="prizelist"><h3 class="prizelist-h3">'+ _this.wallshakeprizeConfig.wallshakeprize.title +'<sup>中奖名单</sup></h3>';
		if(len>0 && len<6){
			html += '<ul class="prize-ul big">';
		}else if(len<11 && len>5){
			html += '<ul class="prize-ul middle">';
		}else if(len === 0){
			html += '<ul class="prize-ul">';
		}else{
			html += '<ul class="prize-ul small">';
		}
		[].slice.call(winnerArr).forEach(function(i){
			var prize = awards[i.awardsId];
			var user = i.weixinUser;
			var type = prize.prizeType;
			var nickName = user.nickName;
			var signUser = cacheSignUser[user.id];
			if(showFullName && signUser){
				nickName = signUser.noteName || signUser.name || user.nickName;
			}
			if(user.imgpath){
				html += '<li><img class="head" src="'+ user.imgpath.dealUrl() +'">';
			}else{
				html += '<li><img class="head" src="/images/wall/unknow.png">';
			}
			html += '<div class="cont"><p class="nickname">'+ nickName +'</p>';
			if('kind' == type){// 实物
				html += '<p class="info">' + prize.prizeName + '</p>';
			}else{
				html += '<p class="info">现金红包<span>'+ (prize.prizeCount)/100 +'</span>元</p>';
			}
			html += '</div></li>';
		});
		html += '</ul></div>';
		$('#shakeprize-wall-block .shakeprize').empty().append(html);
	};

	jQuery.wall.wallShakeprize = function(wall) {
		Wall.Activity.type.ACTIVITY_SHAKEPRIZE = 'ACTIVITY_SHAKEPRIZE';
		var wallShakeprize = new WallShakeprize(wall);
		wall.registerActivity(Wall.Activity.type.ACTIVITY_SHAKEPRIZE,wallShakeprize);
		return wallShakeprize;
	};
})(jQuery);
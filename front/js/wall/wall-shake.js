;(function() {
	/******************************摇一摇 start*********************************/
	Wall.prototype.wallShakeStart = function(response){
		try {
			// 摇一摇go倒计时
			this.noteAll(Wall.Note.type.WALL_SHAKE_START,response.data);
		} catch (e) {
		}
	};
	// 手机端控制通知
	Wall.prototype.mcToggleShakeStart = function(response){
		var goPic = $('#shake-wall-block .shakewall').find('.pic img');
		if(goPic && goPic.length && goPic.attr('src').indexOf('/images/wall/preshake.png') != -1){
			goPic.click();
		}
	};
	Wall.prototype.mcToggleShakeNext = function(response){
		var nextBtn = $('.next-btn img');
		if(nextBtn && nextBtn.length && nextBtn.is(':visible')){
			$('.next-btn img').click();
		}
	};
	Wall.prototype.updateWallShakeRegedit = function(response){
		var count = response.data.count;
		if(count){
			$('#shakeRegeditNum').html(count);
			this.getActivity(Wall.Activity.type.ACTIVITY_SHAKE).regeditCount = count;
		}
	};
	/** **************************摇一摇墙 Start********************** */
	var numArr = [ '一', '二', '三', '四', '五', '六', '七', '八', '九', '十' ];
	// 用于请求后台使用
	var d = new DataContent({
		where : {
			flag : wallFlag
		}
	});
	/*绑定热键*/
	var bindHotkeys = function(){
		$(document).bind('keyup.space',function (evt){
			// 判断摇一摇是否准备好，准备好就开始
			var goPic = $('#shake-wall-block .shakewall').find('.pic');
			if(goPic && goPic.length && goPic.is(':visible')){
				goPic.click();
			}
			var nextBtn = $('.next-btn img');
			if(nextBtn && nextBtn.length && nextBtn.is(':visible')){
				$('.next-btn img').click();
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
	/* 摇一摇墙 */
	var WallShake = function(wall) {
		this.wall = wall;
		this.wallshakeConfig = null;
		this.initAlready = false;
		this.wallshakeRanking = [];
		this.updateDataContrl = null;
		this.countdown = 60;// 倒计时
		this.shakeId = 0;
		this.finishFlag = false;
		this.maxShakeColum = {'maxHeight':350,'maxNumber':30};
		
		this.active = false;// 是否是主动点击开始，默认主动
		
		this.regeditCount = 0;
		
		this.retryCount = 0;
	};
	/* 初始化一次摇一摇 */
	WallShake.prototype.firstInit = function(fn) {
		Debug.log('WallShake', 'firstInit');
		var _this = this;
		if (_this.initAlready) {
			_this.wall.getWallGlobalItem('wallshakeConfig', function(item) {
				_this.wallshakeConfig = item;
				try{
					_this.countdown = item.wallshake.shakeTime;
				}catch(e){
				}
				fn();
			});
			return;
		}
		_this.initAlready = true;
		
		// 做初始化
		_this.wall.register(Wall.Note.type.UPDATE_GLOBAL,function(data){
			if (data.noteType == 'wallshakeConfig') {
				try{
					var update = false;
					if(_this.wallshakeConfig.shakeId != data.shakeId && _this.wall.currentActivityType == 'ACTIVITY_SHAKE'){
						update = true;
					}
					_this.wallshakeConfig = data;
					_this.countdown = _this.wallshakeConfig.wallshake.shakeTime;
					if(update){
						_this.afterActivity();
						_this.beforeActivity();
						Debug.log('WallShake', 'firstInit','重新设置');
					}
					_this.refreshShakeRegeditCount(function(){
						$('#shakeRegeditNum').html(_this.regeditCount);
					});
				}catch(e){
				}
			}
		});
		// 接受其他墙的开始通知
		_this.wall.register(Wall.Note.type.WALL_SHAKE_START,function(data){
			_this.shakeId = data.shakeId;
			if(!_this.active){
				_this.start();
			}
		});
		// 获取配置
		_this.wall.getWallGlobalItem('wallshakeConfig', function(item) {
			_this.wallshakeConfig = item;
			try{
				_this.countdown = item.wallshake.shakeTime;
			}catch(e){
			}
			_this.refreshShakeRegeditCount(function(){
				fn();
			});
		});
	};
	WallShake.prototype.beforeActivity = function() {
		//隐藏赞助商
		$('#wallNote,#wallcopyright').css('visibility', 'hidden');
		// 查询该活动的配置，以及该活动的
		var _this = this;
		_this.finishFlag = false;
		_this.maxShakeColum.maxNumber = 30;
		var startShake = function(){
			$('#shake-wall-block .shakewall').empty();
			var html = '', shakeObj = $('#shake-wall-block .shakewall'),tipMsg = '';
			_this.wall.getWallGlobalItem('wall', function(item) {
				if('NoBound' == item.type){
					tipMsg = '点击互动按钮参与' + _this.wallshakeConfig.wallshake.title;
				}else{
					tipMsg = '发送“' + _this.wallshakeConfig.keyword + '”参与' + _this.wallshakeConfig.wallshake.title;
				}
				html += '<div class="curpeople">参与人数：<span id="shakeRegeditNum">' + _this.regeditCount + '</span></div>';
				html += '<div class="pic"><img src="/images/wall/preshake.png" alt="点击开始摇一摇"></div>';
				html += '<div class="tishi">' + tipMsg + '</div>';
				/*显示当前参与人数*/
				shakeObj.append(html);
				if(item.activeState == 'In'){
					shakeObj.find('.pic').bind('click', function() {
						shakeObj.find('.pic').unbind('click');
						_this.start();
					});
				}
			});
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
				url:'/web/wallshake/shakeSwitch.html',
				callBack:function(data){
					if( data.systemContent.msg.length > 0){
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
				url:'/web/wallshake/shakeSwitch.html',
				callBack:function(data){
					if( data.systemContent.msg.length > 0){
						layer.msg( data.systemContent.msg );
					}
				}
			});
		});
		
		// 绑定下一轮事件
		$('#shake-wall-block').delegate('.next-btn img','click',function(){
			_this.nextShake();
		});
		_this.firstInit(function() {
			$('#shakeRegeditNum').html(_this.regeditCount);
			new DataContent({
				where: {
					flag : wallFlag,
					shakeId : _this.wallshakeConfig.shakeId
				}
			}).post({
				load: false,
				url: '/web/wallshake/getAlreadyUserList.html',
				callBack: function(data){
					if('Right' == data.systemContent.state && data.dataContent.length > 0){
						_this.wallshakeRanking = data.dataContent;
					}
				},
				complete: function(){
					if(_this.wallshakeRanking.length > 0){
						_this.finish();
					}else{
						startShake();
					}
					$('#wallNote,#wallcopyright').css('visibility', 'hidden');
					$('#shake-wall-block').show();
				}
			});
		});
	};
	WallShake.prototype.afterActivity = function() {
		var _this = this;
		$('#shake-wall-block').hide();
		$('#wallNote,#wallcopyright').css('visibility', 'visible');
		clearInterval(_this.updateDataContrl);
		_this.wallshakeRanking = [];
		// 快捷键解绑
		unBindHotkeys();
		// 解绑下一轮事件
		$('#shake-wall-block').undelegate('click');
		// 解除活动切换
		$('#wallcontrol .fr').hide();
		$('#prevGame').unbind('click');
		$('#nextGame').unbind('click');
		
	};
	/* 清除当前的自动播放状态 */
	WallShake.prototype.clearState = function() {
		Debug.log('WallShake', 'clearState');
		clearInterval(this.autoPlayControl);
		this.autoPlayControl = null;
	};
	/* 还原当前的自动播放状态 */
	WallShake.prototype.reloadState = function() {
		Debug.log('WallShake', 'reloadState');
		if (this.autoPlayFlag) {
			this.autoPlay();
		}
	};
	WallShake.prototype.refreshShakeRegeditCount = function(fn){
		var _this = this;
		new DataContent({
			where:{
				wallId: wallJson.id,
				shakeId: _this.wallshakeConfig.shakeId,
			}
		}).post({
			url: '/web/wallshakeRegedit/count.html',
			callBack: function(data){
				try{
					var data = data.dataContent;
					if(data.shakeId == _this.wallshakeConfig.shakeId){
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
	/*点击下一轮*/
	WallShake.prototype.nextShake = function() {
		d.post({
			url: '/web/wallshake/nextRound.html',
			callBack: function(){
			}
		});
	};
	/* 开始倒计时 */
	WallShake.prototype.start = function() {
		var _this = this;
		
		// 倒计时开始时进行通知
		_this.active = true;
		_this.wall.send({
			system:{
				cmd:'globalNote',
				secondCmd: 'wallShakeStart'
			},
			data:{
				shakeId: _this.wallshakeConfig.shakeId
			}
		});
		
		// 清除所有绑定事件
		_this.wall.unBindAllControl();
		
		var i = 3;
		var timeImgObj = $('#shake-wall-block .pic img');
		timeImgObj.attr('src', '/images/wall/' + i + '.png');
		var timeCounter = setInterval(function() {
			i--;
			if (i <= 0) {
				timeImgObj.attr('src', '/images/wall/go.png');
				clearInterval(timeCounter);
				// 发送请求到后台
				d.post({
					load : false,
					url : '/web/wallshake/go.html',
					callBack : function(response) {
						if (response.systemContent.state == 'Right') {
							_this.shakeId = response.dataContent.shakeId;
						}
						_this.go();
					},
					errorCallBack : function() {
						alert('网络错误，请刷新重试！');
					}
				});
			} else {
				timeImgObj.attr('src', '/images/wall/' + i + '.png');
			}
		}, 1000);
	};
	/* 开始摇一摇 */
	WallShake.prototype.go = function() {
		var _this = this;
		_this.updateData();
		var timeCounter = setInterval(function() {
			if (_this.countdown > 0) {
				_this.countdown--;
			}
			if (_this.countdown <= 0) {
				clearInterval(timeCounter);
				clearInterval(_this.updateDataContrl);
				_this.finishFlag = true;
				_this.retryCount = 0;
				_this.end();
				_this.active = false;
			} else {
				$('#shake-wall-block h3 span').text(_this.countdown);
			}
		}, 1000);
	};
	var getUserImg = function(user){
		var url = '/images/wall/unname.jpg';
		if(null == user.weixinUser.imgpath){
			return url;
		}else{
			return user.weixinUser.imgpath.dealUrl();
		}
	};
	/*结束*/
	WallShake.prototype.end = function() {
		var _this = this;
		//添加加载动画	
		var _html = '<img style="display: block;margin:0 auto; margin-top:-34px;" src="/images/wall/shake/bang.gif" />';
		$('#shake-wall-block .shakewall').empty().append(_html);
		//获取中奖用户数据
		function getAlreadyUserList() {
			try{
				_this.retryCount++;
				if(_this.retryCount > 10){
					_this.finish();
					return;
				}
				new DataContent({
					where: {
						flag : wallFlag,
						shakeId : _this.wallshakeConfig.shakeId
					}
				}).post({
					load: false,
					url: '/web/wallshake/getAlreadyUserList.html',
					callBack: function(data){
						if('Right' == data.systemContent.state){
							_this.wallshakeRanking = data.dataContent;
							//关闭加载动画，播放加载成功动画（爆炸动画）
							var _html = '<img style="display: block;margin:0 auto; margin-top:-34px;" src="/images/wall/shake/bang2.gif" />';
							$('#shake-wall-block .shakewall').empty().append(_html);
							setTimeout(function(){
								_this.finish();
							},800);
						}else{
							setTimeout(function(){
								getAlreadyUserList();
							},100);
						}
					},
					errorCallBack: function(){
						setTimeout(function(){
							getAlreadyUserList();
						},1000);
					}
				});
			}catch(e){
				setTimeout(function(){
					getAlreadyUserList();
				},1000);
			}
		}
		getAlreadyUserList();
	};
	/* 结束摇一摇 */
	WallShake.prototype.finish = function() {
		var _this = this;

		// 绑定事件
		_this.wall.bindAllControl();
		// 对数据进行排序
		var userList = _this.wallshakeRanking.sort(function(a, b) {
			var result = b.count - a.count;
			if(!result){
				try {
					if(a.id){
						result = a.id - b.id;
					}else{
						result = a.lastDate.getDate().getTime() - b.lastDate.getDate().getTime();
					}
				} catch (e) {
				}
			}
			return result;
		});
		// 处理昵称
		for(var i = 0;i < userList.length;i++){
			var item = userList[i];
			if(item && showFullName){
				var signUser = cacheSignUser[item.wxUserId];
				if(signUser){
					item.weixinUser.nickName = signUser.noteName || signUser.name || item.weixinUser.nickName;
				}
			}
		}

		Debug.log('WallShake','排序后的 finish',userList);
		// 把人员截取一下，按照默认显示多少名去设置
		try{
			var rank = _this.wallshakeConfig.wallshake.rank;
			rank = parseInt(rank);
			if(!isNaN(rank)){
				userList = userList.slice(0,rank);
			}
		}catch(e){
		}
		$('#shake-wall-block .shakewall').empty().removeClass('toshake');
		var length = userList.length;// 获奖人数
		var html = '';
		html += '<div class="next-btn"><img src="/images/wall/shake/next-shake.png"></div>';
		html += '<div class="podium">';
		html += '<ul class="clearfix">';

		var user0 = userList.shift();
		var user1 = userList.shift();
		var user2 = userList.shift();
		if (user1) {
			html += '<li class="second"><img src="'
					+ getUserImg(user1) + '" alt=""><p><nobr>'
					+ user1.weixinUser.nickName + '</nobr></p></li>';
		} else {
			html += '<li class="second"></li>';
		}
		if (user0) {
			html += '<li class="first"><img src="'
					+ getUserImg(user0) + '" alt=""><p>'
					+ user0.weixinUser.nickName + '</p></li>';
		} else {
			html += '<li class="first"></li>';
		}
		if (user2) {
			html += '<li class="third"><img src="'
					+ getUserImg(user2) + '" alt=""><p>'
					+ user2.weixinUser.nickName + '</p></li>';
		} else {
			html += '<li class="third"></li>';
		}
		html += '</ul>';
		html += '</div>';
		if (userList.length > 0) {
			html += '<div class="podium_last">';
			html += '<ul class="clearfix">';

			var xx = 2;
			while (true) {
				xx++;
				var user = userList.shift();
				if(!user){
					break;
				}
				var nickName = user.weixinUser.nickName;
				html += '<li>';
				html += '<p>第' + numArr[xx] + '名</p>';
				html += '<div class="tou"><img src="' + getUserImg(user) + '" alt=""><nobr>' + nickName + '</nobr></div>';
				html += '</li>';
			}
			html += '</ul>';
			html += '</div>';
		}
		$('#shake-wall-block .shakewall').append(html);
		/* 按钮提示 */
		$('.tooltip').tooltipster({
			theme : 'tooltipster-light',
			position :'left',
			timer : '100'
		});
	};
	/* 更新页面排序 */
	WallShake.prototype.updateRanking = function() {
		var _this = this;
		if(_this.finishFlag){
			return;
		}
		var userList = _this.wallshakeRanking;
		$('#shake-wall-block .shakewall').empty().addClass('toshake');
		// 计算柱状图应有的高度
		function columnHeight(number) {
			return _this.maxShakeColum.maxHeight * number / _this.maxShakeColum.maxNumber;
		}
		// 拼接html添加到页面，展示柱状图
		var html = '';
		html += '<h3>' + _this.wallshakeConfig.wallshake.title + '结束还剩余<span>' + _this.countdown + '</span>秒</h3>';
		html += '<ul class="clearfix">';
		for (var i = 0; i < userList.length; i++) {
			var item = userList[i];
			var count = item.count;
			if (count > 0) {
				var weixinUser = item.weixinUser;
				var nickName = weixinUser.nickName;

				if(showFullName){
					var signUser = cacheSignUser[weixinUser.id];
					if(signUser){
						nickName = signUser.noteName || signUser.name || nickName;
					}
				}

				html += '<li class="ranking' + i + '">';
				html += '<span class="nickname"><nobr>' + nickName + '</nobr></span>';
				html += '<div class="cont">';
				html += '<img src="' + getUserImg(item) + '" alt="">';
				html += '<p>' + count + '</p>';
				html += '<div class="column" style="height:'
						+ columnHeight(item.count) + 'px;"><span></span></div></div>';
				html += '</li>';
				if (i >= 9) {
					break;
				}
			}
		}
		html += '</ul>';
		$('#shake-wall-block .shakewall').append(html);
		// 计算ul的宽度，使之居中
		var length = userList.length;
		if(length > 10){
			length = 10;
		}
		var ulWidth = 80 * length + 10 +'px';
		$('#shake-wall-block .shakewall ul').css('width', ulWidth);
	};
	/*排重结果*/
	var repeatUserList = function(userList){
		try {
			var map = new Map();
			for(var i = 0;i < userList.length;i++){
				var item = userList[i];
				if(!item){
					continue;
				}
				var key = item.shakeId + '-' + item.wxUserId;
				var x = map.get(key);
				if(!x){
					map.put(key,item);
				} else {
					item.count = item.count + x.count;
					map.put(key,item);
				}
			}
			return map.values();
		} catch (e) {
		}
		return userList;
	};
	WallShake.prototype.updateData = function() {
		var _this = this;
		_this.updateDataContrl = setInterval(function() {
			d.putWhere('shakeId', _this.shakeId);
			d.post({
				load : false,
				url : '/web/wallshake/userList.html',
				callBack : function(response) {
					try {
						if (response.systemContent.state == 'Right') {
							var userList = response.dataContent;
							// 排重
							userList = repeatUserList(userList);
							if (userList.length >= _this.wallshakeRanking.length) {
								_this.wallshakeRanking = userList;
								userList.sort(function(a, b) {
									return b.count - a.count;
								});
								if(userList[0].count && userList[0].count > _this.maxShakeColum.maxNumber){
									_this.maxShakeColum.maxNumber = userList[0].count + 50;
								}
							}
						}
					} catch (e) {
						Debug.log('WallShake', '数据更新错误', response,e);
					}
					_this.updateRanking();
				}
			});
		}, 1000);
	};

	jQuery.wall.wallShake = function(wall) {
		Wall.Activity.type.ACTIVITY_SHAKE = 'ACTIVITY_SHAKE';
		var wallShake = new WallShake(wall);
		wall.registerActivity(Wall.Activity.type.ACTIVITY_SHAKE,wallShake);
		return wallShake;
	};
})(jQuery);
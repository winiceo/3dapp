;(function($){
	document.documentElement.style.overflow='hidden';//禁止出现滚动条
	/*待抽奖人数同步*/
	Wall.prototype.waitLotterCount = function(response){
		var _this = this;
		if(!response){
			var data = {'system':{'cmd':'waitLotterCount'},'data':{}};
			_this.send(data);
			return;
		}
		// 解析返回回来的数据
		try{
			var data = response.data;
			Debug.log(data);
		}catch(e){
			Debug.log('waitLotterCount error',e,response);
		}
	};
	Wall.prototype.wallLotteryStartEvent = function(response){
		if(!$('#luck-draw').hasClass('luck-wait') || $('.prizeIn').length > 0){
			return;
		}
		var a = this.getActivity(Wall.Activity.type.ACTIVITY_LOTTERY);
		if(!a.active){
			a.startLottery();
		}
		a.active = false;
	};
	Wall.prototype.wallLotteryStopEvent = function(response){
		if(!$('#luck-draw').hasClass('luck-over') || $('.prizeIn').length > 0){
			return;
		}
		var a = this.getActivity(Wall.Activity.type.ACTIVITY_LOTTERY);
		if(!a.active){
			a.stopLottery();
		}
		a.active = false;
	};
	Wall.prototype.wallLotteryDelete = function(response){
		var a = this.getActivity(Wall.Activity.type.ACTIVITY_LOTTERY);
		a.resetWinUserList();
	};
	Wall.prototype.wallLotteryFadeOutEvent = function(response){
		$('.prizeIn-mask,.prizeIn .ribbon').click();
	};
	// 手机端的控制
	Wall.prototype.mcToggleLotteryStart = function(response){
		if($('#luck-draw').hasClass('luck-wait') &&  $('.prizeIn').length === 0){
			$('#luck-draw').click();
		}
	};
	Wall.prototype.mcToggleLotteryStop = function(response){
		if($('#luck-draw').hasClass('luck-over') &&  $('.prizeIn').length === 0){
			$('#luck-draw').click();
		}
	};
	Wall.prototype.mcToggleLotteryCollapseAvatar = function(response){
		$('.prizeIn-mask,.prizeIn .ribbon').click();
	};
	/*--------------------------------------------------------------上面的操作都是针对数据库和后台交互使用----------------------------------------------------------------*/
	/*绑定热键*/
	var bindHotkeys = function(_this){
		$(document).bind('keyup.space',function (evt){
			if($('.prizeIn-mask').length > 0){
				$('.prizeIn-mask').click();
			}else if($('.prizeIn').length > 0){
				
			}else{
				_this.lotterEvent();
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
	// 抽奖墙
	var WallLottery = function(wall) {
		this.initAlready = false;
		this.wall = wall;
		this.currentLotterAwards = null;
		this.toDrawCountContral = null;
		this.playPrizesContral = null;
		this.winUserList = [];
		this.walllotteryConfig = null;
		this.realCount = null;//满足后台设置的条件的待抽奖人数
		
		this.active = false;// 是否是主动点击开始
	};
	// 初始化一次抽奖墙
	WallLottery.prototype.firstInit = function(fn) {
		Debug.log('WallLottery','firstInit');
		var _this = this;
		if(_this.initAlready){
			fn();
			return;
		}
		_this.initAlready = true;

		// 初始化抽奖滚动
		_this.playPrizesContral= new PlayPrizes($('.drawbox .unknow'));
		
		// 绑定删除按钮
		$('.lottery-poper').delegate('.lottery-remove', 'click',function(){
			var This = this;
			layer.confirm('请确认是否删除？', {
			    btn: ['确定','取消'], //按钮
			    shade: [0.1,'#fff'] //不显示遮罩
			}, function(){
				var id = $(This).parents('.lottery-limt').first().attr('data-id');
				_this.deleteLuckDraw(id);
			}, function(){
			});
		});
		// 设置修改
		_this.wall.register(Wall.Note.type.UPDATE_GLOBAL,function(data){
			if(data.noteType == 'walllotteryConfig'){
				_this.refresh(data);
			}
		});
		var updateUserCount = function(){
			_this.toDrawCount();
		};
		_this.wall.register(Wall.Note.type.UPDATE_WALL_SIGNIN_USER,updateUserCount);
		
		// 获取配置
		_this.wall.getWallGlobalItem('walllotteryConfig',function(item){
			_this.walllotteryConfig = item;
			fn();
		});
	};
	WallLottery.prototype.beforeActivity = function() {
		var _this = this;
		// 查询当前配置的奖项
		_this.wall.getWallGlobalItem('walllotteryConfig',function(walllotteryConfig){
			_this.walllotteryConfig = walllotteryConfig;
			_this.refresh(walllotteryConfig);
		});
		_this.toDrawCount();
		_this.toDrawCountContral = setInterval(function(){
			_this.toDrawCount();
		},5000);
		// 绑定抽奖按钮
		$('#luck-draw').click(function(){
			_this.lotterEvent();
		});
		$('#gift-wall-block').show();
		_this.firstInit(function(){

		});
		bindHotkeys(_this);
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
				url:'/web/walllotteryWin/lotterySwitch.html',
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
				url:'/web/walllotteryWin/lotterySwitch.html',
				callBack:function(data){
					if( data.systemContent.msg.length >0 ){
						layer.msg( data.systemContent.msg );
					}
				}
			});
		});
	};
	WallLottery.prototype.afterActivity = function() {
		clearInterval(this.toDrawCountContral);
		$('#gift-wall-block').hide();
		$('#luck-draw').unbind("click");
		unBindHotkeys();
		// 解除活动切换
		$('#wallcontrol .fr').hide();
		$('#prevGame').unbind('click');
		$('#nextGame').unbind('click');
	};
	/*刷新配置*/
	WallLottery.prototype.refresh = function(walllotteryConfig){
		if($('#luck-draw').hasClass('luck-over')){
			$('#luck-draw').click();
		}
		if($('.prizeIn-mask').length > 0){
			$('.prizeIn-mask,.prizeIn').remove();
		}
		var _this = this;
		if(null != walllotteryConfig && null != walllotteryConfig.walllotteryAwardsList && 0 != walllotteryConfig.lotteryId){
			_this.walllotteryConfig = walllotteryConfig;
			var lotteryAwardsList = walllotteryConfig.walllotteryAwardsList;
			for(var i in lotteryAwardsList){
				var item = lotteryAwardsList[i];
				if(item.id == walllotteryConfig.lotteryId){
					_this.currentLotterAwards = item;
					// 设置图片
					$('.luck-presz .imgbox').css('background-image','url('+item.prizeImg+')');
					$('.luck-presz .luck-torryname').html(item.awardName + '<br>' + item.prizeName);
					break;
				}
			}
			// 重新渲染中奖的人员
			_this.resetWinUserList();
		}
	};
	/*抽奖动作*/
	WallLottery.prototype.lotterEvent = function(parameter){
		Debug.log('lotterEvent抽奖动作');
		var _this = this;
		_this.active = true;
		/*抽奖状态（待抽奖luck-wait、正在抽奖luck-ing、抽奖完成luck-over）*/
		var contralBtn = $('#luck-draw');
		// 判断抽奖按钮的状态
		if(contralBtn.hasClass('luck-wait')){
			_this.startLottery(function(){
				_this.wall.send({
					system:{
						cmd:'globalNote',
						secondCmd: 'wallLotteryStartEvent'
					},
					data:{}
				});
			});
		}else if(contralBtn.hasClass('luck-over')){
			_this.stopLottery(parameter);
			_this.wall.send({
				system:{
					cmd:'globalNote',
					secondCmd: 'wallLotteryStopEvent'
				},
				data:{}
			});
		}
	};
	WallLottery.prototype.startLottery = function(fn){
		var _this = this;
		var contralBtn = $('#luck-draw');
		var lotteryGo = function(){
			// 禁止操作其他墙
			_this.wall.unBindAllControl();
			// 开始抽奖操作
			// 修改按钮状态
			_this.resetRollLuck();// 重置抽奖头像
			contralBtn.removeClass('luck-wait').addClass('luck-ing').html('正在抽奖...');
			// 滚动头像
			_this.rollLuckUser(function(){
				// 清空上一个活动抽中的一个人
				_this.winUserList = [];
				// 发送请求，后台进行抽奖
				var d = new DataContent();
				d.putWhere('flag',wallFlag.toUpperCase());
				d.post({
					load : false,
					url : _this.active ? '/web/walllotteryWin/lottery.html' : '/web/walllotteryWin/winers.html',
					callBack: function(data){
						// 收到后台抽奖结果,修改按钮为luck-over
						contralBtn.removeClass('luck-ing').addClass('luck-over').html('停止');
						if(data.systemContent.state == 'Right' && null != data.dataContent && data.dataContent.length > 0){
							var tempArr = [];
							for(var i = 0;i < data.dataContent.length;i++){
								var item = data.dataContent[i];
								if($('.lottery-box').find('div[data-id="' + item.id + '"]').length === 0){
									tempArr.push(item);
								}
							}
							_this.winUserList = tempArr;
						}else{
							// 结束
							layer.msg(data.systemContent.msg,{
								time:2000
							});
							_this.lotterEvent({
								auto: true
							});
						}
					},
					complete: function(){
						fn && fn();
					}
				});
			});
		};
		if(!_this.active){
			lotteryGo();
			return;
		}
		// 判断待抽奖人数
		var waitCount = parseInt($('.latter-totalnum span').html());
		if(isNaN(waitCount) || waitCount < 1){
			$('.drawbox .unknow ul li:last').show().siblings().hide();
			layer.msg('待抽奖人数为0，不能进行抽奖!',{
				time:2000
			});
			return;
		}
		if(_this.winUserList.length >= _this.currentLotterAwards.prizeNum){//已经抽过奖的人数等于设置的奖品数量
			layer.msg('该奖项已抽满!',{
				time:2000
			});
			return;
		}
		//满足条件的待抽奖人数
		lotteryGo();
	};
	WallLottery.prototype.stopLottery = function(parameter){
		var _this = this;
		var contralBtn = $('#luck-draw');
		// 恢复操作其他墙
		_this.wall.bindAllControl();
		// 停止
		contralBtn.removeClass('luck-over').addClass('luck-wait').html('开始抽奖');
		_this.toDrawCount();
		_this.playPrizesContral.stop();
		_this.resetRollLuck();
		if(!_this.winUserList || !_this.winUserList.length){
			if(!parameter || !parameter.auto){
				layer.msg('没有抽中任何人!',{time:2000});
			}
			return;
		}
		var template = '<li><img src="${imgpath}"></li>';
		var listObj = $('.drawbox .unknow ul');
		var html = '';
		listObj.empty();
		_this.winUserList.sort(function(a,b){
			return b.winId - a.winId;
		});
		for(var i in _this.winUserList){
			var item = _this.winUserList[i];
			var imgpath = item && item.imgpath ? item.imgpath.dealUrl() : '/images/wall/unknow.png';
			if(html.indexOf(imgpath) == -1){
				html += template.replace('${imgpath}',imgpath);
			}
		}
		html += template.replace('${imgpath}','/images/wall/unknow.png');
		listObj.append(html);
		//中奖人是否一个一个弹出显示
		if(_this.walllotteryConfig.flash == 'Y'){
			_this.animation(_this.winUserList,function(){});//中奖人一个一个弹出显示
		}else{
			_this.showInwall(_this.winUserList);// 中奖人员直接显示
		}
	};
	// 还原已经中奖的人员
	WallLottery.prototype.resetWinUserList = function(fn){
		var _this = this;
		// 当前中奖人列表的还原
		var d = new DataContent();
		d.putWhere('flag',wallFlag.toUpperCase());
		d.putWhere('awardsId',this.walllotteryConfig.lotteryId);
		d.pushSort('id','desc');
		d.post({
			load : false,
			url : '/web/walllotteryWin/awardsInfo.html',
			callBack: function(data){
				if(data.systemContent.state == 'Right'){
					$('.lottery-box').empty();
					var html = '';
					var arr = data.dataContent;
					_this.winUserList = arr;// 设置中奖人
					putDataToHtml(_this.winUserList);
			    	resizeLotteryItem();
				}else{
				}
			},
			complete: function(){
				fn && fn();
			}
		});
	};
	// 待抽奖人数更新
	WallLottery.prototype.toDrawCount = function(fn){
		Debug.log('待抽奖人数更新');
		if(!$('#luck-draw').hasClass('luck-wait')){
			return;
		}
		var _this = this;
		// 获取待抽奖数
		new DataContent({
			where: {
				flag: wallFlag.toUpperCase(),
				noUsers: 'Y'
			}
		}).post({
			load : false,
			url : '/web/walllotteryWin/remainWinNum.html',
			callBack: function(data){
				if(data.systemContent.state == 'Right'){
					var count = data.dataContent.notWinNum;
					_this.realCount = count;
					$('.latter-totalnum span').html(count);
					fn && fn();
				}else{
				}
			}
		});
	};
	// 删除对应的中奖人
	WallLottery.prototype.deleteLuckDraw = function(id){
		var _this = this;
		var d = new DataContent();
		d.putWhere('flag',wallFlag.toUpperCase());
		d.putWhere('wxUserId',id);
		d.putWhere('awardsId',_this.walllotteryConfig.lotteryId);
		d.post({
			url : '/web/walllotteryWin/removeWinner.html',
			callBack: function(data){
				if(data.systemContent.state == 'Right'){
					if(data.dataContent.resultCount === 0){
						layer.msg('已确认，禁止删除！',{time:2000});
					}else{
						// 事件通知
						_this.wall.send({
							system:{
								cmd:'globalNote',
								secondCmd: 'wallLotteryDelete'
							},
							data:{}
						});
						$('.lottery-poper .lottery-limt[data-id="' + id + '"]').remove();
						layer.msg('删除成功',{time:2000});
					}
				}else{
					layer.msg('删除失败',{time:2000});
				}
			}
		});
	};
	/*抽奖的滚动头像初始化并滚动*/
	WallLottery.prototype.rollLuckUser = function(fn){
		// 查询所有的人，把人员头像放入到页面中，然后开始滚动
		if(!fn){
			fn = function(){};
		}
		var _this = this;
		var template = '<li><img src="${imgpath}"></li>';
		var listObj = $('.drawbox .unknow ul');
		_this.wall.getSigninWallUser(null,200,'next',function(userList){
			var html = '';
			listObj.empty();
			for(var i = 0;i < userList.length;i++){
				var item = userList[i];
				var imgpath = item && item.imgpath ? item.imgpath.dealUrl() : '/images/wall/unknow.png';
				// 如果该url已经在中奖，就删除，不滚动// 如果该url已经在中奖列表就不显示
				if($('.lottery-box .lottery-avatar[src="' + imgpath + '"]').length){
					continue;
				}
				if(null == item.imgpath && html.indexOf('/images/wall/unknow.png') != -1){
					continue;
				}
				if(html.indexOf(imgpath) == -1){
					html += template.replace('${imgpath}',imgpath);
				}
			}
			if(!html){
				html += template.replace('${imgpath}','/images/wall/unknow.png');
			}
			listObj.append(html);
			// 用于头像滚动
			_this.playPrizesContral.init();
			_this.playPrizesContral.start();
			fn();
		});
	};
	/*重新设置抽奖人员滚动*/
	WallLottery.prototype.resetRollLuck = function(){
		var _this = this;
		_this.playPrizesContral.stop();
		var listObj = $('.drawbox .unknow ul');
		listObj.empty();
		listObj.append('<li><img src="/images/wall/unknow.png"></li>');
	};
	/*删除对应中奖人的头像*/
	WallLottery.prototype.removeRollLuck = function(src){
		$('.drawbox .unknow ul li').each(function(){
			var impSrc = $(this).find('img').attr('src');
			if(impSrc == src){
				$(this).remove();
			}
		});
	};
	function PlayPrizes(obj){
		this.playIndet = 0 ;
		this.playDom = obj.find('ul');
		this.playLg = this.playDom.find('li').length;
		this.playHg = this.playDom.find('li').outerHeight();
		this.control = null;
		this.inter = 80;
	}
	PlayPrizes.prototype={
		start : function(){
			var _this = this;
			clearInterval(this.control);
			this.control = setInterval(function(){
				_this.autoplay();
			},this.inter);
		},
		init : function(){
			this.playDom.find('li').hide().eq(0).show();
		},
		autoplay:function(){
		    this.playLg = this.playDom.find('li').length;
			this.playIndet++;
			if(this.playIndet >= this.playLg){
				this.playIndet = 0;
			}
			this.playAnimate();
		},
		playAnimate: function(){
			this.playDom.find('li').hide().eq(this.playIndet).show();
		},
		stop:function(){
			clearInterval(this.control);
			this.playDom.find('li').hide().eq(0).show();
		}
	};
	function resizeLotteryItem(){
		// 重新计算样式
    	var winUserCount = $('.lottery-box .lottery-limt').size();
		if(winUserCount < 4 ){
			$('.lottery-limt').removeClass('lottery-smallimg');
			$('.lottery-limt').addClass('lottery-bigimg');
		}else{
			$('.lottery-limt').removeClass('lottery-bigimg');
			$('.lottery-limt').addClass('lottery-smallimg');
		}
	}
	function getItemDataHtml(data){
		var imgsrc = (!data.imgpath) ? '/images/wall/unknow.png' : data.imgpath.dealUrl();
		var nickName = data.nickName;

		if(showFullName){
			var signUser = cacheSignUser[data.id];
			if(signUser){
				nickName = signUser.noteName || signUser.name || nickName;
			}
		}

		var html = '';
		html += '<div class="lottery-limt" data-id="' + data.id + '">';
    	html += '<div class="box">';
    	html += '<div class="lottery-remove"><i class="fa fa-times"></i></div>';
    	html += '<div class="lottery-crown"><img src="/images/wall/crown.png"></div>';
    	html += '<img class="lottery-avatar" src="' + imgsrc + '">';
    	html += '<img style="display:none;" class="lottery-avatar" src="">';
    	html += '</div>';
    	html += '<div class="nickname"><span>' + nickName + '</span></div>';
    	html += '</div>';
    	return html;
	}
	function putDataToHtml(data){
		if(!data){
			return;
		}
		var arr = [];
		if($.type(data) === "array"){
			arr = data;
		}else{
			arr.push(data);
		}
		var html = '';
		[].slice.call(arr).forEach(function(i){
			// 判断该人是否已经在墙上面了
			if(i && !$('.lottery-limt[data-id="' + i.id + '"]').length){
				html += getItemDataHtml(i);
			}
		});
		$('.lottery-box').prepend(html);
	}
	//中奖人员直接显示不带动画
	WallLottery.prototype.showInwall = function(dataList,fn){
		var _this = this;
		if(typeof dataList == 'undefined' || dataList.length == 0){
			_this.playPrizesContral.stop();
			$('#luck-draw').removeClass('lotter-over').addClass('lotter-wait').text('开始抽奖');
			// 清除滚动
			_this.resetRollLuck();
			// fn回调
			fn && fn();
			return;
		}
		var data = dataList.pop();
    	putDataToHtml(data);
    	resizeLotteryItem();
    	_this.showInwall(dataList, fn);
	};

	// 中奖人员的动画——中奖的人员飞到墙上
	WallLottery.prototype.animation = function(dataList,fn) {
		var _this = this;
		//中奖人员放大，发光，飘彩带
		if(!dataList || !dataList.length){
			// 要停止了
			_this.playPrizesContral.stop();
			$('#luck-draw').removeClass('lotter-over').addClass('lotter-wait').text('开始抽奖');
			// 清除滚动
			_this.resetRollLuck();
			// fn回调
			fn();
			return;
		}
		var data = dataList.pop();
		var domObj = $('.unknow');
		var domObjL = domObj.offset().left;
		var domObjT = domObj.offset().top;
		var imgsrc = '/images/wall/unknow.png';
		if(data.imgpath){
			imgsrc = data.imgpath.dealUrl();
			_this.removeRollLuck(imgsrc);
		}
		var nickName = data.nickName;

		if(showFullName){
			var signUser = cacheSignUser[data.id];
			if(signUser){
				nickName = signUser.noteName || signUser.name || nickName;
			}
		}

		var newdom = '<div class="prizeIn"><img class="tou" src="'+imgsrc+'"><p>'+nickName+'</p>';
		newdom += '<img class="ribbon" src="/images/wall/ribbon.png""><div class="rays"></div></div>';
		newdom = $(newdom);
		newdom.append('<div class="crown"><img src="/images/wall/crown.png"></div>');
		newdom.css({
			left:domObjL,
			top:domObjT,
		});
		var shade = $('<div class="prizeIn-mask"></div>');/*页面遮罩层 */
		$('body').append(newdom).prepend(shade);
		var viewWidth = $(window).width();
		var wallContainHeight = $('body').first().height();
		// 头像昵称
		var headPicLeft = (viewWidth / 2 - 298 / 2);
		var zoomBody = parseFloat($('body').css('zoom'));
		zoomBody = isNaN(zoomBody) || zoomBody > 1 ? 1 : zoomBody;
		var headPicTop = (wallContainHeight / 2 - 404 / 2) * zoomBody;
		newdom.animate({/* 中奖弹出效果 */
			left: headPicLeft + 'px',/*放大居中*/
			top: headPicTop +'px',
			width:'298px',
			height:'298px'
		},{
			easing: 'easeInExpo', 
			duration: 500, 
			complete: function(){//显示
				$('.prizeIn .rays,.prizeIn .ribbon,.prizeIn .crown,.prizeIn p').css('display','block');
				// 添加点击消失事件
				$('.prizeIn-mask,.prizeIn .ribbon').bind('click',function(){
					// 通知点击消失
					_this.wall.send({
						system:{
							cmd:'globalNote',
							secondCmd: 'wallLotteryFadeOutEvent'
						},
						data:{}
					});
					shade.remove();
					$('.prizeIn .rays,.prizeIn .ribbon,.prizeIn p').css('display','none');
					var firstWidth = $('.lottery-avatar').first().width();
					if(!firstWidth){
						firstWidth = 216;
					}
					var width = firstWidth + 'px',
						widthCrown = $('.lottery-crown img').first().width() + 'px',
						heightCrown = $('.lottery-crown img').first().height() + 'px',
						firstCrown = $('.lottery-limt').first(),
						leftCrown,topCrown;
					if(typeof firstCrown != 'undefined' && 0 != firstCrown.length){
						leftCrown = firstCrown.offset().left + 'px';
						topCrown = firstCrown.offset().top + 'px';
					}else{
						leftCrown = (viewWidth / 2 - 60) + 'px';
						topCrown = 160 + 'px';
					}
					// 头像box的大小变化
					$('.prizeIn').animate({/* 头像变小隐藏效果 */
						left:leftCrown,
						top:topCrown,
						width:width,
						height:width
					},{
						easing: 'easeInExpo',
						duration: 500,
						complete: function(){
							newdom.fadeOut(500);
							newdom.remove();
							// html 拼装 ，然后放入页面中
							putDataToHtml(data);
							resizeLotteryItem();
							_this.animation(dataList,fn);
						}
					});
				});
			}
		});
	};

	jQuery.wall.wallLottery = function(wall){
		Wall.Activity.type.ACTIVITY_LOTTERY = 'ACTIVITY_LOTTERY';
		var wallLottery = new WallLottery(wall);
		wall.registerActivity(Wall.Activity.type.ACTIVITY_LOTTERY,wallLottery);
		return wallLottery;
	};
})(jQuery);
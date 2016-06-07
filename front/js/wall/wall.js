/*!
 * Hi现场 微信墙/大屏幕JS--wall.js v1.0.0
 * create time:2015/4/10
 * 本文档的编写基于jQuery和JSON对象
 */
/*----------------------------------------------按钮控制-------------------------------------------------*/
$(function() {
	//判断活动状态
	if(wallJson.activeState == 'End'){
		layer.msg('活动已结束！');
	}else if('NoStart' == wallJson.activeState){
		layer.msg('活动未开始！');
	}
	$('body').delegate('.wall_logo,li .wall-continfo','click',function(){
		var _this = $(this).find('img').first();
		if(_this.hasClass('wechat-emoji')){
			return false;
		}
		ImgView.show({
			imgObj: _this
		});
	});
	$('body').delegate('#qrCode','click',function(){
		var _this = $(this);
		var imgSrc = _this.attr('src');
		if(imgSrc.indexOf('placeholder.png') != -1){
			return false;
		}
		$('#win-qcord-img').attr('src',imgSrc);
		$('#qcord-win').show();
	});
	$('body').delegate('.close-qcord-block','click',function(){
		$('#qcord-win').hide();
	});
	$('body').delegate('#wallcontrol','mouseover',function(){
		$(this).css('bottom','0');
	});
	$('body').delegate('#wallcontrol','mouseout',function(){
		$(this).css('bottom','-75px');
	});
	/*墙的控制按钮显示3s后消失*/
	var aa = setTimeout(function(){
		$('#wallcontrol').css('bottom','-75px');
		clearTimeout(aa);
	},3000);
});
/* 微信墙初始化 */
$(function() {
	// 用于操作锚点
	var anchor = new Anchor();
	anchor.parse();
	if('true' == anchor.get('isDebug')){
		isDebug = true;
	}
	// 赞助商滚动控制
	function SponerScroll(){
		this.dom = $('#wallcopyright');
		this.moveDom = $('.sponer-order');
		this.parentW = parseInt(this.moveDom.parents().outerWidth());
		this.oncespeed = 20000;
		this.limit = this.dom.outerWidth();
		this.moveDomW = 0;
		this.moveTime = 0;
		this.edgeGap = (this.limit-this.parentW)/2;
		this.isPlay = false;			//ture  就执行动画
		this.playStart = false;			//true  正在运行动画
		this.upStart = false;			//true  有更新消息
		this.init();
	}
	SponerScroll.prototype = {
		init:function(){
			this.preLoad();
		},
		preLoad:function(){
			//预加载图片处理
			var imgLg = 0;
			var loadImg = 0;
			this.moveDom.find('.sponer-list').each(function(){
				if( $(this).find('img').length > 0){
					imgLg ++;
					var imgSrc = $(this).find('img').attr('src');
					var objImg = new Image();
					objImg.onload = function(){
						loadImg++
					}
					objImg.src = imgSrc;
				}
			});
			var self = this;
			function checkLoad(){
				if( imgLg !== loadImg ){
					setTimeout(checkLoad,500);
				}else{
					self.calcul();
				}
			}
			
			checkLoad();
		},
		calcul : function(){
			var numTotal = 0;
			this.moveDom.find('.sponer-list').each(function(){
				numTotal += (parseInt($(this).outerWidth() )+10);
			});
			if(numTotal > this.parentW){
				this.moveDom.css('width',numTotal+'px');
				this.moveDomW = numTotal;
				this.isPlay = true;
			}else{
				this.moveDom.css('width','auto');
				this.isPlay = false;
			}
			this.upStart = false;
			this.calculTime();
		},
		calculTime : function(){
			var multiple = this.moveDomW/this.parentW;
			multiple=multiple.toFixed(2);
			this.moveTime = multiple * this.oncespeed;
			this.animate();
		},
		animate:function(){
			var self = this;

			if(this.upStart){
				this.calcul();
			}
			if(this.isPlay ){
				this.playStart = true;
				this.moveDom.animate({left:-(self.moveDomW+self.edgeGap) + 'px'},self.moveTime,function(){
					self.moveDom.css('left','100%');
					this.isPlay =	false;
					self.interval();
				});
			}else{
				self.moveDom.stop().css('left','0');
			}
		},
		interval : function(){
			var self = this;
			setTimeout(function(){
				self.animate();
			},100);
		},
		upMsg : function(){
			this.moveDom.stop();
			this.upStart = true;
			this.animate();
		}
	};
	// 直播台控制
	var Tomlive = {
		fadeOutB: false,
		messageArr: [],
		playMessage: function(){
			if(!messageArr || !messageArr.length){
				fadeOutB = true;
				$('#tomLive').fadeOut(1000,function(){
					fadeOutB = false;
				});
				return;
			}
			var curMsg = messageArr.shift();
			var html = '<i class="fa fa-volume-up"></i>  ' + curMsg.content;
			$('#tomLive-msg').css('left','100%').html(html);
			var tomliveW = $('#tomLive-msg').width();
			$('#tomLive-msg').animate({
				left: -tomliveW + 'px'
			},15000,'linear',function(){
				Tomlive.playMessage();
			});
		},
		pushMessage: function(msg){
			messageArr = [];
			for(var i = 0 ; i < 3 ; i++){
				messageArr.push(msg);
			}
			// 检测直播台是否显示
			if($('#tomLive').is(':hidden') || fadeOutB){
				$('#tomLive').stop().fadeIn(1000,function(){
					Tomlive.playMessage();
				});
			}
		}
	};
	// 后台实时通知
	Wall.prototype.playTomlive = function(response){
		try{
			var _this = this;
			var data = response.data;
			Tomlive.pushMessage(data);
		}catch(e){
		}
	};
	/*绑定事件*/
	Wall.prototype.bindAllControl = function(){
		/************信息墙、签到墙、图片墙、抽奖、投票的切换***************/
		if($('#wallcontrol [wall-type]')[0]){
			var objEvt = $._data($('#wallcontrol [wall-type]')[0], 'events');
			if(objEvt && objEvt["click"]){
				// 已经绑定过事件，直接返回
				return;
			}
		}
		var wall = this;
		//隐藏所有墙，清除所有墙的播放（动画）状态
		$('#wallcontrol [wall-type]').click(function(){
			try{
				var id = $(this).attr('id');
				anchor.put('wallType',id).setHash();
				var activityType = $(this).attr('wall-type');
				if(wall.currentActivityType == activityType){
					return;
				}
				if(wall.currentActivityType){
					var currentActivity = wall.getActivity(wall.currentActivityType);
					if(currentActivity){
						currentActivity.afterActivity();
					}
				}
				wall.currentActivityType = activityType;
				var newActivity = wall.getActivity(wall.currentActivityType);
				if(newActivity){
					newActivity.beforeActivity();
				}
			}catch(e){
				console.error(e);
			}
		});
	};
	/*解绑事件*/
	Wall.prototype.unBindAllControl = function(){
		$('#wallcontrol [wall-type]').unbind("click");
	};
	/*手机端控制*/
	Wall.prototype.mcToggleDanMu = function(){
		$(document).trigger({
			type:'keyup',
			which:68,
			originalEvent:KeyboardEvent
		});
	};
	Wall.prototype.mcToggleQrcode = function(){
		$(document).trigger({
			type:'keyup',
			which:77,
			originalEvent:KeyboardEvent
		});
	};
	/*墙切换(批量创建通知)*/
	[].slice.call([
		'mcToggleWallMsg',
		'mcToggleWallPic',
		'mcToggleWallSignin',
		'mcToggleWallSigninLogo',
		'mcToggleWallGuest',
		'mcToggleWallLottery',
		'mcToggleWallVote',
		'mcToggleWallMstching',
		'mcToggleWallShake',
		'mcToggleWallMoney',
		'mcToggleWallShakeprize',
		]).forEach(function(i){
		Wall.prototype[i] = function(response){
			var reg = /([A-Z])+/g;
			var module = response.system.cmd;
			module = module.replace('mcToggleWall','activity');
			module = module.replace(reg,'_$1');
			module = module.toUpperCase();
			$('[wall-type="' + module + '"]:visible').click();
		};
	});
	/*上一页下一页处理*/
	[].slice.call([
		'mcToggleControlFirstPage',
		'mcToggleControlPrevPage',
		'mcToggleControlPlayPause',
		'mcToggleControlNextPage',
		'mcToggleControlLastPage',
		]).forEach(function(i){
		Wall.prototype[i] = function(response){
			var reg = /([A-Z])+/g;
			var control = response.system.cmd;
			control = control.replace('mcToggleControl','');
			control = control.substring(0,1).toLowerCase() + control.substring(1);
			$('#' + control + ':visible').click();
		};
	});
	// 所有活动的配置统一处理
	[].slice.call([
		'walldanmuConfig',
		'wallmsgConfig',
		'wallpicConfig',
		'wallapplysignConfig',
		'walllotteryConfig',
		'wallvoteConfig',
		'wallmstchingConfig',
		'wallshakeConfig',
		'wallmoneyConfig',
		'wallguestConfig',
		'wallshakeprizeConfig',
		]).forEach(function(i){
		var name = 'update' + i.replace(/(\w)/,function(v){return v.toUpperCase()});
		Wall.prototype[name] = function(response){
			try {
				console.log('----wallConfig update----' + i);
				var _this = this;
				var data = response.data;
				cacheWallConfig[i] = data;// cache
				data['noteType'] = i;
				_this.addOrUpdateData(_this.globalDb, data.noteType, data,function() {
					_this.noteAll(Wall.Note.type.UPDATE_GLOBAL, data);
				});
			} catch (e) {
				console.log(e);
			}
		};
	});

	var bindActivity = function(wall){
		var escControl = function() {
			var de = document;
			if (de.exitFullscreen) {
				de.exitFullscreen();
			} else if (de.mozCancelFullScreen) {
				de.mozCancelFullScreen();
			} else if (de.webkitCancelFullScreen) {
				de.webkitCancelFullScreen();
			}
		};
		var fullScreen = function() {
			var de = document.documentElement;
			if (de.requestFullscreen) {
				de.requestFullscreen();
			} else if (de.mozRequestFullScreen) {
				de.mozRequestFullScreen();
			} else if (de.webkitRequestFullScreen) {
				de.webkitRequestFullScreen();
			}else if (typeof window.ActiveXObject != "undefined"){
			 	// for Internet Explorer
				var wscript = new ActiveXObject("WScript.Shell");
				if (wscript) {
					wscript.SendKeys("{F11}");
				}
			}
		};
		// 全屏按钮控制
		$('#btnFullScreen').click(function() {
			_this = $(this);
			if (_this.hasClass('esc_full')) {
				_this.removeClass('esc_full');
				escControl();
			} else {
				_this.addClass('esc_full');
				fullScreen();
			}
		});
		wall.bindAllControl();
	};
	/*绑定墙切换快捷键*/
	var hotkeys = function(){
		$(document).bind('keyup.Q',function (evt){
			$('#signin:visible').click();
		});
		$(document).bind('keyup.L',function (evt){
			$('#signinLogo:visible').click();
		});
		$(document).bind('keyup.U',function (evt){
			$('#guest:visible').click();
		});
		$(document).bind('keyup.X',function (evt){
			$('#msg:visible').click();
		});
		$(document).bind('keyup.C',function (evt){
			$('#lottery:visible').click();
		});
		$(document).bind('keyup.T',function (evt){
			$('#vote:visible').click();
		});
		$(document).bind('keyup.P',function (evt){
			$('#pic:visible').click();
		});
		$(document).bind('keyup.Y',function (evt){
			$('#shake:visible').click();
		});
		$(document).bind('keyup.B',function (evt){
			$('#mstching:visible').click();
		});
		$(document).bind('keyup.M',function (evt){// 二维码
			// 判断是否是弹出的
			if( $('#qcord-win').is(':hidden') ){
				$('#qrCode').click();
			}else{
				$('#qcord-win').hide();
			}
		});
		$(document).bind('keyup.D',function (evt){
			$('#danmu').click();
		});
		$(document).bind('keyup.S',function (evt){
			$('#money:visible').click();
		});
		$(document).bind('keyup.E',function (evt){
			$('#shakeprize:visible').click();
		});
	};
	// 微信墙初始化完成后执行
	var initDone = function(wall) {
		// 所有活动创建
		var wallMessage = $.wall.wallMessage(wall);
		var wallPicture = $.wall.wallPicture(wall);
		var wallLottery = $.wall.wallLottery(wall);
		var wallSignin = $.wall.wallSignin(wall);
		var wallSigninLogo = $.wall.wallSigninLogo(wall);
		var wallGuest = $.wall.wallGuest(wall);
		var wallVote = $.wall.wallVote(wall);
		var wallMstching = $.wall.wallMstching(wall);
		var wallShake = $.wall.wallShake(wall);
		var wallDanmu = $.wall.wallDanmu(wall);// 弹幕不需要注册活动
		var wallMoney = $.wall.wallMoney(wall);//数钱游戏
		var wallShakeprize = $.wall.wallShakeprize(wall);//数钱游戏

		var sponerScroll = null;
		// 墙配置时时更新
		var updateWallInfo = function(data){
			wall.getWallGlobalItem('wall',function(item){
				if(item){
					// 获取墙配置
					var nowTempName = wallJson.styleName ? wallJson.styleName : 'defaults';
					var tempName = item.styleName ? item.styleName : 'defaults';
					if(tempName !== nowTempName){
						// 主题修改需要重新加载页面
						window.location.reload();
						return;
					}
					// 活动进行中
					var logoUrl = item && item.logo ? item.logo.dealUrl() : '/images/placeholder.png';
					var qrCodeUrl = item && item.qrCode ? item.qrCode.dealUrl() : '/images/placeholder.png';
					var title = item && item.title ? item.title : '';
					var ruleDes = item && item.ruleDes ? item.ruleDes : '';
					var sponsorStr = item && item.sponsor ? item.sponsor : '';
					var sponsor = [];
					try{
						sponsor = sponsorStr.toJson();
					}catch(e){
						sponsor.push({img:'/images/wall/temp/hi-eg.png',cont: 'Hi现场工作室提供技术支持' })
					}
					var initDataToHtml = function(){
						// 设置数据
						$('.wall_logo img').attr('src', logoUrl).show();
						if(qrCodeUrl){
							$('.qrcode img').attr('src', qrCodeUrl).show();
						}else{
							$('.qrcode img').hide();
						}

						$('#wallHd').find('.wall_tit .wall-title-box').html(title);

						$('#wallNote').html($.base64.atob(ruleDes,true));
						var getHtml = '';
						for( var i = 0,l = sponsor.length; i< l; i++ ){
							var minDa = sponsor[i];
							getHtml += '<div class="sponer-list"><span class="remove"><i class="fa fa-close"></i></span>';
							if(minDa.img != null){
								getHtml += '<img src="' + minDa.img + '">';
							}
							getHtml += '<span class="sponer-cont">' + minDa.cont + '</span></div>';
						}
						if(sponsor.length){
							$('#wallcopyright').show();
						}else{
							$('#wallcopyright').hide();
						}
						var oldSponerHtml = $('#wallcopyright').find('.sponer-order').html();

						if(oldSponerHtml !== getHtml){
							$('#wallcopyright').find('.sponer-order').html(getHtml);
							sponerScroll && sponerScroll.upMsg();
						}

						var defaultBackImg = tempGlobal[nowTempName]['bgImg'];
						var backgroundImg = item && item.backgroundImg ? item.backgroundImg.dealUrl() : defaultBackImg;
						var urlStyle = 'url(' + backgroundImg + ')';
						$('body').css('background-image',urlStyle);
						try{
							var tempStyle = JSON.parse(item.tempStyle);
							if(tempStyle){
								$('#wlk-wall-block').attr('class','wall-box');
								$('.wall-list')[0].className = 'wall-list';
							}

							if(tempStyle.flipEffect){
								$('.wall-list').addClass(tempStyle.flipEffect);
							}else{
								$('.wall-list').addClass('simplified');
							}
							if(tempStyle.msgOpacity){
								$('#wlk-wall-block').addClass('msg-opacity'+tempStyle.msgOpacity);
								//抽奖墙控制
								var gift = $('#gift-wall-block');
								var className = gift[0].className;
								if( className.indexOf('msg-opacity')>0 ){
									var newClassName = className.replace(/msg-opacity\d+/g,'msg-opacity'+(parseInt(tempStyle.msgOpacity) == 0 ? '4' :tempStyle.msgOpacity) );
									gift[0].className = newClassName;
								}else{
									gift.addClass( 'msg-opacity' + (parseInt(tempStyle.msgOpacity) == 0 ?  '4' :tempStyle.msgOpacity)  )
								}
							}
							if(tempStyle.fontColor){
								$('#wlk-wall-block').css('color',tempStyle.fontColor);
								$('#wallHd').css('color',tempStyle.fontColor);
								$('.wall-multiple-info').css('color',tempStyle.fontColor);
								$('.wall-single-info').css('color',tempStyle.fontColor);
								/*抽奖颜色控制*/
								$('#gift-wall-block').css('color',tempStyle.fontColor);
							}else{
								$('#wlk-wall-block').css('color','');
								$('#wallHd').css('color','');
								$('.wall-multiple-info').css('color','');
								$('.wall-single-info').css('color','');
								/*抽奖颜色控制*/
								//$('#gift-wall-block').css('color','');
							}
							if(tempStyle.messageShape ){
								$('#wlk-wall-block').addClass(tempStyle.messageShape);
							}
							if( tempStyle.userHeadShape){
								$('#wlk-wall-block').addClass(tempStyle.userHeadShape);
							}

							if(!tempStyle || !tempStyle.sponerAlign){
								$('#wallcopyright').find('.sponer-order').css('text-align','center');
							}else{
								$('#wallcopyright').find('.sponer-order').css('text-align',tempStyle.sponerAlign);
							}
							if($('#custom-style').length == 0 ){
								$('body').append('<div id="custom-style"></div>');
							}
							$('#custom-style').html('');
							if( tempStyle && tempStyle.customBg ){
								$('#custom-style').html('<style>.custom-bg{background-color:'+tempStyle.customBg+';}</style>')
							}else{
								$('#custom-style').html('<style>.custom-bg{background-color:#fff;}</style>')
							}
							if(tempStyle && tempStyle.msglength){
								$('.wall-list').addClass('msg-'+tempStyle.msglength);
							}else{
								$('.wall-list').addClass('msg-3');
							}
						}catch(e){
							$('#wallcopyright').find('.sponer-order').css('text-align','center');
						}

					};

					//设置二维码展示窗中的头部信息
					var qrText = item.qrText;
					if(item.encodeFlag == 'Y' && qrText ){
						qrText = $.base64.atob(qrText,true);
					}

					$('#qcord-win').find('.win-hed-cont').html(qrText);

					if(item.type == 'Bound'){
						$('.win-hed-bound').show();
					}else{
						$('.win-hed-bound').hide();
					}
					initDataToHtml();
				}
			});
		};
		wall.register(Wall.Note.type.UPDATE_WALL,updateWallInfo);

		var updateMessageCountUpdate = function(){
			// 更新消息总数
			wall.storeCount(wall.messageDb,function(count){
				var countInt = parseInt($('#msgCount span').html());
				if(!isNaN(countInt) && countInt != count){
					$('#msgCount span').html(count);
					wall.noteAll(Wall.Note.type.UPDATE_MESSAGE_COUNT);
				}
			});
		};
		wall.register(Wall.Note.type.NEW_MESSAGE,updateMessageCountUpdate);
		updateMessageCountUpdate();

		/*同步已经下墙的消息*/
		setTimeout(function(){
			try {
				new DataContent({
					where: {
						flag: wallFlag
					}
				}).post({
					load: false,
					url: '/web/wall/getBlackMsgIds.html',
					callBack: function(data){
						if(data.dataContent){
							var idList = data.dataContent;
							var store = wall.db.objectStore(wall.messageDb);
							for(var i = 0,len = idList.length;i < len;i++){
								store.delete(idList[i]);
							}
						}
					}
				});
			} catch (e) {
			}
		},100);

		// 按钮提示
		$('.tooltip').tooltipster({
			theme : 'tooltipster-light'
		});

		// 活动按钮事件绑定
		bindActivity(wall);

		// 初始化赞助商播放
		sponerScroll = new SponerScroll();

		updateWallInfo();// 进入页面就更新
		// 加载svg图片
		$('svg[data-src]').each(function(i,svg){
			var src = $(svg).attr('data-src');
			$.ajax({
				url: src,
				dataType: 'xml',
				success: function(svgDom){
					$(svg).after(svgDom.documentElement).remove();
				}
			});
		});
		// 显示消息墙
		// 默认消息墙
		var wallType = anchor.parse().get('wallType');
		if(!wallType){
			wallType = 'msg';
		}
		$('#' + wallType).click();

		/*开始同步数据*/
		wall.sync();

		/*绑定墙切换快捷键*/
		hotkeys();

		layer.closeAll('loading');
	};
	/** ***************************微信墙的初始化**************************** */
	function insertWall(_this, wallJson, fn) {
		try {
			var store = _this.db.objectStore(_this.globalDb);
			store.put(wallJson, 'wall').then(function() {
				fn(_this);
			}, function(e) {
				Debug.log('初始化wallJson失败', e);
				fn(_this);
			});
		} catch (e) {
			Debug.log('insertWall初始化时墙数据更新失败', e);
			fn(_this);
		}
	}
	function insertSignUserList(_this, userList, fn) {
		try {
			// 缓存cache对象
			for(var i = 0;i < userList.lengh;i++){
				var item = userList[i];
				cacheSignUser[item.wxUserId] = item;
			}
			if(userList.length > 1000){
				_this.insertSignUser(userList);
				setTimeout(function(){
					fn(_this);
				},500);
			}else{
				_this.insertSignUser(userList, function() {
					fn(_this);
				});
			}
		} catch (e) {
			Debug.log('insertSignUserList 初始化时墙数据更新失败', e);
			fn(_this);
		}
	}
	function insertMessageList(_this, wallMsgPagerVOJson, fn) {
		try {
			var wallMsgListJson = wallMsgPagerVOJson.dataList;
			_this.insertMessage(wallMsgListJson, function() {
				fn(_this);
			});
		} catch (e) {
			Debug.log('insertMessageList初始化时墙数据更新失败', e);
			fn(_this);
		}
	}
	function insertLocalPicList(_this, wallpicLocalgalleryList, fn) {
		try {
			_this.insertLocalPic(wallpicLocalgalleryList, function() {
				fn(_this);
			});
		} catch (e) {
			Debug.log('insertMessageList初始化时墙数据更新失败', e);
			fn(_this);
		}
	}
	$.wall(wallFlag, function(_this) {
		// 数据库初始化完成，把数据进行整理入库操作
		var alreday = 0;
		var initList = new List();
		var noteCallBack = function(){
			alreday++;
			if(initList.size() == alreday){
				initDone(_this);
			}
		};
		initList.add(function(){
			insertWall(_this, wallJson, function(_this) {
				noteCallBack();
			});
		});
		initList.add(function(){
			insertSignUserList(_this, wallapplysignUserList, function(_this) {
				noteCallBack();
			});
		});
		initList.add(function(){
			insertMessageList(_this, wallMsgPagerVOJson, function(_this) {
				noteCallBack();
			});
		});
		initList.add(function(){
			insertLocalPicList(_this, wallpicLocalgalleryList, function(_this) {
				noteCallBack();
			});
		});
		initList.add(function(){
			// 注册所有活动配置通知
			_this.register(Wall.Note.type.UPDATE_GLOBAL,function(data){
				// 活动设置开关处理
				var jquerySel = '';
				if(data.noteType == 'walllotteryConfig'){
					jquerySel = '#wallcontrol li[wall-type="ACTIVITY_LOTTERY"]';
				}else if(data.noteType == 'wallpicConfig'){
					jquerySel = '#wallcontrol li[wall-type="ACTIVITY_PIC"]';
				}else if(data.noteType == 'wallmsgConfig'){
					jquerySel = '#wallcontrol li[wall-type="ACTIVITY_MSG"]';
				}else if(data.noteType == 'wallapplysignConfig'){
					// 显示真实姓名还是微信昵称
					if(data.openState === 'Y'
						&& data.displayType == 'fullname'){
						showFullName = true;
					}
					jquerySel = '#wallcontrol li[wall-type="ACTIVITY_SIGNIN"],li[wall-type="ACTIVITY_SIGNIN_LOGO"]';
				}else if(data.noteType == 'wallvoteConfig'){
					jquerySel = '#wallcontrol li[wall-type="ACTIVITY_VOTE"]';
				}else if(data.noteType == 'wallshakeConfig'){
					jquerySel = '#wallcontrol li[wall-type="ACTIVITY_SHAKE"]';
				}else if(data.noteType == 'wallguestConfig'){
					jquerySel = '#wallcontrol li[wall-type="ACTIVITY_GUEST"]';
				}else if(data.noteType == 'wallmstchingConfig'){
					jquerySel = '#wallcontrol li[wall-type="ACTIVITY_MSTCHING"]';
				}else if(data.noteType == 'wallmoneyConfig'){
					jquerySel = '#wallcontrol li[wall-type="ACTIVITY_MONEY"]';
				}else if(data.noteType == 'wallshakeprizeConfig'){
					jquerySel = '#wallcontrol li[wall-type="ACTIVITY_SHAKEPRIZE"]';
				}else{
					return;
				}
				var openState = data.openState;
				if(openState == 'Y'){
					$(jquerySel).show();
				}else{
					$(jquerySel).hide();
				}
			});
			// 配置信息只有在主题发生变化时进行重新加载
			var defaultsConfig = tempGlobal['defaults'];
			var tempConfig = tempGlobal[wallJson.styleName ? wallJson.styleName : 'defaults'];
			var models = $.extend(defaultsConfig['model'],tempConfig['model'] || {});
			Debug.log('Wall','init','模版名称',wallJson.styleName);
			// 根据配置设置html
			var modelArr = [];
			for(var key in models){
				modelArr.push(models[key]);
			}
			// 加载网页资源
			var loadResource = function(modelArr,fn){
				// 加载模块
				var loadModel = function(arr,fn){
					if(arr.length){
						var item = arr.shift();
						$.get(item['html'],function(html){
							$('[data-modle="' + item['modelBox'] + '"]').append(html);
							loadModel(arr,fn);
						},'html');
					}else{
						fn && fn();
					}
				};
				loadModel(modelArr,fn);
			};
			// 保存处理活动配置
			var saveAllConfig = function(allConfig){
				try{
					// 保存数据
					var saveData = function(keys,data){
						if(!keys.length){
							noteCallBack();
							return;
						}
						var key = keys.shift();
						var value = data[key];
						if(!value){
							saveData(keys,data);
							return;
						}
						value['noteType'] = key;
						_this.addOrUpdateData(_this.globalDb,key,value,function(){
							_this.noteAll(Wall.Note.type.UPDATE_GLOBAL,value);
							saveData(keys,data);
						});
					};
					var keys = [];
					for(var key in allConfig){
						keys.push(key);
						cacheWallConfig[key] = allConfig[key];
					}
					saveData(keys,allConfig);
				}catch(e){
					noteCallBack();
					console.error(e);
				}
			};
			loadResource(modelArr,function(){
				saveAllConfig(allConfig);
			});
		});
		// 对对碰参与人员初始化
		initList.add(function(){
			_this.insert(_this.mstchingUserDb,'id',wallmstchingRegeditList,function(){
				noteCallBack();
			});
		});
		// 执行对应的初始化
		for(var i = 0 ;i < initList.size(); i++){
			initList.get(i)();
		}
	});
});

function screenZoom(){
	var wallHeight = 800;
	var screenH = document.documentElement.clientHeight || document.body.clientHeight;
	document.body.style.zoom = screenH/wallHeight;
}
window.onload = function(){
	screenZoom();
};
window.onresize = function(){
	screenZoom();
};
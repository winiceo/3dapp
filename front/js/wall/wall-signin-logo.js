;(function(){
	function WallSigninLogo(wall){
		this.initAlready = false;
		this.wall = wall;
		this.index = 0;
		this.logoWallObj = $('#signin-logo-wall-block .logowall');

		this.autoPlayFlag = true;//是否正在播放动画
		this.autoPlayControl = null;

		this.onWallSignIn = [];//存储当前签到对象信息
		this.margin = 2;//单元格的间距，单位为px
		this.showCell = [];//用于随机忘显示的单元格放头像的数组

		this.wallLogoConfig = null;
		this.wallapplysignConfig = null;

		this.heartWall = {
			row:15,
			col:20,
			squreColor:'#e50150',
			cellNum:40,
			showCell:[//矩阵中要显示的单元格
			          "13*10","13*9","12*11","12*10","12*9","12*8","11*12","11*11","11*10","11*9","11*8","11*7","10*13","10*12","10*11","10*10","10*9","10*8","10*7","10*6","9*15","9*14","9*13","9*12","9*11","9*10","9*9","9*8","9*7","9*6","9*5","9*4","8*16","8*15","8*14","8*13","8*12","8*11","8*10","8*9","8*8","8*7","8*6","8*5","8*4","8*3","7*17","7*16","7*15","7*14","7*13","7*12","7*11","7*10","7*9","7*8","7*7","7*6","7*5","7*4","7*3","7*2","6*18","6*17","6*16","6*15","6*14","6*13","6*12","6*11","6*10","6*9","6*8","6*7","6*6","6*5","6*4","6*3","6*2","6*1","5*18","5*17","5*16","5*15","5*14","5*13","5*12","5*11","5*10","5*9","5*8","5*7","5*6","5*5","5*4","5*3","5*2","5*1","4*18","4*17","4*16","4*15","4*14","4*13","4*12","4*11","4*10","4*9","4*8","4*7","4*6","4*5","4*4","4*3","4*2","4*1","3*18","3*17","3*16","3*15","3*14","3*13","3*12","3*11","3*10","3*9","3*8","3*7","3*6","3*5","3*4","3*3","3*2","3*1","2*17","2*16","2*15","2*14","2*13","2*12","2*11","2*8","2*7","2*6","2*5","2*4","2*3","2*2","1*16","1*15","1*14","1*13","1*12","1*7","1*6","1*5","1*4","1*3","0*15","0*14","0*13","0*6","0*5","0*4"
				     ]
		};
	}
	//初始化一次消息墙
	WallSigninLogo.prototype.firstInit = function(fn) {
		Debug.log('WallSigninLogo','firstInit');
		var _this = this;
		if(_this.initAlready){
			fn(false);
			return;
		}
		this.initAlready = true;
		// 做初始化
		_this.wall.register(Wall.Note.type.UPDATE_GLOBAL,function(data){
			if (data.noteType == 'wallapplysignConfig') {
				_this.wallapplysignConfig = data;
				_this.wallLogoConfig = JSON.parse($.base64.atob(data.logoDesign,true));
			}
		});
		_this.wall.getWallGlobalItem('wallapplysignConfig',function(item){
			_this.wallapplysignConfig = item;
			if(item.logoDesign){_this.wallLogoConfig = JSON.parse($.base64.atob(item.logoDesign,true))};
			_this.resetShowCell();
			_this.logomatrix();
			fn(false);
		});
		_this.wall.register(Wall.Note.type.UPDATE_WALL_SIGNIN_USER,function(){
			_this.updateSigninCount();
		});
	};
	/*进入消息墙触发*/
	WallSigninLogo.prototype.beforeActivity = function() {
		Debug.log('WallSigninLogo','beforeActivity');
		var _this = this;

		$('#signin-logo-wall-block').show();
		// 左上角数量
		$('#signinUserCount,#signinUserCount::before').show();
		_this.autoPlayFlag = true;

		_this.firstInit(function(flag){
			/*活动初始化*/
			_this.updateSigninCount();
			var autoPlayNextPage = function(){
				if(_this.autoPlayFlag){
					_this.autoPlayControl = null;
					_this.nextPage(function(){
						_this.autoPlayControl = setTimeout(autoPlayNextPage,3000);
					});
				}
			};
			autoPlayNextPage();
		});
	};
	/*离开消息墙触发*/
	WallSigninLogo.prototype.afterActivity = function() {
		Debug.log('WallSigninLogo','afterActivity');
		var _this = this;
		_this.logoWallObj.find('li').removeClass('rotatein');//去除样式
		$('#signin-logo-wall-block').hide();
		// 左上角数量
		$('#signinUserCount,#signinUserCount::before').hide();

		_this.autoPlayFlag = false;
		clearTimeout(_this.autoPlayControl);
	};
	// 更新左上角数字
	WallSigninLogo.prototype.updateSigninCount = function(){
		var signinActivity = this.wall.getActivity('ACTIVITY_SIGNIN');
		if(signinActivity){
			signinActivity.updateSignCount();
		}
	};
	/*重新初始化数组*/
	WallSigninLogo.prototype.resetShowCell = function() {
		var _this = this;
		if(_this.wallLogoConfig){
			_this.showCell = $.map(_this.wallLogoConfig.showCell,function(item,index){return item});
		}else{
			_this.showCell = $.map(_this.heartWall.showCell,function(item,index){return item});

		}
		// 打乱数组顺序
		var randomsort = function(a, b) {
			return Math.random()>.5 ? -1 : 1;//用Math.random()函数生成0~1之间的随机数与0.5比较，返回-1或1
		};
		_this.showCell.sort(randomsort);//对showCell数组进行重新排序
	};
	/* 下一页 */
	WallSigninLogo.prototype.nextPage = function(fn) {
		if(!fn){fn = function(){};}
		var _this = this,
			startId = null,
			len = _this.onWallSignIn.length;
		if (len) {
			startId = _this.onWallSignIn[len - 1].id;
		}
		_this.wall.getSigninWallUser(startId, 1, 'next', function(userList) {
			var user = userList[0];
			if(!user || (len && user.id == startId)){
				fn && fn();
				return;
			}
			if(_this.animation(user)){
				_this.onWallSignIn.push(user);
				fn && fn();
			}
		});
	};
	/*生成矩阵*/
	WallSigninLogo.prototype.logomatrix = function(){
		var _this = this,col,row,squreColor,cellNum,showCell;
		if(_this.wallLogoConfig){
			col = _this.wallLogoConfig.col;
			row = _this.wallLogoConfig.row;
			squreColor = _this.wallLogoConfig.squreColor;
			cellNum =  _this.wallLogoConfig.cellNum;
			showCell = _this.wallLogoConfig.showCell;
		}else{
			col = _this.heartWall.col;
			row = _this.heartWall.row;
			squreColor = _this.heartWall.squreColor;
			cellNum =  _this.heartWall.cellNum;
			showCell = _this.heartWall.showCell;
		}
		var html = '';
		for(var j=0;j<row;j++){
			html += '<ul>';
			for(var i=0;i<col;i++){
				html += '<li data-axis="'+j+'*'+i+'"></li>';
			}
			html += '</ul>';
		}

		//计算每个单元格（cell）的宽高
		_this.logoWallObj.empty().append(html);
		_this.logoWallObj.find('ul').css({'width':cellNum * col + 'px','height':cellNum});
		_this.logoWallObj.find('li').css({'width':cellNum - _this.margin,'height':cellNum - _this.margin,'margin':_this.margin/2});

		//渲染出要填充的单元格
		for(var i = 0; i<showCell.length; i++){
			$('li[data-axis="'+ showCell[i] +'"]').addClass("showcell").css('background-color',squreColor);
		}

		//绑定鼠标悬浮放大事件
		$('.logowall ul li').mouseover(function(){
			var _this =$(this),distance = window.innerHeight - _this.offset().top;
			if(distance < 210){
				_this.find('img.tou').css({
					'width':'150px',
					'height':'150px',
					'margin-left':'-90px',
					'margin-top':'-118px'
				});
				_this.find('p').css('margin-left','-90px');
			}else{
				_this.find('img.tou').css({
					'width':'150px',
					'height':'150px'
				});
			}
		}).mouseout(function(){
			var _this =$(this);
			_this.find('img.tou').removeAttr('style');
		});
	};
	WallSigninLogo.prototype.animation = function(signUser){
		var _this = this;
		if(!signUser){
			return false;
		}

		var url = '/images/wall/unname.jpg';
		if(signUser.imgpath){
			url = signUser.imgpath.dealUrl();
		}
		var nickName = signUser.nickName;
		if(showFullName){
			nickName = signUser.noteName || signUser.name || signUser.nickName;
		}
		var data = _this.showCell.shift();
		if(!data){
			_this.resetShowCell();
			data = _this.showCell.shift();
		}

		var itemLi = $('li[data-axis="' + data + '"]');
		if(!itemLi || !itemLi.length){
			return false;
		}
		itemLi.empty();
		//填充头像添加动画
		var html = '<img class="tou" src="' + url + '">';
		html +='<p>'+nickName+'</p>';
		//获取itemLi的位置，确认动画放大的方式是下方还是上方
		var distance = window.innerHeight - itemLi.offset().top;
		if(distance < 210){
			itemLi.append(html).addClass('uprotate');
		}else{
			itemLi.append(html).addClass('downrotate');
		}
		var pObj = itemLi.children('p')[0];
		setTimeout(function(){
			$(pObj).fadeIn(200);
		},300);
		setTimeout(function(){
			$(pObj).fadeOut(200,function(){
				$(pObj).removeAttr('style');
			});
		},1700);
		setTimeout(function(){
			$(itemLi).removeClass('uprotate').removeClass('downrotate');
		},2000);
		return true;
	};

	jQuery.wall.wallSigninLogo = function(wall){
		Wall.Activity.type.ACTIVITY_SIGNIN_LOGO = 'ACTIVITY_SIGNIN_LOGO';
		var wallSigninLogo = new WallSigninLogo(wall);
		wall.registerActivity(Wall.Activity.type.ACTIVITY_SIGNIN_LOGO,wallSigninLogo);
		return wallSigninLogo;
	};
})(jQuery);
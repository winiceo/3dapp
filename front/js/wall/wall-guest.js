;(function() {
	/** **************************来宾墙 Start********************** */
	/* 更新嘉宾信息 */
	Wall.prototype.updateWallGuest = function(response) {
		try {
			var _this = this;
			_this.noteAll(Wall.Note.type.UPDATE_WALL_GUEST);
		} catch (e) {
		}
	};

	/*------------上面的操作都是针对数据库和后台交互使用----------------------*/
	/*绑定热键*/
	var bindHotkeys = function(_this){
		var id = $('#guest-wall-block .guestwall ul li').eq(_this.curIndex).attr('data-id');
		if (_this.renderInfo(id)) {
			$(document).bind('keyup.space',function (evt){
				if($('#guest-wall-block .guestwall').css('display') == 'block'){
					// 隐藏列表
					$('#guest-wall-block .guestwall').fadeOut(500);
					// 显示详情
					$('#guest-wall-block #guestPop').slideDown(500);
				}else{
					$('#guest-wall-block .guestwall').fadeIn(500);
					$('#guest-wall-block #guestPop').slideUp(500);
				}
			});
			$(document).bind('keyup.up',function (evt){//上一页
				$('#prevPage').click();
			});
			$(document).bind('keyup.down',function (evt){//下一页
				$('#nextPage').click();
			});
		}
	};
	/*解绑热键*/
	var unBindHotkeys = function(){
		$(document).unbind('keyup.space');
		$(document).unbind('keyup.up');
		$(document).unbind('keyup.down');
	};
	// 来宾墙
	var WallGuest = function(wall) {
		this.initAlready = false;
		this.wall = wall;
		this.userList = [];// 嘉宾列表
		this.curIndex = 0;//当前放大显示内容在userList中的index
	};
	// 初始化一次消息墙
	WallGuest.prototype.firstInit = function(fn) {
		Debug.log('WallGuest', 'firstInit');
		var _this = this;
		if (_this.initAlready) {
			fn();
			return;
		}
		this.initAlready = true;
		// 做初始化
		_this.wall.register(Wall.Note.type.UPDATE_WALL_GUEST,function(data){
			_this.updateUserList(function(flag) {
				if(flag){
					_this.render();
				}
			});
		});
		_this.updateUserList(function(flag) {
			_this.render();
			fn();
		});
	};
	WallGuest.prototype.beforeActivity = function() {
		Debug.log('WallGuest', 'beforeActivity');
		var _this = this;
		$('#guest-wall-block').show();
		$('#wallNote,#wallcopyright').css('visibility', 'hidden');
		// 初始化
		_this.firstInit(function(){
			// 绑定事件
			$('#guest-wall-block .guestwall ul').delegate('li','click',function(){
				var id = $(this).attr('data-id');
				if(_this.renderInfo(id)){
					// 隐藏列表
					$('#guest-wall-block .guestwall').fadeOut(500);
					// 显示详情
					$('#guest-wall-block #guestPop').slideDown(500);
				}
			});
			$('#guestPop').bind("click",function(){
				$('#guest-wall-block .guestwall').fadeIn(500);
				$('#guest-wall-block #guestPop').slideUp(500);
			});
			//显示上一页下一页按钮，隐藏无关的按钮
			$('#wallcontrol .fr').hide();
			$('#wallcontrol #play-handle').show();
			$('#firstPage,#lastPage,#playPause').hide();
			$('#audio-control').css('display', 'inline');
			$('#prevPage').bind('click',function(){
				var prevIndex = _this.curIndex - 1;
				if(prevIndex < 0){ prevIndex = _this.userList.length - 1;}
				var prevId = $('#guest-wall-block .guestwall ul li').eq(prevIndex).attr('data-id');
				_this.renderInfo(prevId);
			});
			$('#nextPage').bind('click',function(){
				var nextIndex = _this.curIndex + 1;
				if(nextIndex > _this.userList.length - 1){ nextIndex = 0;}
				var prevId = $('#guest-wall-block .guestwall ul li').eq(nextIndex).attr('data-id');
				_this.renderInfo(prevId);
			});
			bindHotkeys(_this);
			
		});
		
	};
	WallGuest.prototype.afterActivity = function() {
		Debug.log('WallGuest', 'afterActivity');
		var _this = this;
		$('#guest-wall-block').hide();
		$('#wallNote,#wallcopyright').css('visibility', 'visible');
		// 解绑事件
		$('#guest-wall-block .guestwall ul').undelegate();
		$('#firstPage,#lastPage,#playPause').show();
		$('#wallcontrol .fr').hide();
		unBindHotkeys();
	};
	/* 嘉宾列表更新 */
	WallGuest.prototype.updateUserList = function(fn) {
		Debug.log('WallGuest', 'updateUserList');
		try {
			var flag = false;
			var _this = this;
			var auth = "Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXUyJ9.eyJleHAiOjE0NjUwMTIxNTMsInVzZXJuYW1lIjoiY2hlbnNoaSIsImlhdCI6IjE0NjQ5MjU3NTMifQ.MjRuDM3FUenxu3WuM8cLHXH6T7JsEo72yGgyasUpg9uIUKdbA3SvDd_cAwHjDPbcO7dC3pJ0VRF3xxbkCkIPcToYgUDYJ-82x8JfxtzRjCMn8AOUx3XGG4BqVWYzPU3eIW4Qae1ZC86PjR6616A852vyq9YmDHAkIDQlIspyq2jOqDtFW4ael_MYLA42cfS3S-ePgzniCtrwpBaTDa6ltOTQJmPZ0w44DD08tgRgOvYZXaZ5Lo54dn2FWCejgkXhxWLc8TSib6ToBe7tqvYugdAT9fSE1nDGtQTxmaWUGa5l9IQ7R4o-ulxRDLC1hImDDzX55PI65jD-1QczIfD9Qng4gavavLBPqwPbm3E5zjrY7cYErS2mJ69WPR36Fm05HLxVzVH6-Ma7RypuLRhaD_kJKOiZWj6vFnVQCt_R60jU4F5QbddzpXtFFyQhLcoLoJJkuQ6-1Ep0GHfS-3stbaMcT2xDAs6zVWRbnTa45uey2lUIlaKYZKNhX2B72XnhiaPrV81q0rZOca_kGPrXRgszeFB32LAZssPlkPgsZ-Tq_3TnhQlIxNe18sX7oZkY6XvRzF1gUe-sVRLe_fEpt_LtUX55oGFPaBUfLpsIj6pCPpRfF5imxsF6htkypnis4LbBKgaWrA62lRysaN2I-tfR_QF_nB5GK6IleP0Fbus";
			var d = new DataContent();
			d.getrequest({
				load : false,
				url : apidomain+'vipwall/'+wallID,
				callBack : function(data) {
					//alert(data)
					if (data.length > 0) {
						var oldStr = JSON.stringify(_this.userList);
						var newStr = JSON.stringify(data);
						if(oldStr != newStr){
							// 用户信息有修改需要更新
							flag = true;
						}
						_this.userList = data;
					} else {
						Debug.log('WallGuest', 'updateUserList', "嘉宾列表更新失败",
								data);
					}
					fn(flag);
				},
				errorCallBack : function(e) {
					fn(flag);
					Debug.log('WallGuest', 'updateUserList', "嘉宾列表更新失败", e);
				}
			});
		} catch (e) {
			Debug.log('WallGuest', 'updateUserList', "嘉宾列表更新失败", e);
			fn(flag);
		}
	};
	/* 渲染数据到页面 */
	WallGuest.prototype.render = function() {
		var _this = this;
		if(_this.userList.length > 0){
			$('#guest-wall-block .guestwall ul').empty();
			var html = '';
			for(var i = 0 ;i < _this.userList.length;i++){
				var item = _this.userList[i];
				html += '<li data-id="' + item.id + '">';
				html += '<div class="pic"><img src="' + dealImgUrl(item.pic.url,'/images/set/defaultguest.png') + '" alt=""></div>';
				html += '<div class="name">' + item.name + '</div>';
				html += '<p>' + (item.title || '') + '</p>';
				html += '</li>';
			}
			$('#guest-wall-block .guestwall ul').append(html);
		}
	};
	/* 显示详情 */
	WallGuest.prototype.renderInfo = function(id) {
		var _this = this;
		if(_this.userList.length > 0){
			var user = null;
			for(var i = 0 ;i < _this.userList.length;i++){
				if(id == _this.userList[i].id){
					user = _this.userList[i];
					_this.curIndex = i;
					break;
				}
			}
			if(null != user){
				// 显示详情
				$('#guestPop .fl .pic img').attr('src',dealImgUrl(user.pic.url,'/images/set/defaultguest.png'));
				$('#guestPop .fl .name').text(user.name);
				$('#guestPop .fl p').text(user.title || '');
				$('#guestPop .description').html(user.description || '');
				return true;
			}
		}
		return false;
	};
	
	jQuery.wall.wallGuest = function(wall) {
		Wall.Activity.type.ACTIVITY_GUEST = 'ACTIVITY_GUEST';
		var wallGuest = new WallGuest(wall);
		wall.registerActivity(Wall.Activity.type.ACTIVITY_GUEST,wallGuest);
		return wallGuest;
	};
})(jQuery);
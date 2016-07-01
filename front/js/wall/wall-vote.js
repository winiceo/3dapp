;(function() {
	/** **************************投票墙 Start********************** */
	/*绑定热键*/
	var bindHotkeys = function() {
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
		//活动切换控制热键
		$(document).unbind('keyup.up');
		$(document).unbind('keyup.down');
	};
	/*投票同步*/
	Wall.prototype.syncVote = function(response){
		try {
			var _this = this;
			var data = response.data;
			_this.noteAll(Wall.Note.type.UPDATE_VOTE,data);
		} catch (e) {
			console.error(e);
		}
	};
	/*--------------------------------------------------------------上面的操作都是针对数据库和后台交互使用----------------------------------------------------------------*/
	// 投票墙
	var WallVote = function(wall) {
		this.initAlready = false;
		this.wall = wall;
		this.wallvoteSubject = null;
		this.voteindex=0;
		//this.subjectTitle = '';
		this.signinUserCount = 0;// 签到人数
		this.dataColorClass = ['vote-color-red','vote-color-yellow','vote-color-green','vote-color-blue']; //柱形图颜色class的数组
		this.voteNum = 0;//投票项数
		this.contral = null;// 定时更新数据
		this.contralSubject = null;
		this.loadFlag = true;		
	};
	// 初始化一次消息墙
	WallVote.prototype.firstInit = function(fn) {
		Debug.log('WallVote','firstInit');
		var _this = this;
		if(_this.initAlready){
			fn();
			return;
		};
		this.initAlready = true;
		// 做初始化
		_this.wall.register(Wall.Note.type.UPDATE_GLOBAL,function(data){
			if(data.noteType == 'wallvoteConfig'){
				_this.refreshSubject(data);
				sendUpdateVoteCmd(_this);
			};
		});
		// 签到人数更新
		var updateSignCount = function(fn){
			_this.wall.storeCount(_this.wall.signUserDb,function(count){
				_this.signinUserCount = count;
				fn && fn();
			});
		};
		// 签到人数更新通知
		_this.wall.register(Wall.Note.type.UPDATE_WALL_SIGNIN_USER,function(){
			updateSignCount();
		});
		// 查询当前配置的投票
		_this.wall.getWallGlobalItem('wallvoteConfig',function(wallvoteConfig){
			updateSignCount(function(){// 先获取签到人数，然后出事后签到页面，最后回调成功
				_this.refreshSubject(wallvoteConfig);
				fn();
			});
		});
		// 设置修改
		_this.wall.register(Wall.Note.type.UPDATE_VOTE,function(dataList){
			if(jQuery.type(dataList) === "array"){
				_this.updateVote(dataList);
			};
		});
	}
	WallVote.prototype.beforeActivity = function() {
		var _this = this;
		$('#chart-wall-block').show(function(){
			// 初始化
			_this.firstInit(function(){
				// 定时刷新
				sendUpdateVoteCmd(_this);
				_this.contral = setInterval(function(){
					sendUpdateVoteCmd(_this);
				}, 10000);
			});
		});
		//绑定热键
		bindHotkeys();
		//绑定活动切换
		$('#game-control-switch').css('display', 'inline');
		$('#audio-control').css('display', 'inline');
		$('#prevGame').bind('click',function(){
			var request = new DataContent();
			request.getrequest({
				load : false,
				url : apidomain+'pollwall/questions/last/'+wallID,
				callBack : function(data) {
					if(data!=null){
						allConfig.wallvoteConfig.wallvoteSubject = data;
						_this.refreshSubject(allConfig.wallvoteConfig);
					}
				},
				errorCallBack : function(e) {
					//alert('获取投票列表失败');
				}
			});
		});
		$('#nextGame').bind('click',function(){
			var request = new DataContent();
			request.getrequest({
				load : false,
				url : apidomain+'pollwall/questions/next/'+wallID,
				callBack : function(data) {
					if(data!=null){
						allConfig.wallvoteConfig.wallvoteSubject = data;
						_this.refreshSubject(allConfig.wallvoteConfig);
					}
				},
				errorCallBack : function(e) {
					//alert('获取投票列表失败');
				}
			});
		});
	};
	WallVote.prototype.afterActivity = function() {
		var _this = this;
		$('#chart-wall-block').hide();
		clearInterval(_this.contral);
		//解除热键
		unBindHotkeys();
		// 解除活动切换
		$('#wallcontrol .fr').hide();
		$('#prevGame').unbind('click');
		$('#nextGame').unbind('click');
	};
	var sendUpdateVoteCmd = function(_this){
		var requestData = {'system':{'cmd':'syncVote'},'data':{'where':{
			'subjectId': _this.wallvoteSubject.id
		}}};
		_this.wall.send(requestData);
	};
	//  获取数组中最多的票数
	var getMaxCountByList = function(dataList,defaultCount){
		var tempList = [];
		if(dataList && dataList.length > 0){
			tempList = dataList;
			tempList.sort(function(a,b){
			 	return b.count - a.count;
			});
			return tempList[0].count || defaultCount;
		}
		return defaultCount;
	}
	/*投票数据的刷新*/
	WallVote.prototype.updateVote = function(dataList) {
		try{
			var _this = this,
				voteTotalCount = getMaxCountByList(dataList,_this.signinUserCount),// 获取高度计算的基数
				voteNum = _this.voteNum;
			if(null == dataList || dataList.length == 0){return};
			for(var i = 0; i < voteNum; i++){
				var optionId = dataList[i].suboptionId,
					count = dataList[i].count,
					votePercent = count/voteTotalCount, 
					curLi = $('li[data-id = '+ optionId +']');				
				if(voteNum < 11 && voteNum > 0){
					// 通过id找到对应的图表（柱形或者环形）
					curLi.find('.votenum').text(count);
					if( votePercent < 1 && votePercent > 0){
						votePercent = Math.round(votePercent * 100) + '%';// 通过count和userCount计算百分比
					}else if(votePercent >= 1){
						votePercent = '100%';
					}else{
						votePercent = 0;
					}
					if(count){
						curLi.find('.column').css('border-width','1px');
					}
					curLi.find('.column').css('height',votePercent);
				}else{
					// 通过id找到对应的图表（柱形或者环形）
					if( votePercent < 1 && votePercent > 0){
						votePercent = Math.round(votePercent * 300) + '%';// 通过count和userCount计算百分比
					}else if(votePercent >= 1){
						votePercent = '300%';
					}else{
						votePercent = 0;
					}
					curLi.find('.praise-ring').attr('stroke-dasharray',votePercent +' 300%');
					curLi.find('.votenum').text(count);
				}		
			}
		}catch(e){
			Debug.log('WallVote','updateVote','投票更新错误',e);
		}
	};
	// 投票图表初始化
	WallVote.prototype.newChart = function() {
		var _this = this,
			voteTitle = _this.wallvoteSubject&&_this.wallvoteSubject.title? _this.wallvoteSubject.title:'',
			options = _this.wallvoteSubject&&_this.wallvoteSubject.choices?_this.wallvoteSubject.choices:'',// 选项
			voteTotalCount = getMaxCountByList(options,_this.signinUserCount),// 获取高度计算的基数
			voteNum = _this.voteNum = options?options.length:0,
			_html = '';
		Debug.log('WallVote','newChart',_this.wallvoteSubject);
		/*投票项排序*/
		if(options && options.length > 0){
			options.sort(function(a,b){
			 	return a.id - b.id;
			});
		}
		Debug.log('WallVote','options',options);
		_html += '<h3>' + voteTitle + '</h3>';
		if(voteNum == 0 || voteNum < 0 ){
			$('#votewall').append(_html);
			$('.tooltip').tooltipster({
				theme: 'tooltipster-light',
				position: 'bottom'
			});
			return
		};
		if(voteNum < 11 && voteNum > 0){
			_html += '<ul class="style1">';
		}else if(voteNum < 16 && voteNum > 10){
			_html += '<ul class="style2">';
		}else{
			_html += '<ul class="style2 style3">';
		};									
		// 画图
		for(var i=0;i<voteNum;i++){
			var optionId = options[i].id,// data-id
				optionName = options[i].name,
				optionImg = options[i].pic?options[i].pic.url:'',
				count = options[i].poll,
				votePercent = count/voteTotalCount;
			if(voteNum < 11 && voteNum > 0){
				var colorClass = _this.dataColorClass,
					len = colorClass.length,
					styleLi = '',
					styleP = '';
				if(voteNum < 4){
					styleLi = 'style="width:'+ (900 - 10*voteNum)/voteNum +'px"';
				}
				_html += '<li data-id="'+ optionId +'" class="'+colorClass[i%len]+'" '+ styleLi +'>';
				_html += '<span class="votenum">'+ count +'</span>';
				_html += '<div class="cont">';
				if( votePercent < 1 && votePercent > 0){
					votePercent = Math.round(votePercent * 100) + '%';// 通过count和userCount计算百分比
				}else if(votePercent >= 1){
					votePercent = '100%';
				}else{
					votePercent = 0;
				}
				var styleStr = 'height:'+ votePercent +';';
				if(!count){
					styleStr += 'border:0;';
				}
				_html += '<div class="column" style="'+ styleStr +'"></div>';
				_html += '</div>';
				if(optionImg){
					_html += '<img class="pic" src="'+ optionImg.dealUrl() +'" alt="">';
				}else{
					_html += '<img class="pic" src="/images/wall/defaultPic.png"/>';
				};
				if(voteNum < 4){
					styleP = 'padding:0 12px';
				}
				_html += '<p class="votename tooltip" title="'+ optionName +'" '+ styleP +'>'+ optionName +'</p>';			
			}else{
				_html += '<li data-id="'+ optionId +'">';
				if(optionImg){
					_html += '<img class="pic" src="'+ optionImg.dealUrl() +'" />';
				}else{
					_html += '<img class="pic" src="/images/wall/defaultPic.png"/>';
				};
				_html += '<p class="votename tooltip" title="'+ optionName +'" '+ styleP +'>'+ optionName +'</p>';
				_html += '<div class="cont">';
				_html += '<div class="svg-wrap">';			 	
				_html += '<svg class="praise-svg" height="42" width="42" xmlns="http://www.w3.org/2000/svg">';
				_html += '<circle class="praise-bg" cx="50%" cy="50%" r="46%"></circle>';
				if( votePercent < 1 && votePercent > 0){
					votePercent = Math.round(votePercent * 300) + '%';// 通过count和userCount计算百分比
				}else if(votePercent >= 1){
					votePercent = '300%';
				}else{
					votePercent = 0;
				}
				_html += '<circle class="praise-ring praise-animate" cx="50%" cy="50%" r="46%" stroke-dasharray="'+ votePercent +' 300%"></circle>';
				_html += '</svg>';						
				_html += '</div>';
				_html += '<span class="votenum">'+ count +'</span>';	
				_html += '</div>';							
			};
			_html += '</li>&nbsp;';			
		};
		//补充li使多行投票显示时不满一行的内容左对齐
		if(voteNum>10 && voteNum <16 && voteNum%3 != 0){
			var buLi = 3 - voteNum % 3;
			for(var b=0; b<buLi; b++){
				_html += '<li class="list_fix">&nbsp;</li>&nbsp;';
			}
		}else if(voteNum >15 && voteNum%4 != 0){
			var buLi = 4 - voteNum % 4;
			for(var b=0; b<buLi; b++){
				_html += '<li class="list_fix">&nbsp;</li>&nbsp;';
			}
		}
		_html += '<li class="justify_fix">&nbsp;</li>';
		_html += '</ul>';
		$('#votewall').append(_html);
		$('.tooltip').tooltipster({
			theme: 'tooltipster-light',
			position: 'bottom'
		});
	};
	WallVote.prototype.refreshSubject = function(wallvoteSubjectConfig) {
		var _this = this;
		if (null == _this.wallvoteSubject || _this.wallvoteSubject.id != wallvoteSubjectConfig.wallvoteSubject.id) {
			// 图片重新创建
			_this.wallvoteSubject = wallvoteSubjectConfig.wallvoteSubject;			
			// 清除原有chart
			$('#votewall').empty();
			_this.newChart();
		}
	};

	jQuery.wall.wallVote = function(wall) {
		Wall.Activity.type.ACTIVITY_VOTE = 'ACTIVITY_VOTE';
		var wallVote = new WallVote(wall);
		wall.registerActivity(Wall.Activity.type.ACTIVITY_VOTE,wallVote);
		return wallVote;
	};
})(jQuery);
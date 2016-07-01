/*-----------------------------Wall Start -----------------------*/
var Wall = function(setting,fn) {
	var _this = this;
	_this.type = {
		wallMsg:'wallMsg',
		wallPic:'wallPic'
	};
	_this.fn = null == fn ? function(){} : fn;/*初始化完成后的回调方法*/
	_this.databaseName = 'hiWall_' + wallFlag,
	_this.globalDb = 'wall_global';
	_this.signUserDb = 'wall_sign_user';
	_this.messageDb = 'wall_message';
	_this.localPicDb = 'wall_localPic';
	_this.mstchingUserDb = 'wall_mstching_user';
	_this.socket = null;
	/*全局对象*/
	_this.db = null;

	/*当前的活动*/
	_this.currentActivityType = null;
	/*墙中活动*/
	_this.activity = new Map();

	/*消息通知处理*/
	_this.note = new Map();

	_this.syncWallMessageCorl = null;

	_this.cacheSocket = {
		lastMsgNo: 0,
		cacheMsgArr: [],
		cacheState: false,
	};
};

/*墙的通知类型定义*/
Wall.Activity = {};
Wall.Activity.type = {};
/*墙的通知类型定义*/
Wall.Note = {};
Wall.Note.type = {
	NEW_MESSAGE:'NEW_MESSAGE',
	UPDATE_MESSAGE_COUNT:'UPDATE_MESSAGE_COUNT',
	UPDATE_WALL:'UPDATE_WALL',
	UPDATE_WALL_MSGCONFIG:'UPDATE_WALL_MSGCONFIG',
	NEW_PIC:'NEW_PIC',
	NEW_USER:'NEW_USER',
	UPDATE_USER:'UPDATE_USER',
	UPDATE_GLOBAL:'UPDATE_GLOBAL',
	UPDATE_VOTE:'UPDATE_VOTE',
	UPDATE_WALL_SHAKECONFIG:'UPDATE_WALL_SHAKECONFIG',
	UPDATE_WALL_GUEST:'UPDATE_WALL_GUEST',// 嘉宾墙更新
	UPDATE_WALL_SIGNIN_USER:'UPDATE_WALL_SIGNIN_USER',// 签到人数更新通知
	WALL_SHAKE_START: 'WALL_SHAKE_START',// 摇一摇倒计时开始通知
	WALL_SHAKEPRIZE_START: 'WALL_SHAKEPRIZE_START',// 摇活动倒计时开始通知
	UPDATE_WALL_NEW_MSTCHING_USER:'UPDATE_WALL_NEW_MSTCHING_USER', // 对对碰新用户
	WALL_MONEY_START: 'WALL_MONEY_START',
};
(function($){
	var Db = function(name){
		this.name = name;
		this.createDateTime = new Date().getTime();
	};
	/*整理数据库*/
	function cleanDatabase(dbName){
		var db = null;
		var configDbName = 'hiWall';
		var configDbTableName = 'dbList';
		var cleanDb = function(){
			if(db){
				var store = db.objectStore(configDbTableName);
				store.each(function(item){
					var itemDb = item.value;
					var createDateTime = parseInt(itemDb.createDateTime);
					if(new Date().getTime() - createDateTime > 5 * 86400000){// 超过一天的数据库删除()
						$.indexedDB(item.key).deleteDatabase();
						store.delete(item.key);
					}
				});
			}
		};
		$.indexedDB(configDbName, {
			'version' : 1,
			'upgrade' : function(vt) {},
			'schema' : {
				'1' : function(vt) {
					vt.createObjectStore(configDbTableName);
				}
			}
		});
		setTimeout(function(){
			// 先删除，在插入
			db = $.indexedDB(configDbName);
			var store = db.objectStore(configDbTableName);
			store.delete(dbName).then(function(){
				store.add(new Db(dbName),dbName).then(function(){
					cleanDb();
				},function(e){
					Debug.log(e);
				});
			});
		},1000);
	}
	function initDatabase(_this,fn){
		try{
			Debug.log('wall','wall----initDatabase');
			var createDb = function(){
				$.indexedDB(_this.databaseName, {
					'version' : 7,
					'schema' : {
						'1' : function(vt) {
							// 全局
							vt.createObjectStore(_this.globalDb);
							// 签到数据
							var signUserStore = vt.createObjectStore(_this.signUserDb);
							// 消息数据
							var msgStore = vt.createObjectStore(_this.messageDb);
							msgStore.createIndex('sort');
							msgStore.createIndex('contentType');
							msgStore.createIndex('auditState');
							msgStore.createIndex('floorId');
							// 图库
							vt.createObjectStore(_this.localPicDb);
						},
						'7': function(vt){
							// 对对碰
							var mstchingUserStore = vt.createObjectStore(_this.mstchingUserDb);
							mstchingUserStore.createIndex('type');
						},
					}
				}).then(function(){
					Debug.log('wall','wall----初始化成功');
					_this.db = $.indexedDB(_this.databaseName);
					fn(_this);
					// 清除无用的数据库
					cleanDatabase(_this.databaseName);
				},function(e){
					throw new Error('init fail');
				});
			};
			//var anchor = new Anchor();
			//anchor.parse();
			//if(anchor.get('clearDb')){
				$.indexedDB(_this.databaseName).deleteDatabase().then(function(){
					createDb();
					//anchor.remove('clearDb').setHash();
				});
			//}else{
			//	createDb();
			//}
		} catch(e){
			initDatabase(_this,fn);
		}
	}

	function getActivityConfig(_this){
		var alreday = 0;
		var configList = new List();
		var configCallBack = function(){
			alreday++;
			if(configList.size() == alreday){
				setTimeout(function(){
					_this.fn(_this);
				},100);
			}
		};
		configList.add(function(){
			//根据活动ID获取活动详情
			var request = new DataContent();
			request.getrequest({
				load : false,
				url : apidomain+'activity/'+wallID,
				callBack : function(data) {
					//alert(data);
					allConfig.wall.title = data.title;
					allConfig.wall.logo = data.logo?data.logo:"./images/kplogo.svg";
					allConfig.wall.startDate = data.start_at;
					allConfig.wall.endDate = data.end_at;
					allConfig.wall.updateDate = data.update_at;
					allConfig.wall.createDate = data.create_at;
					configCallBack();
				},
				errorCallBack : function(e) {
					alert('获取活动信息失败');
				}
			});
		});
		configList.add(function(){
			//获取弹幕设置
			var request = new DataContent();
			request.getrequest({
				load : false,
				url : apidomain+'danmaku/'+wallID,
				callBack : function(data) {
					if(data!=null){
						allConfig.walldanmuConfig=data;
					}
					configCallBack();
				},
				errorCallBack : function(e) {
					alert('获取弹幕配置失败');
				}
			});
		});
		configList.add(function(){
			//获取签到用户列表
			var request = new DataContent();
			request.getrequest({
				load : false,
				url : apidomain+'signinwall/'+wallID,
				callBack : function(data) {
					if(data!=null){
						//allConfig.walldanmuConfig=data;
					}
					configCallBack();
				},
				errorCallBack : function(e) {
					alert('获取签到用户失败');
				}
			});
		});
		configList.add(function(){
			//获取投票列表
			var request = new DataContent();
			request.getrequest({
				load : false,
				url : apidomain+'pollwall/questions/current/'+wallID,
				callBack : function(data) {
					if(data!=null){
						allConfig.wallvoteConfig.wallvoteSubject = data;
					}
					configCallBack();
				},
				errorCallBack : function(e) {
					alert('获取投票列表失败');
				}
			});
		});
		configList.add(function(){
			//获取奖品列表
			var request = new DataContent();
			request.getrequest({
				load : false,
				url : apidomain+'awardwall/'+wallID,
				callBack : function(data) {
					if(data!=null&&data.length>0){
						allConfig.walllotteryConfig.walllotteryAwardsList = data;
						allConfig.walllotteryConfig.walllotteryAwards = data[0];
						allConfig.walllotteryConfig.lotteryId = data[0].id;
						for(var i = 0 ;i < data.length; i++){
							if(data[i].active){
								allConfig.walllotteryConfig.walllotteryAwards = data[i];
								allConfig.walllotteryConfig.lotteryId = data[i].id;
								break;
							}
						}
					}
					configCallBack();
				},
				errorCallBack : function(e) {
					alert('获取奖品列表失败');
				}
			});
		});
		// 执行对应的初始化
		for(var i = 0 ;i < configList.size(); i++){
			configList.get(i)();
		}
	}

	Wall.prototype.init = function() {
		Debug.log('wall','wall----init');
		var _this = this;
		initDatabase(_this,function(){
			// 初始化socket连接
			Debug.log('wall','wall----new Socket');
			_this.socket = new Socket({
				uri : '/web/wall/socket/' + wallFlag.toLowerCase(),
				onMessage : function(uri,payload) {
					var json = payload.msg;
					//console.log("Received message", payload.msg);
					_this.coreParse(json);
					//_this.coreParse($.base64.atob(json,true));
				},
				onClose : function(e) {
					// 连接断了后进行自动重连
					setTimeout(function(){
						Debug.log('wall','正在重连....');
						_this.socket.connect();
					},1000);
				}
			});
			_this.socket.connect();
			// 连接初始化完成
			getActivityConfig(_this);
		});
	};
	/*处理活动的注册*/
	/*消息通知注册*/
	Wall.prototype.registerActivity = function(activityType,obj){
		if(!Wall.Activity.type[activityType]){
			throw new Error('该类型的活动不支持!');
		}
		activityType = activityType.toLowerCase();
		if(null != this.activity.get(activityType)){
			return;
		}
		this.activity.put(activityType,obj);
	};
	/*获取对应的活动*/
	Wall.prototype.getActivity = function(activityType){
		if(!Wall.Activity.type[activityType]){
			throw new Error('该类型的活动不支持!');
		}
		activityType = activityType.toLowerCase();
		return this.activity.get(activityType);
	};
	/*消息通知处理*/
	/*消息通知注册*/
	Wall.prototype.register = function(noteType,fn){
		if(null == Wall.Note.type[noteType]){
			throw new Error('不存在该类型的处理器');
		}
		var list = this.note.get(noteType);
		if(!list){
			list = new List();
			list.add(fn);
			this.note.put(noteType,list);
		}else{
			var flag = false;
			for(var i = 0;i < list.size();i++){
				var item = list.get(i);
				if(item == fn){
					flag = true;
					break;
				}
			}
			if(!flag){
				list.add(fn);
				this.note.put(noteType,list);
			}
		}
	};
	/*注销通知*/
	Wall.prototype.unRegister = function(noteType){
		this.note.remove(noteType);
	};
	/*新消息通知,type通知类型*/
	Wall.prototype.noteAll = function(noteType,data){
		try{
			if(!Wall.Note.type[noteType]){
				throw new Error('不存在该类型的处理器' + noteType);
			}
			var list = this.note.get(noteType);
			if(!list){
				return;
			}
			for(var i = 0;i < list.size();i++){
				var fn = list.get(i);
				fn(data);
			}
		}catch(e){
			Debug.log('wall','消息通知失败',e);
		}
	};
	/*消息发送方法*/
	var requestTemp = new Map();
	function waitForSocketConnection(json,socket,callBack){
		if(requestTemp.get(json)){
			//防止定时的命令积压太多
			return;
		}
		requestTemp.put(json,'');
		setTimeout(function(){
			try{
				if(1 === socket.socket.readyState && callBack){
					requestTemp.remove(json);
					callBack();
					return;
				}
			}catch(e){
				console.error('Wall','连接失败',e);
			}
			requestTemp.remove(json);
			waitForSocketConnection(json,socket,callBack);
		},5);
	}
	Wall.prototype.send = function(request) {
		var _this = this;
		var json = JSON.stringify(request);
		waitForSocketConnection(json,_this.socket,function(){
			_this.socket.send($.base64.btoa(json,true));
		});
	};
	/*消息解析核心方法*/
	Wall.prototype.coreParse = function(response) {
		try {
			//var response = JSON.parse(response);
			if(isDebug){
				console.log('消息推送',response);
			}
			var _this = this;
			// 核心消息处理器（收到消息后进行消息解析，通过cmd进行相应方法的调用）
			var system = response.system;
			var data = response.data;
			var cmd = system.cmd;
			var func = _this[cmd];
			if(isDebug){
				console.log(response);
			}
			if (!func) {
				console.error('wall','Not support method:' + cmd);
			} else {
				// 判断是否包含标记
				if(!system.no){// 不需要
					_this[cmd](response);
				}else{
					//需要
					if(isDebug){
						console.log('需要标记的活动通知');
					}
					if(!_this.cacheSocket.lastMsgNo || system.no - _this.cacheSocket.lastMsgNo == 1){
						_this[cmd](response);
						_this.cacheSocket.lastMsgNo = system.no;
						console.log('lastMsgNo:' + _this.cacheSocket.lastMsgNo);
					}else{
						_this.cacheSocket.cacheMsgArr.push(response);
						_this.dealCacheMsg();
					}
				}
			}
		} catch (e) {
			console.error('wall',e);
		}
	};
	Wall.prototype.dealCacheMsg = function(){
		console.log('dealCacheMsg');
		var _this = this;
		if(_this.cacheSocket.cacheState){
			return;
		}
		_this.cacheSocket.cacheState = true;
		var go = function(){
			if(isDebug){
				console.log('dealCacheMsg:go');
			}
			if(!_this.cacheSocket.cacheMsgArr.length){
				_this.cacheSocket.cacheState = false;
				return;
			}
			var response = _this.cacheSocket.cacheMsgArr[0];
			var system = response.system;
			if(system.no - _this.cacheSocket.lastMsgNo != 1){
				if(isDebug){
					console.log('dealCacheMsg:go:存在遗漏消息');
				}
				// 向后台获取丢失的消息
				var lostNoArr = [];
				for(var i = _this.cacheSocket.lastMsgNo + 1;i < system.no;i++){
					lostNoArr.push(i);
				}
				if(lostNoArr.length > 1){
					new DataContent({
						flag: wallFlag,
						lostNoArr: lostNoArr
					}).post({
						load: false,
						url: '/web/wall/getLostMsgSession.html',
						callBack: function(data){
							console.log('dealCacheMsg:go:request:data:',lostNoArr,data);
							var arr = data.dataContent;
							for(var item in arr){
								_this.cacheSocket.cacheMsgArr.push(arr[item]);
							}
							// 排序并排重
							var newArr = [];
							var temp = {};
							for(var i in arr){
								var item = arr[i];
								if(!temp[item.system.no]){
									temp[item.system.no] = 1;
									newArr.push(item);
								}
							}
							_this.cacheSocket.cacheMsgArr = newArr;
							_this.cacheSocket.cacheMsgArr.sort(function(a,b){
								return a.system.no - b.system.no;
							});
						},
						complete: function(){
							_this.cacheSocket.lastMsgNo = system.no - 1;
							go();
						}
					});
				}
			}else{
				_this[system.cmd](response);
				_this.cacheSocket.lastMsgNo = system.no;
				delete _this.cacheSocket.cacheMsgArr[0];
				go();
			}
		};
		go();
	};
	/*心跳*/
	Wall.prototype.heart = function(response) {
		var _this = this;
		if(!response){
			var requestData = {'system':{'cmd':'heart'},'data':{'ip': ip}};
			_this.send(requestData);
		}else{
			setTimeout(function(){
				_this.heart();
			},60000);
		}
	};
	/*触发所有的同步信息*/
	Wall.prototype.sync = function(){
		var _this = this;
		setTimeout(function(){
			_this.heart();//心跳
			_this.setTimeoutWallMessage();
		},2000);
	};
	/*同步所有上墙消息*/
	Wall.prototype.setTimeoutWallMessage = function(){
		var _this = this;
		var pageIndex = 0;
		var pageSize = 500;
		var syncMessageConl = function(){
			pageIndex++;
			// 查询所有消息，并入库
			new DataContent({
				pageIndex: pageIndex,
				pageSize: pageSize,
				where: {
					wllFlag: wallFlag
				},
				sort: {
					sort: 'asc'
				},
				exceptCol: ['deleteTag']
			}).getrequest({
				load: false,
				url: apidomain+'msgwall/'+wallID,
				callBack: function(data){
					if(data.length>0){
						try{
							//var dataList = data.dataContent.dataList;
							var dataSize = data.length;
							_this.insertMessage(data,function(){
								_this.noteAll(Wall.Note.type.NEW_MESSAGE,data);
								if(dataSize == pageSize){
									syncMessageConl();
								}
							});
						}catch(e){
							Debug.log('wall','syncWallMessage error',e,response);
						}
					}
				}
			});
		};
		syncMessageConl();
	};
	/*对相应的数据进行新增或者更新*/
	Wall.prototype.addOrUpdateData = function(storeName,key,data,fn){
		if(typeof data == 'undefined'){
			return;
		}
		var _this = this;
		var store = _this.db.objectStore(storeName);
		store.put(data,key).then(function(){
			fn && fn();
		},function(e){
			fn && fn(e);
		});
	};
	/*微信墙活动信息修改*/
	Wall.prototype.updateWall = function(response){
		var _this = this;
		var data = response.data;
		_this.addOrUpdateData(_this.globalDb,'wall',data,function(){
			_this.noteAll(Wall.Note.type.UPDATE_WALL,data);
		});
	};
	/*新消息上墙推送消息，用于单条推送*/
	Wall.prototype.newMessage = function(response) {
		var _this = this;
		var arr = [];
		var data = response.data;
		if($.type(data) === 'array'){
			arr = data;
		}else{
			arr = [data];
		}
		_this.insertMessage(arr,function(){
			_this.noteAll(Wall.Note.type.NEW_MESSAGE,data);
		});
	};
	/*插入消息*/
	Wall.prototype.insertMessage = function(messageArr,fn){
		var _this = this;
		if(!fn){
			fn = function(){};
		}
		if(!messageArr || !messageArr.length){
			fn(_this);
			return ;
		}
		var store = _this.db.objectStore(_this.messageDb);
		var data = messageArr.shift();

		data.sort = data.id;
		// 图片预加载
		if(data.contentType == 'image'){
			ImgUtils.loadImg(data.content);
		}
		/*if((data.userId && data.wallId) && (data.userId != wallJson.userId || data.wallId != wallJson.id)){
			// 错误数据，剔除
			_this.insertMessage(messageArr,fn);
		}else{*/
			if('Y' == data.hide || 'Pass' != data.auditState || 'Y' == data.deleteTag){
				// 删除已经下墙的消息
				store.delete(data.id).done(function(){
					_this.insertMessage(messageArr,fn);
				});
			}else{
				store.put(data,data.id).done(function(){
					setTimeout(function(){
						_this.insertMessage(messageArr,fn);
					},5);
				});
			}
		//}
	};
	/*获取数据库count*/
	Wall.prototype.storeCount = function(storeName,fn){
		var messageArr = [];
		this.db.objectStore(storeName).count().then(function(count){
			fn(count);
		},function(e){
			fn(0);
			Debug.log('wall','storeCount错误',e);
		});
	};
	/*获取globalItem*/
	Wall.prototype.getWallGlobalItem = function(key,fn){
		this.db.objectStore(this.globalDb).get(key).then(function(item){
			fn(item);
		},function(e){
			fn(null);
		});
	};
	// 更新新增数据到数据库
	Wall.prototype.insertOne = function(dbName,idName,data,fn){
		this.insert(dbName,idName,[data],fn);
	};
	Wall.prototype.insert = function(dbName,idName,dataArr,fn){
		try{
			var _this = this;
			if(!dbName || !idName || !dataArr || !dataArr.length){
				Debug.log('wall','insert 新增');
				fn();
				return;
			}
			var store = _this.db.objectStore(dbName);
			var data = dataArr.shift();
			store.put(data,data[idName]).then(function(){
				Debug.log('wall','insert 新增成功');
				_this.insert(dbName,idName,dataArr,fn);
			},function(e){
				Debug.log('wall','insert 新增失败', data, e);
				_this.insert(dbName,idName,dataArr,fn);
			});
		}catch(e){
			console.error(e);
			Debug.log('wall','insert 失败', dbName,idName,dataArr, e);
		}
	};
	/*------------------------------*/
	var wallMap = new Map();
	jQuery.wall = function(wallFlag,fn){
		if(!$.trim(wallFlag)){
			throw new Error('标识不能为空');
		}
		wallFlag = wallFlag.toLowerCase();
		if(!wallMap.get(wallFlag)){
			var wall = new Wall({
				'wallFlag': wallFlag
			},fn);
			wall.init();
			wallMap.put(wallFlag,wall);
		}
		return wallMap.get(wallFlag);
	};
	jQuery.wall.getWall = function(wallFlag){
		if(!$.trim(wallFlag)){
			throw new Error('标识不能为空');
		}
		wallFlag = wallFlag.toLowerCase();
		return wallMap.get(wallFlag);
	};
})(jQuery);
/*-----------------------------Wall End -----------------------*/

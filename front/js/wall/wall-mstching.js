;(function(window, $, undefined) {
	'use strict';
	// 新参与用户实时推送
	Wall.prototype.newMstchingUser = function(response) {
		var _this = this;
		var datas = [].concat(response.data || []);
		this.insert(_this.mstchingUserDb,'id',datas,function(){
			_this.noteAll(Wall.Note.type.UPDATE_WALL_NEW_MSTCHING_USER,datas);
		});
	};
	// 手机控制台
	Wall.prototype.mcToggleMstchingStart = function(){
		var _this = this.getActivity(Wall.Activity.type.ACTIVITY_MSTCHING);
		$('#mstching-wall-block .mstching-wall-controler.waiting .mstching-wall-fire-button.waiting:visible').trigger('click');
	};
	Wall.prototype.mcToggleMstchingStop = function(){
		var _this = this.getActivity(Wall.Activity.type.ACTIVITY_MSTCHING);
		$('#mstching-wall-block .mstching-wall-controler.matching .mstching-wall-fire-button.matching:visible').trigger('click');
	};

	// 唯一ID，用于保证消息同步一致
	var ___id = 'wall-id-' + new Date().getTime() + '-' + Math.ceil(Math.random() * 10000000);

	var build_cmd_proxy = function(Wall,cmd){
		Wall.prototype[cmd] = function(response){
			var data =response.data;
			var wall = this.getActivity(Wall.Activity.type.ACTIVITY_MSTCHING);
			wall[cmd].apply(wall,[data,data.___from == ___id]);
		};
	};

	var batch_build_cmd_proxy = function(){
		var argumentsary = Array.prototype.slice.call(arguments);
		var Wall = argumentsary[0];
		var cmds = argumentsary.length > 0 ? argumentsary.slice(1) : [];
		cmds.forEach(build_cmd_proxy.bind(undefined,Wall));
	}

	/**
	开始匹配 ， 匹配到结果 ， 添加到列表 */
	batch_build_cmd_proxy(Wall,'mstchingOnStart','mstchingOnStop','mstchingOnToTheList','mstchingOnDelete');

	// -----------------------------------------------------------
	
	/**
	根据数据来源的不同，处理ID 
	signUserDb id = user.wxUserId 
	mstchingUserDb id = id*/
	var processIdFn = function(user){
		user.id = this.options.crowd == 'registed' ? user.id : user.wxUserId;
		return user;
	};

	/** 男女对对碰策略 */
	var genderPolicy = {
		/** 预处理数据 */
		process: function(user) {
			if (!user) {
				return;
			}

			if(this.options.crowd == 'registed'){
				return processIdFn.call(this,user);
			}

			// 过滤非法数据
			if (!this.options.includeNonGenderUser && !([1, 2].contains(user.gender))) {
				return;
			}

			// 设置默认性别
			if (![1, 2].contains(user.gender)) {
				user.gender = this.options.defaultUserGender;
			}

			// 处理ID
			return processIdFn.call(this,user);
		},

		/**
		 * 分类 注意，这里的context 是 WallMstching instance ,user 是自动传进来的，函数只需要返回自己的类别名称即可；
		 * 这里的类别只限于两种：`male` or `female` ，如果不是其中的一种，则数据会被抛弃!(墙的逻辑要求不能有第三种)
		 */
		classify: function(user) {
			if(this.options.crowd == 'registed'){
				return customPolicy.classify.call(this,user);
			}else{
				return user.gender == 1 ? 'male' : 'female';
			}
		}
	};

	var customPolicy = {
		process: function(user) {
			return (user && user.type) ? processIdFn.call(this,user) : undefined;
		},
		classify: function(user) {
			if (['left', 'right'].contains(user.type)) {
				return user.type == 'left' ? 'male' : 'female';
			}
			return user.type;
		}
	};

	var WallMstching = function(wall, options) {
		this.wall = wall;

		var self = this;
		this.policies = $.extend({
			gender: genderPolicy,
			custom: customPolicy
		}, (options ? (options.policies || {}) : {}));

		this.options = $.extend({
			type:'gender',
			maleText: '男', // 左侧文字
			femaleText: '女', // 右侧文字
			minUserCount: 2,
			maxUserCount: 500000, // 最大用户数量
			interval: 80, // 匹配用户时候的延时,
			includeNonGenderUser: false, // 未设置性别用户是否可以参与对对碰
			defaultUserGender: 1, // 未设置性别用户的默认性别 if
			flash:true,
			// includeNonGenderUser==true
			dispalyType:'heart', // 头像形状
			imgPathGetter: function() {
				if(this.imgpath){
					return this.imgpath.dealUrl();
				}
				return '/images/wall/unknow.png';
			},
			postMatchedUsersPath:'/web/wallmstching/addResult.html', // 给远程发送匹配结果的路径
			requestRemoveMatchedUsersPath:'/web/wallmstching/deleteResult.html' // 给远程发送删除匹配结果的路径
		}, options);

		this.wallmstchingResultList = wallmstchingResultList || [];
	};

	// 初始化一次抽奖墙
	WallMstching.prototype.firstInit = function(fn) {
		Debug.log('WallMstching', 'firstInit');
		var _this = this;
		if (_this.initAlready) {
			fn();
			return;
		}
		_this.initAlready = true;

		this.updateSetting().done(function(){
			// 监听数据
			_this.wall.register(Wall.Note.type.UPDATE_WALL_NEW_MSTCHING_USER,_this.updateUi.bind(_this));
			_this.wall.register(Wall.Note.type.UPDATE_WALL_SIGNIN_USER,
				_this.updateUi.bind(_this));
			_this.wall.register(Wall.Note.type.UPDATE_GLOBAL,_this.updateSetting.bind(_this));
			
			fn();
		});

		// 绑定开始和结束事件
		$('#mstching-wall-block').on('click','.mstching-wall-controler.waiting .mstching-wall-fire-button.waiting',function(){
				_this.begin();
				_this.broadcast('mstchingOnStart');
			})
			.on('click','.mstching-wall-controler.matching .mstching-wall-fire-button.matching',function(){
				_this.stop();
				_this.broadcast('mstchingOnStop');	
			});
		$('#mstching-wall-block').on('click', '.mstching-wall-pair-remove', function() {
			var $item = $(this).closest('.mstching-wall-pair');
			layer.confirm('请确认是否删除？', {
				btn: ['确定', '取消'], // 按钮
				shade: [0.1, '#fff'] // 不显示遮罩
			}, function(){
				var id = $item.attr('data-pair-id');
				_this.removeFromTheList(id, $item);
				_this.broadcast('mstchingOnDelete',{id:id});
			}, function() {});
		});
	};

	WallMstching.prototype.beforeActivity = function() {
		var self = this;
		this.firstInit(function(users) {
			self.updateUi();
			$('#mstching-wall-block').show();
		});
		$(document).bind('keyup.space',function(){
			$($('.mstching-wall-controler').is('.matching') ? '.mstching-wall-fire-button.matching:visible' : '.mstching-wall-fire-button.waiting:visible').click();
		});
	};

	WallMstching.prototype.afterActivity = function() {
		$('#mstching-wall-block').hide();
		$(document).unbind('keyup.space');
	};

	WallMstching.prototype.updateSetting = function(){
		var deferred = $.Deferred();
		var self = this;
		this.wall.getWallGlobalItem('wallmstchingConfig',function(config){
			var newconfig = $.extend(config , {type:config.mstchType,maleText:config.leftName,femaleText:config.rightName,displayType:config.dispalyType});
			self.options = $.extend(self.options,newconfig);
			self.options.flash = (typeof self.options.flash == 'undefined' || Object.prototype.toString.call(self.options.flash) == '[object Null]') ? true : self.options.flash;

			if(self.options.type == 'gender'){
				self.options.maleText = '男士';
				self.options.femaleText = '女士';
			}

			$('.mstching-wall-list').empty();
			// self.matchedUsers = [];
			if(!self.matchedUsers || self.matchedUsers.length == 0){
			self.matchedUsers = [];
			self.wallmstchingResultList.forEach(function(pair){
				if(pair.deleteTag == 'Y'){
					return ;
				}
				self.matchedUsers.push({id:pair.id,male:pair.leftWxUser,female:pair.rightWxUser,time:pair.createDate.getDate().getTime()});
			});
			}
			self.addToList(self.matchedUsers);
			self.updateUi();
			
			deferred.resolve();
		});
		return deferred.promise();
	};

	// ------------ 自定义方法 -----------------
	/**
	墙同步，广播*/
	WallMstching.prototype.broadcast = function(cmd,data){
		data = data || {};
		data.___from = ___id; // 缓存
		this.wall.send({
			system:{cmd:'globalNote',secondCmd: cmd},
			data:data
		});
		return data;
	};

	/**
	开始匹配*/
	WallMstching.prototype.mstchingOnStart = function(data,isfrome){
		if(isfrome){
			return ;
		}
		this.begin();
	};

	/**
	结束匹配*/
	WallMstching.prototype.mstchingOnStop = function(data,isfrome){
		this.__mstching_on_stop_is_from_me = isfrome;
		if(isfrome){
			return ;
		}
		this.stop();
	};

	/**
	加入列表*/
	WallMstching.prototype.mstchingOnToTheList = function(data,isfrome){
		if(isfrome){
			return ;
		}
		$('.mstching-wall-controler').removeClass('matching').addClass('waiting');
		$('.mstching-wall-fire-button.matching').attr('disabled', false);
		this.matchedUsers = this.matchedUsers || [];
		this.matchedUsers.push(data);
		this.updateUi();
		this.addResultToList(data.id,data.male,data.female,data.time);
	};

	/**
	删除已经匹配到的 */
	WallMstching.prototype.mstchingOnDelete = function(data,isfrome){
		if(isfrome){
			return ;
		}
		this.removeFromTheList(data.id);
	};

	/**
	 * 迭代符合要求的用户 USAGE: 1、this.iteratorUsers(1000).done(function(usablecount));
	 * 2、this.iteratorUsers(1000,function(usableUser){ do something .... }) ;
	 * 3、this.iteratorUsers(1000).progress(function(usableuser){....}).done(function(usablecount){...});
	 */
	WallMstching.prototype.iteratorUsers = function(maxcount, iterator) {
		// var store = this.wall.db.objectStore(this.wall.signUserDb);
		var store = this.wall.db.objectStore(this.options.crowd == 'registed' ? this.wall.mstchingUserDb : this.wall.signUserDb);
		var self = this;
		var usablecount = 0;
		var deferred = $.Deferred();
		store.each(function(r) {
			var user = r.value;
			// 使用策略处理器处理用户数据，如果返回undefined or null，则视为被策略抛弃
			user = self.policies[self.options.type].process.call(self,
				user);
			if (typeof user == 'undefined' || typeof user == 'null') {
				return;
			}
			if (self.matchedUsers) { // 过滤已经匹配到的用户
				for (var i = 0; i < self.matchedUsers.length; i++) {
					var pair = self.matchedUsers[i];
					if (pair.male.id == user.id || pair.female.id == user.id) {
						return;
					}
				}
			}
			usablecount++;
			// 限制数量(这里的数量是实际抽取出来的合法数据的数量...)
			if ((typeof maxcount != 'undefined') && (typeof maxcount != 'null') && (usablecount >= maxcount)) {
				return false;
			}
			(iterator || function() {})(user);
			deferred.notify(user);
		}).fail(deferred.reject.bind(deferred))
			.done(deferred.resolve.bind(deferred, usablecount));
		return deferred.promise();
	};

	/**
	 * 根据分类计算用户数量 USAGE:
	 * this.countClassifyUsers(1000).done(function(usablecount,malecount,femalecount){...})
	 */
	WallMstching.prototype.countClassifyUsers = function(maxcount) {
		var deferred = $.Deferred();
		var r = {
			male: 0,
			female: 0
		};
		var self = this;
		this.iteratorUsers(maxcount).progress(function(user) {
			r[(self.policies[self.options.type].classify.bind(self))(user)] ++; // 分类
		}).fail(deferred.reject.bind(deferred)).done(function(usablecount) {
			deferred.resolve(usablecount, r.male, r.female);
		});
		return deferred.promise();
	};

	/**
	 * 加载符合要求的用户
	 */
	WallMstching.prototype.loadUsers = function(maxcount) {
		var deferred = $.Deferred();
		var users = [];
		this.iteratorUsers(maxcount).progress(users.push.bind(users)).fail(
			deferred.reject.bind(deferred)).done(
			deferred.resolve.bind(deferred, users));
		return deferred.promise();
	};

	/**
	 * 请求删除已经匹配到的用户
	 */
	WallMstching.prototype.requestRemoveMatchedUsers = function(id) {
		var deferred = $.Deferred();
		var dc = new DataContent();
		dc.putWhere('userId',wallJson.userId);
		dc.putWhere('wallId',wallJson.id);
		dc.putWhere('id',id);
		dc.post({
			load:false,
			url:this.options.requestRemoveMatchedUsersPath,
			callBack:function(data){
				if(data.systemContent.state == 'Right'){
					deferred.resolve(data.dataContent.resultCount);
				}else{
					deferred.reject();
				}
			},
			errorCallBack:deferred.reject.bind(deferred)
		});
		return deferred.promise();
	};

	/**
	 * 向远程发送匹配结果
	 */
	WallMstching.prototype.postMatchedUsers = function(male, female) {
		var deferred = $.Deferred();
		var dc = new DataContent();
		dc.put('flag', wallFlag.toUpperCase());
		dc.put('wallId',wallJson.id);
		dc.put('userId',wallJson.userId);
		dc.put("leftWxUserId", male.id);
		dc.put("rightWxUserId", female.id);
		dc.post({
			load:false,
			url:this.options.postMatchedUsersPath,
			callBack:function(data){
				if(data.systemContent.state == 'Right'){
					deferred.resolve(data.dataContent.id,data.dataContent.createDate.getDate().getTime());
				}else{
					deferred.reject();
				}
			},
			errorCallBack:deferred.reject.bind(deferred)
		});
		return deferred.promise();
	};

	/**
	 * 更新界面
	 */
	WallMstching.prototype.updateUi = function() {
		var $malecount = $('.mstching-wall-animate-area.male .mstching-wall-animate-area-text');
		var $femalecount = $('.mstching-wall-animate-area.female .mstching-wall-animate-area-text');
		var self = this;
		this.countClassifyUsers(this.options.maxUserCount).done(function(usablecount, malecount, femalecount) {
			$femalecount.html(self.options.femaleText + '<br />（' + femalecount + '人）');
			$malecount.html(self.options.maleText + '<br />（' + malecount + '人）');
		});
		var matchedUsers = this.matchedUsers || [];
		$('#mstching-wall-block')[matchedUsers.length ? 'removeClass' : 'addClass']('welcome');
	};

	/**
	 * 根据策略分类
	 */
	WallMstching.prototype.classifyUsers = function(users) {
		var deferred = $.Deferred();
		var grouped = group(users, this.policies[this.options.type].classify
			.bind(this));
		defer(deferred.resolve.bind(deferred, grouped.male, grouped.female))();
		return deferred.promise();
	};

	/**
	 * 文字让位
	 */
	WallMstching.prototype.seatText = function() {
		var deferred = $.Deferred();
		$('.mstching-wall-animate-area-text').animate({
			top: '-47px'
		}, 300, deferred.resolve.bind(deferred));
		return deferred.promise();
	};

	/**
	 * 文字复位
	 */
	WallMstching.prototype.resetText = function() {
		var deferred = $.Deferred();
		$('.mstching-wall-animate-area-text').animate({
			top: '0px'
		}, 300, deferred.resolve.bind(deferred));
		return deferred.promise();
	};

	/**
	 * 校验数据
	 */
	WallMstching.prototype.checkData = function(males, females) {
		males = males || [];
		females = females || [];
		var deferred = $.Deferred();
		var fn;
		var fn = (males.length == 0 || females.length == 0) ? deferred.reject
			.bind(deferred, new Error(
				'looks like the user not enough to match!')) : deferred.resolve.bind(deferred, males, females);
		defer(fn)();
		return deferred.promise();
	};

	WallMstching.prototype.onmatched = function(result) {
		var self = this;
		$('.mstching-wall-fire-button.matching').attr('disabled', true);

		// 如果当前墙为接收墙，则中断，并不触发任何后续动作
		if(this.__mstching_on_stop_is_from_me === false){
			return ;
		}

		// 如果动画被禁用，则直接将结果添加到列表中
		if(this.options.flash === true ){
			var $dom = this.addResultToList(undefined,result.male,result.female);
			this.postMatchedUsers(result.male,result.female).always(function(){
				$('.mstching-wall-controler').removeClass('matching').addClass('waiting');
				$('.mstching-wall-fire-button.matching').attr('disabled', false);
			}).done(function(id,time){
				var temp = {id:id,time:time,male:result.male,female:result.female};
				self.broadcast('mstchingOnToTheList',{id:id,time:time,male:result.male,female:result.female});
				self.matchedUsers = self.matchedUsers || [];
				self.matchedUsers.push(result);
				self.updateUi();
				$dom.attr('data-pair-id', id);
				$dom.attr('data-pair-create-time',time);
			}).fail(function(err) {
				self.braodcast('mstchingOnDelete',{id:undefined,male:result.male,female:result.female})
				console.warn(err);
				$dom.remove();
				layer.msg('系统发生了错误!', {
					time: 5000
				});
			});
			return ;
		}

		$.when(this.postMatchedUsers(result.male, result.female),
				this.toTheWall(result.male, result.female))
			.always(function() {
				$('.mstching-wall-controler').removeClass('matching').addClass('waiting');
				$('.mstching-wall-fire-button.matching').attr('disabled', false);
			}).then(function(r, dom) { // 延迟5s
				var id = r[0],time = r[1]; 
				self.broadcast('mstchingOnToTheList',{id:id,time:time,male:result.male,female:result.female});
				self.matchedUsers = self.matchedUsers || [];
				self.matchedUsers.push(result);
				self.updateUi();
				var mask = dom[1];
				dom = dom[0];
				var male = result.male,
					female = result.female;
				var deferred = $.Deferred();
				var hock = window.setTimeout(function() {
					deferred.resolve(male, female, id, dom, mask);
					hock = undefined;
				}, 10000);
				$(dom).add($(mask)).one('click', function() {
					if (typeof hock != 'undefined') {
						window.clearTimeout(hock);
					}
					deferred.resolve(id,male, female, time, dom, mask);
				});
				return deferred.promise();
			}).then(function(id,male, female,time, dom, mask) {
				return self.toTheList(id,male, female, time, dom, mask);
			}).fail(function(err, dom) {
				self.braodcast('mstchingOnDelete',{id:undefined,male:result.male,female:result.female})

				console.warn(err);
				$(dom).remove();
				layer.msg('系统发生了错误!', {
					time: 5000
				});
			}).done(function() {
			});
	};

	WallMstching.prototype.begin = function() {
		this.wall.unBindAllControl();
		var self = this;
		$('.mstching-wall-fire-button.waiting').attr('disabled', true);
		this.seatText(); // 文字移位 // 加载用户 // 分类用户 // 检查数据是否合法(低于3个用户禁止匹配)
		this.loadUsers(this.options.maxUserCount).then(function(users) {
			return self.classifyUsers(users);
		}).then(function(males, females) {
			return self.checkData(males, females);
		}).then(function(males, females) {
			$('.mstching-wall-controler').addClass('matching');
			$('.mstching-wall-fire-button.waiting').attr('disabled', false);
			// 处理单方向为空的情况
			// males = males.length > 0 ? males : females; // 如果男性为空，使用女性匹配
			// females = females.length > 0 ? females : males; // 如果女性为空，则使用男性匹配

			var animator = new Animator('.mstching-wall-controler',
				undefined, undefined, {
					imgPathGetter: self.options.imgPathGetter
				});
			var deferred = $.Deferred();
			// 初始化匹配器
			var matcher = self.matcher = new Matcher(males, females, [], self.options.interval);
			// 匹配动作
			matcher.progress(animator.show.bind(animator));
			// 停止动画
			matcher.always(function(){
				animator.stop();
			});
			matcher.then(deferred.resolve.bind(deferred),
				deferred.reject.bind(deferred));
			return deferred.promise();
		}).always(function() { // 重置控制
			self.wall.bindAllControl();
			self.resetText();
		}).done(function(result) {
			if(!result || !result.female || !result.male){
				return ;
			}
			self.onmatched(result);
		}).fail(function(err) {
			$('.mstching-wall-controler').removeClass('matching').addClass(
				'waiting');
			$('.mstching-wall-fire-button.matching').add(
				$('.mstching-wall-fire-button.waiting')).attr(
				'disabled', false);
			if (!err) {
				return;
			}
			console.warn(err);
			layer.msg('人数不够，无法开始对对碰!', {
				time: 5000
			});
		});
	};

	/**
	 * 停止匹配(匹配出结果)
	 */
	WallMstching.prototype.stop = function() {
//		this.wall.bindAllControl();
		if (!this.matcher) {
			return false;
		}
		this.matcher.stop();
		return true;
	};

	/**
	 * 放弃匹配
	 */
	WallMstching.prototype.abort = function() {
		if (!this.matcher) {
			return false;
		}
		this.matcher.abort();
		return true;
	};

	/**
	列表排序 */
	WallMstching.prototype.sortListByTime = function(){
		$('.mstching-wall-list .mstching-wall-pair').sort(function(a,b){
			return -(parseInt($(a).attr('data-pair-create-time')) - parseInt($(b).attr('data-pair-create-time')));
		}).appendTo('.mstching-wall-list');
	};

	/**
	构建列表项目*/
	WallMstching.prototype._make_pair_dom = function(id,male,female,time){
		var $dom = $($('#mstching-wall-pair-template-' + this.options.displayType).html());
		$dom.attr('data-pair-male-id', male.id).attr('data-pair-female-id',
			female.id);
		if(id){
			$dom.attr('data-pair-id',id);
		}
		if(time){
			$dom.attr('data-pair-create-time',time);
		}
		[].slice.call([male,female]).forEach(function(i){
			if(showFullName){
				var signUser = cacheSignUser[i.id];
				if(signUser){
					i.nickName = signUser.noteName || signUser.name || i.nickName;
				}
			}
		});

		$dom.find('.mstching-wall-pair-avatar-wrapper.male .mstching-wall-pair-avatar')
			.attr('src', this.options.imgPathGetter.call(male));
		$dom.find('.mstching-wall-pair-avatar-wrapper.male .mstching-wall-pair-name')
			.html((male.nickName || ''));
		$dom.find('.mstching-wall-pair-avatar-wrapper.female .mstching-wall-pair-avatar')
			.attr('src', this.options.imgPathGetter.call(female));
		$dom.find('.mstching-wall-pair-avatar-wrapper.female .mstching-wall-pair-name')
			.html((female.nickName || ''));
		return $dom;
	};

	/**
	 * 配对成功，显示配对结果 构造发光展示项目 ，并移动至屏幕中央展示
	 */
	WallMstching.prototype.toTheWall = function(male, female) {
		var deferred = $.Deferred();
		// 构造模板
		var $dom = this._make_pair_dom(undefined,male,female,undefined);
		// $(document.body).append($dom);
		// 构造包裹DOM，组装
		var $wrapper = $('<div class="mstching-shining-show">' + '<div class="rays mstching-wall" style="display: block;"></div>' + '</div>');
		$wrapper.prepend($dom);
		$(document.body).append($wrapper);

		// 构造蒙版
		var $mask = $('<div class="mstching-wall-mask" ></div>').appendTo(
			document.body).animate({
			opacity: 1
		}, 300);

		// 计算位置
		// 计算初始位置(匹配动画的中间)
		var $container = $(document.body);
		var ow = $container.innerWidth(),
			oh = $container.innerHeight();
		var dw = $wrapper.outerWidth(),
			dh = $wrapper.outerHeight();
		$wrapper.css({
			position: 'absolute',
			left: (ow / 2 - dw / 2) + 'px',
			top: (580 - dh / 2) + 'px'
		}).addClass('to-show');
		window.setTimeout(function() {
			deferred.resolve($wrapper.get(0), $mask.get(0));
		}, 0);
		return deferred.promise();
	};

	/**
	 * 从已经匹配到的列表中删除结果
	 */
	WallMstching.prototype.removeFromTheList = function(id, dom) {
		var $dom = dom ? $(dom) : $('.mstching-wall-pair[data-pair-id=' + id + ']');
		var maleId = $dom.attr('data-pair-male-id');
		var femaleId = $dom.attr('data-pair-female-id');
		var self = this;
		this.requestRemoveMatchedUsers(id).done(function() {
			layer.msg('删除成功', {
				time: 2000
			});
			$dom.remove();
			for (var i = 0; i < self.matchedUsers.length; i++) {
				var pair = self.matchedUsers[i];
				if (pair.male.id != maleId && pair.female.id != femaleId) {
					continue;
				}
				self.matchedUsers.splice(i, 1);
				break;
			}
			self.updateUi();
		}).fail(function(err) {
			layer.msg('删除失败', {
				time: 2000
			});
		});
	};

	/**
	直接添加结果到列表中 */
	WallMstching.prototype.addToList = function(pairs){
		pairs = [].concat(pairs || []);
		var self = this;
		pairs.forEach(function(pair){
			self.addResultToList(pair.id,pair.male,pair.female,pair.time);
		});
		this.sortListByTime();
	};

	/**
	直接添加结果到列表中 */
	WallMstching.prototype.addResultToList = function(id,male,female,time){
		var $dom = this._make_pair_dom(id,male,female,time);
		$('.mstching-wall-list').prepend($dom);
		return $dom;
	};

	/**
	 * 把配对结果添加到列表中
	 */
	WallMstching.prototype.toTheList = function(id,male, female,time, dom, mask) {
		var $dom = $(dom);
		var $mask = $(mask);
		$mask.animate({
			opacity: 0
		}, 300, function() {
			defer($mask.remove.bind($mask))(); // 删除遮罩
		});
		var $item = $dom.find('.mstching-wall-pair');
		$item.attr('data-pair-id', id);
		$item.attr('data-pair-create-time',time);
		var $cloneitem = $item.clone();
		$cloneitem.css('visibility', 'hidden');
		$('.mstching-wall-list').prepend($cloneitem);
		$dom.find('rays').remove();
		var deferred = $.Deferred();
		var self = this;
		$dom.css({
			'top': $dom.offset().top + 'px',
			'left': $dom.offset().left + 'px',
			'-webkit-transform': 'scale(1.4)'
		}).removeClass('to-show').addClass('to-list').animate({ // 缩小移动至列表左上角(第一个元素的位置)
			left: ($cloneitem.offset().left - $dom.outerWidth() / 2 + $item.outerWidth() / 2) + 'px',
			top: ($cloneitem.offset().top - $dom.outerHeight() / 2 + $item.outerHeight() / 2) + 'px'
		}, 1000, function() {
			self.sortListByTime();
			$cloneitem.css('visibility', 'visible');
			// 构造列表展示项目，并设置相关信息
			$dom.remove();
		});
		return deferred.promise();
	};



	$.wall.wallMstching = function(wall) {
		Wall.Activity.type.ACTIVITY_MSTCHING = 'ACTIVITY_MSTCHING';
		var wallMstching = new WallMstching(wall);
		wall.registerActivity(Wall.Activity.type.ACTIVITY_MSTCHING,wallMstching);
		return wallMstching;
	};
	// -- 匹配器 ---------------------------------------------- //
	var Matcher = function(males, females, matchedUsers, interval) {
		var deferred = $.Deferred();
		// 重置
		this.matching = true;
		this.abort = false;
		this.result = undefined;
		this.matchedUsers = matchedUsers;

		// 开始匹配
		Matcher.RAF(this._raf.bind(this, deferred, males, females), interval);

		var self = this;
		// 提供API
		var promise = deferred.promise();
		// 主动停止
		promise.stop = function() {
			self.matching = false;
		};
		// 主动放弃
		promise.abort = function() {
			self.abort = true;
		};
		return promise;
	};

	/**
	 * 匹配逻辑
	 */
	Matcher.prototype._raf = function(deferred, males, females) {
		if (!this.matching) {
			deferred.resolve(this.result); // 如果停止，返回上一个匹配到的结果
			return false;
		}

		if (this.abort) {
			deferred.reject(); // 如果放弃直接结束
			return false;
		}

		try {
			this.result = this.match(males, females); // 匹配男女
		} catch (e) {
			console.warn(e);
			deferred.reject(); // 如果错误，直接结束
			return false;
		}

		deferred.notify(this.result.male, this.result.female); // 通知匹配到的结果
	};

	/**
	 * 匹配男女
	 *
	 * @param males{array} :
	 *            男性
	 * @param females{array} :
	 *            女性
	 */
	Matcher.prototype.match = function(males, females) {
		this.malerandommer = this.malerandommer || new Randommer(0, males.length - 1);
		this.femalerandommer = this.femalerandommer || new Randommer(0, females.length - 1);
		var male = Matcher.randomUser(males, this.malerandommer);
		var female = Matcher.randomUser(females, this.femalerandommer, pluck(
			(this.matchedUsers || []), 'id').concat(male.id)); // 匹配女性，并排除已经匹配到的男性(解决同为女性会出现匹配到同一个人的情况)
		return {
			male: male,
			female: female
		};
	};

	/**
	 * 随机用户
	 *
	 * @param users{user
	 *            array} :
	 * @param withoutIds{number
	 *            or number array} : 需要被排除的用户ID
	 * @param _deepth :
	 *            当前深度(不用传递，内部)
	 */
	Matcher.randomUser = function(users, randommer, withoutIds, _deepth) {
		withoutIds = [].concat(withoutIds || []);
		_deepth = typeof _deepth == 'undefined' ? 1 : _deepth; // 默认深度1
		if (_deepth == 15) { // 如果深度超过15，则视为匹配失败，报错
			throw new Error('Looks like user count is not enough to match');
		}
		var user = users[randommer.next()];
		if (!withoutIds.contains(user.id)) {
			return user;
		}
		// 如果匹配到了被排除的用户ID，深度+1，并重新匹配
		_deepth += 1;
		return Matcher.randomUser(users, randommer, withoutIds, _deepth);
	};

	/**
	 * Request Animate Frame 请求帧
	 *
	 * @param fn{function} :
	 *            需要处理的核心逻辑
	 * @param interval{number} :
	 *            延迟
	 */
	Matcher.RAF = function(fn, interval) {
		window.setTimeout(function() {
			var r = fn();
			if (r === false) {
				return;
			}
			Matcher.RAF(fn, interval);
		}, interval);
	};

	/**
	 * 匹配某个数字范围内的随机数(step默认1) ，在所有人都匹配一遍之前不会重复
	 */
	var Randommer = function(from, to, step) {
		if (to - from == -1) {
			throw new Error('invalid random range:' + from + ' - ' + to);
		}
		// 设置默认值 1
		step = typeof step == 'undefined' ? 1 : step;
		if (step == 0) {
			throw new Error('invalid random step:' + step);
		}

		// 填充随机池
		this._randomary = this._randomary || [];
		if (this._randomary.length == 0) {
			for (var i = from; i <= to; i += step) {
				this._randomary.push(i);
			}
		}

		// 打乱数组
		this._randomary.sort(function() {
			return 0.5 - Math.random();
		});

		var self = this;
		return {
			self: self,
			next: function() {
				// 一旦随机池被耗尽，则重新填充
				if (self._randomary.length == 0) {
					self._randomary = new Randommer(from, to, step).self._randomary;
				}
				return self._randomary.shift();
			}
		};
	};

	/**
	 * 动画控制
	 *
	 * @param dom
	 *            {string or dom object or jquery object} : dom 必须存在两个子节点
	 *            `.wall-mstching-males` or `.wall-mstching-females` ，分别作为动画开始之后放置头像的容器;
	 *            males,females两个参数可以为undefined
	 *            ，如果这样，调用show或者next的时候，必须传递male和female参数
	 * @param options
	 *            {map}:参考 Animator.defaults
	 */
	var Animator = function(dom, males, females, options) {
		this.options = $.extend(Animator.defaults, options);

		this.$dom = $(dom);

		// 存放男性的container
		this.$males = this.$dom.find('.mstching-wall-males');
		// 女性
		this.$females = this.$dom.find('.mstching-wall-females');

		// 男性用户
		this.males = males;
		// 女性用户
		this.females = females;

		this.pairs = [];

		// 初始随机池
		this.maleRandommer = !males ? undefined : (this.maleRandommer || new Randommer(0, this.males.length - 1));
		this.femaleRandommer = !females ? undefined : (this.femaleRandommer || new Randommer(0,
			this.females.length - 1));
	};

	Animator.defaults = {
		// 获取用户图片路径的方法
		imgPathGetter: function() {
			return this.imgpath;
		},
		// 模板
		templates: {
			male: '<img class="mstching-wall-avatar animate" src="/images/wall/mstching/default-avatar-male.png" />',
			female: '<img class="mstching-wall-avatar animate" src="/images/wall/mstching/default-avatar-male.png" />'
		},
		// 默认图片地址
		defaultImgPath: '1439447188.6903.jpg',
		// 从显示到就为的时间
		enterDuration: 100,
		// 从就为到消失的时间
		outDuration: 250,
		// 就为之后的保持时间
		keepTime: 100,
		// 从显示到就为的偏移，一个左，一个右，^_^
		enterOffset: 25,
		// 从就为到消失的便宜
		outOffset: 5
	};

	/**
	 * 开始
	 */
	Animator.prototype.start = function() {
		this.stoped = false;
		this.next();
	};

	Animator.prototype.show = function(male, female) {
		if (!male) {
			throw new Error('male is null ');
		}
		if (!female) {
			throw new Error('female is null ');
		}
		this.stoped = false;
		this.next(male, female);
	};

	Animator.prototype.next = function(male, female) {
		var deferred = $.Deferred();
		if (this.stoped) {
			if (this.$pre_male) {
				this.$pre_male.remove();
			}
			if (this.$pre_female) {
				this.$pre_female.remove();
			}
			this.stoped = true;
			delay(deferred.reject.bind(deferred))();
			return deferred.promise();
		}

		var once = male && female;

		male = male || this.males[this.maleRandommer.next()];
		var maleImgPath = this.options.imgPathGetter.call(male);
		female = female || this.females[this.femaleRandommer.next()];
		var femaleImgPath = this.options.imgPathGetter.call(female);
		// 构造UI
		var $male = this.$pre_male = $(this.options.templates.male).attr('src',
			maleImgPath);
		var $female = this.$pre_female = $(this.options.templates.female).attr(
			'src', femaleImgPath);
		$male.appendTo(this.$males);
		$female.appendTo(this.$females);

		var self = this;
		// 进入
		var malepromise = this.enter($male, 'right', this.options.enterOffset)
			.then(function($male) {
				// 进入后立即准备开始下一轮匹配，所以这里为异步延迟执行
				self.keep($male).then(
					function($male) { // 保持
						return self.out($male, 'right', -self.options.outOffset); // 消失
					}).then(function($male) {
					return self.remove($male); // 删除
				});
			});

		var femalepromise = this.enter($female, 'left',
			this.options.enterOffset).then(function($female) {
			self.keep($female).then(function($female) {
				return self.out($female, 'left', -self.options.outOffset);
			}).then(function($female) {
				return self.remove($female);
			});
		});
		// 待男女双方都就位后才能进入下一轮匹配
		$.when(malepromise, femalepromise).done(!once ? self.next.bind(self) : deferred.resolve.bind(deferred,
			male, female));
		return deferred.promise();
	};
	/**
	 * 进入逻辑
	 */
	Animator.prototype.enter = function(dom, prop, position) {
		var $dom = $(dom);
		var deferred = $.Deferred();
		var props = {
			opacity: 1
		};
		props[prop] = position;
		$dom.animate(props, this.options.enterDuration, deferred.resolve.bind(
			deferred, $dom, prop, position));
		return deferred.promise();
	};

	/**
	 * 保持
	 */
	Animator.prototype.keep = function(dom) {
		var $dom = $(dom);
		var deferred = $.Deferred();
		window.setTimeout(function($dom) {
			return function() {
				deferred.resolve($dom);
			};
		}($dom), this.options.keepTime);
		return deferred.promise();
	};

	/**
	 * 消失
	 */
	Animator.prototype.out = function(dom, prop, position) {
		var $dom = $(dom);
		var deferred = $.Deferred();
		var props = {
			opacity: 0
		};
		props[prop] = position;
		$dom.animate(props, this.options.outDuration, function() {
			deferred.resolve($dom, prop, position);
		});
		return deferred.promise();
	};

	/**
	 * 删除
	 */
	Animator.prototype.remove = function(dom) {
		var $dom = $(dom);
		var deferred = $.Deferred();
		// 删除DOM对象操作可能导致动画卡顿，延迟
		window.setTimeout(function($dom) {
			return function() {
				$dom.remove();
			};
		}($dom), 0);
		deferred.resolve($dom);
		return deferred.promise();
	};

	/**
	 * 结束、放弃
	 */
	Animator.prototype.stop = Animator.prototype.abort = function() {
		this.stoped = true;
	};

	/**
	 * 延迟指定的时间(ms)
	 */
	var delay = function(fn, delay, args) {
		return window.setTimeout.bind(window, function() {
			fn.apply(fn, (args || []).concat(Array.prototype.slice.call(arguments)));
		}, delay);
	};

	/**
	 * 延迟0
	 */
	var defer = function(fn, args) {
		return delay(fn, 0, args);
	};

	/**
	 * 组合函数，将多个函数组合成为一个函数
	 */
	var compose = function() {
		var funcs = arguments;
		return function() {
			var args = arguments;
			for (var i = funcs.length - 1; i >= 0; i--) {
				args = [funcs[i].apply(this, args)];
			}
			return args[0];
		};
	};

	/**
	 * 分组
	 */
	var group = function(datas, iterator) {
		var result = {};
		datas.forEach(function(data, idx) {
			var key = iterator.call(iterator, data, idx);
			var items = result[key] || (result[key] = []);
			items.push(data);
		});
		return result;
	};

	var pluck = function(datas, key) {
		var r = [];
		datas.forEach(function(data) {
			r.push(data[key]);
		});
		return r;
	};
})(window, jQuery);
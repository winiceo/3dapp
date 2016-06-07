;(function(){
	/*签到入库*/
	Wall.prototype.updateApplysignUser = function(response){
		// 解析返回回来的数据
		try{
			var _this = this;
			var data = response.data;
			_this.insertSignUser([data],function(){});
		}catch(e){
		}
	};
	Wall.prototype.insertSignUser = function(userArr,fn){
		var _this = this;
		if(!fn){
			fn = function(){};
		}
		if(!userArr || !userArr.length){
			Debug.log('wall','insertSignUser 批量插入完毕');
			_this.noteAll(Wall.Note.type.UPDATE_WALL_SIGNIN_USER);
			fn(_this);
			return ;
		}
		var store = _this.db.objectStore(_this.signUserDb);
		var data = userArr.shift();
		cacheSignUser[data.wxUserId] = data;
		// 图片预加载
		// ImgUtils.loadImg(data.imgpath);
		store.put(data,data.id).done(function(){
			Debug.log('wall','insertSignUser 数据更新成功');
			var time = 5;
			if(!userArr.length % 500){
				_this.noteAll(Wall.Note.type.UPDATE_WALL_SIGNIN_USER);
				time = 1000;
			}
			setTimeout(function(){
				_this.insertSignUser(userArr,fn);
			},time);
		});
	};
	Wall.prototype.getSigninWallUser = function(startId,count,direction,fn){
		var range = null;
		var messageArr = [];
		direction = direction.toLowerCase();
		if(startId){
			if('prev' == direction){
				range = [0,startId,true,true];
			} else {
				range = [startId,maxSort,true,true];
			}
		}
		this.db.objectStore(this.signUserDb).each(function(item){
			if(messageArr.length < count){
				if(item.value.nickName){
					if('prev' == direction){
						messageArr.unshift(item.value);//添加到开始
					}else{
						messageArr.push(item.value);
					}
				}
			}
		},range,direction).then(function(){
			fn(messageArr);
		},function(e){
			Debug.log('getSigninWallUser',e);
			console.log(e);
			fn([]);
		});
	};
	/****************************签到墙 Start***********************/
	var WallSignin = function(wall) {
		this.wall = wall;
		this.autoPlayFlag = true;//是否正在播放动画
		this.onWallSignIn = [];//存储当前签到对象信息
		this.autoPlayControl = null;

		this.wallapplysignConfig = null;

		this.table = [];
		this.objects = [];
		this.targets = { table: [], sphere: [], helix: [], grid: [],heart:[],butterfly:[] };
		this.transformindex=0;
		this.objectindex = 0;
	};
	WallSignin.prototype.firstInit = function(fn) {
		Debug.log('WallSignin','firstInit');
		var _this = this;
		if(_this.initAlready){
			fn();
			return;
		}
		_this.initAlready = true;
		_this.autoPlayFlag = true;

		//创建3D对象
		_this.maxcount = 108;
		var width = $("#singIn_container").width();
		var height = $("#singIn_container").height();
		_this.camera = new THREE.PerspectiveCamera( 40, width / height, 1, 10000 );
		_this.camera.position.z = 3000;
		_this.scene = new THREE.Scene();

		_this.renderer = new THREE.CSS3DRenderer();
		_this.renderer.setSize( width, height );
		//console.log("window.innerWidth"+$("#singIn_container").width()+$("#singIn_container").height());
		_this.renderer.domElement.style.position = 'absolute';
		$("#singIn_container").append($(_this.renderer.domElement));

		var row =1;
		var col = 1;
		var vector = new THREE.Vector3();
		for(var i =0;i<_this.maxcount;i++){
			var file = [];
			file[0] = '';
			file[1] = col;
			file[2] = row;
			col++;
			if(col > 18)
			{
				col = 1;
				row++;
			}

			var element = document.createElement( 'div' );
			element.className = 'css3delement';
			element.style.backgroundColor = 'rgba(0,127,127,' + ( Math.random() * 0.5 + 0.25 ) + ')';

			var a = document.createElement('a');
			//a.href =src[0];
			//a.setAttribute('data-lightbox','roadtrip');
			a.setAttribute('title',a.href.substr(a.href.lastIndexOf('/')+1));

			var image=new Image();
			image.src='';
			image.alt="welcome";
			image.width=120;
			image.height=160;
			a.appendChild(image);
			element.appendChild( a );

			var object = new THREE.CSS3DObject( element );
			object.position.x = Math.random() * 4000 - 2000;
			object.position.y = Math.random() * 4000 - 2000;
			object.position.z = Math.random() * 4000 - 2000;
			_this.scene.add( object );
			_this.objects.push( object );
			_this.table.push(file);

			var object = new THREE.Object3D();
			object.position.x = (col * 160 ) - 1480;
			object.position.y = - (row* 220 ) + 990;
			_this.targets.table.push( object );

			var phi = Math.acos( -1 + ( 2 * i ) / _this.maxcount);
			var theta = Math.sqrt( _this.maxcount* Math.PI ) * phi;
			var object = new THREE.Object3D();
			object.position.x = 1200 * Math.cos( theta ) * Math.sin( phi );
			object.position.y = 1200 * Math.sin( theta ) * Math.sin( phi );
			object.position.z = 1200 * Math.cos( phi );
			vector.copy( object.position ).multiplyScalar( 2 );
			object.lookAt( vector );
			_this.targets.sphere.push( object );

			var phi = i * 0.175 + Math.PI;
			var object = new THREE.Object3D();
			object.position.x = 900 * Math.sin( phi );
			object.position.y = - ( i * 8 ) + 450;
			object.position.z = 900 * Math.cos( phi );
			vector.x = object.position.x * 2;
			vector.y = object.position.y;
			vector.z = object.position.z * 2;
			object.lookAt( vector );
			_this.targets.helix.push( object );

			var object = new THREE.Object3D();
			object.position.x = ( ( i % 5 ) * 400 ) - 800;
			object.position.y = ( - ( Math.floor( i / 5 ) % 5 ) * 400 ) + 800;
			object.position.z = ( Math.floor( i / 25 ) ) * 1000 - 2000;
			_this.targets.grid.push( object );

			//heart
			var phi = 2*i*Math.PI/ _this.maxcount;
			var object = new THREE.Object3D();
			object.position.x = 1200*(Math.sin(phi)-Math.sin(2*phi)/2);
			object.position.y = 1200*(Math.cos(phi)-Math.cos(2*phi)/2)+200;
			_this.targets.heart.push( object );

			//butterfly
			var phi = 2*i*Math.PI/ _this.maxcount;
			var object = new THREE.Object3D();
			var p = Math.exp(Math.sin(phi))-2*Math.cos(4*phi)+Math.pow(Math.sin((2*phi-Math.PI)/24),5);
			object.position.x = 400*p*Math.cos(phi);
			object.position.y = 400*p*Math.sin(phi);;
			_this.targets.butterfly.push( object );
		}
		_this.transform(_this.targets.table, 2000);
		//end of 3D

		// 做初始化
		_this.wall.register(Wall.Note.type.UPDATE_WALL_SIGNIN_USER,function(){
			_this.updateSignCount();
		});
		_this.wall.register(Wall.Note.type.UPDATE_GLOBAL,function(data){
			if (data.noteType == 'wallapplysignConfig') {
				_this.wallapplysignConfig = data;
			}
		});
		_this.wall.getWallGlobalItem('wallapplysignConfig',function(item){
			_this.wallapplysignConfig = item;
			fn(false);
		});
	};
	WallSignin.prototype.beforeActivity = function() {
		var _this = this;
		/*活动初始化*/
		$('#signin-wall-block').show();
		$('#signinUserCount,#signinUserCount::before').show();
		_this.autoPlayFlag = true;
		_this.firstInit(function(){
			/*活动初始化*/
			_this.updateSignCount();
			var autoPlayNextPage = function(){
				if(_this.autoPlayFlag){
					_this.nextPage(function(){
						_this.autoPlayControl = setTimeout(autoPlayNextPage,3000);
					});
				}
			};
			autoPlayNextPage();
			_this.threeAnimate();
		});
	};
	WallSignin.prototype.afterActivity = function() {
		$("#signin-wall-block").find("li>div").removeClass("rotate");// 移除动画
		$('#signin-wall-block').hide();
		// 左上角数量
		$('#signinUserCount,#signinUserCount::before').hide();
		var _this = this;
		_this.autoPlayFlag = false;
		clearTimeout(_this.autoPlayControl);
	};
	/*更新签到人数*/
	WallSignin.prototype.updateSignCount = function(){
		var _this = this;
		if(_this.wall.currentActivityType.startWith('ACTIVITY_SIGNIN')){
			_this.wall.storeCount(_this.wall.signUserDb,function(count){
				$('#signinUserCount span').html(count);
			});
		}
	};
	/* 下一页 */
	WallSignin.prototype.nextPage = function(fn) {
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
			$('.signIn_list li>div').addClass("in").removeClass("rotate");
			if(_this.animation(user,'next')){
				_this.onWallSignIn.push(user);
				fn && fn();
			}
		});
	};
	WallSignin.prototype.animation = function(signUser,fn) {
		var _this = this;
		var name = signUser.nickName;
		var id = signUser.wxUserId;
		if($('.signIn_list li[data-id="' + id + '"]').length){
			return true;
		}
		if(showFullName){
			name = signUser.noteName || signUser.name || signUser.nickName;
		}
		if(!name){
			return false;
		}
		var url = '/images/wall/unname.jpg';
		if(signUser.imgpath){
			url = signUser.imgpath.dealUrl();
		}

		var object = _this.objects[_this.objectindex];
		var imgobject = object.element.firstChild.firstChild;
		imgobject.src = url;
		_this.objectindex++;
		if(_this.objectindex>=_this.maxcount)
			_this.objectindex=0;

        //var html = '<li data-id="' + id + '"><div class="use-block rotate"><a href="javascript:;"><img src="'+ url +'"></a><p class="nickname">'+name+'</p></div></li>';
       	//$('.signIn_list').prepend(html);
       	return true;
	};

	WallSignin.prototype.render = function(){
		//subrenderer.renderAll();
		var _this = this;
		_this.renderer.render(_this.scene,_this.camera);
	}

	WallSignin.prototype.threeAnimate = function () {
		var _this = this;
		if(!_this.autoPlayFlag)
			return;
		TWEEN.update();
		//controls.update();
		//renderer.render(scene,camera);
		var timer = Date.now() * 0.0003;
		_this.camera.position.x = Math.cos( timer ) * 3000;
		_this.camera.position.z = Math.sin( timer ) * 3000;
		_this.camera.lookAt(_this.scene.position );
		window.requestAnimationFrame(function(){
			_this.threeAnimate();
		});

	}

	WallSignin.prototype.transform = function(targets,duration ) {

		var _this = this;
		TWEEN.removeAll();
		for ( var i = 0; i < _this.objects.length; i ++ ) {

			var object = _this.objects[ i ];
			var target = targets[ i ];

			new TWEEN.Tween( object.position )
				.to( { x: target.position.x, y: target.position.y, z: target.position.z }, Math.random() * duration + duration )
				.easing( TWEEN.Easing.Exponential.InOut )
				.start();

			new TWEEN.Tween( object.rotation )
				.to( { x: target.rotation.x, y: target.rotation.y, z: target.rotation.z }, Math.random() * duration + duration )
				.easing( TWEEN.Easing.Exponential.InOut )
				.start();

		}
		new TWEEN.Tween( this )
			.to( {}, duration * 2 )
			.onUpdate(_this.render)
			.onComplete(function () {

				switch (_this.transformindex) {
					case 0:
						_this.transform(_this.targets.sphere, 2000 );
						break;
					case 1:
						_this.transform(_this.targets.helix, 2000 );
						break;
					case 2:
						_this.transform(_this.targets.grid, 2000 );
						break;
					case 3:
						_this.transform(_this.targets.table, 2000 );
						break;
					case 4:
						_this.transform(_this.targets.heart, 2000 );
						break;
					case 5:
						_this.transform(_this.targets.butterfly, 2000 );
						break;
				}

				_this.transformindex += 1;

				if ( _this.transformindex> 5 ) _this.transformindex = 0;

			})
			.start();
	}

	/****************************签到墙 end***********************/
	jQuery.wall.wallSignin = function(wall){
		Wall.Activity.type.ACTIVITY_SIGNIN = 'ACTIVITY_SIGNIN';
		var wallSignin = new WallSignin(wall);
		wall.registerActivity(Wall.Activity.type.ACTIVITY_SIGNIN,wallSignin);
		return wallSignin;
	};
})(jQuery);
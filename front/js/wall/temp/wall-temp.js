/*实现了页面主题的css，js加载的动态配置*/
$(function(){
	var v = 0;
	if(typeof version != 'undefined'){
		v = version;
	}
	var tempName = wallJson.styleName ? wallJson.styleName : 'defaults';// 分类处理
	// 主题对应的css，js配置项
	// 默认配置
	var defaultSource = {
		'css':'/css/defaultwall.css',
		'js':{
//			'wall-core': '/js/wall/wall-core.js',
//			'wall-msg': '/js/wall/wall-msg.js',
//			'wall-pic': '/js/wall/wall-pic.js',
//			'wall-lottery': '/js/wall/wall-lottery.js',
//			'wall-signin': '/js/wall/wall-signin.js',
//			'wall-signin-logo': '/js/wall/wall-signin-logo.js',
//			'wall-vote': '/js/wall/wall-vote.js',
//			'wall-shake': '/js/wall/wall-shake.js',
//			'wall-guest': '/js/wall/wall-guest.js',
//			'wall': '/js/wall/wall.js',
		}
	};
	var loadCss = function(arr){
		if(!arr || arr.length === 0){
			return;
		}
		var url = arr.shift();
		url += '?v=' + v;
		$('<link>').attr({ 
			rel: 'stylesheet',
	        type: 'text/css',
	        href: url
	    }).appendTo("head");
	};
	var loadJs = function(arr){
		if(!arr || arr.length === 0){
			return;
		}
		var url = arr.shift();
		url += '?v=' + v;
		// 按照顺序依次加载js
		$.getScript(url,function(){
			loadJs(arr);
		});
	};

	// 需要加载的资源
	var js = $.extend(defaultSource['js'], tempGlobal[tempName]['js'] || {});
	var source = $.extend(defaultSource, tempGlobal[tempName] || {});
	source['js'] = js;// 二层继承处理
	// 1.先处理css
	var cssArr = [source['css']];
	loadCss(cssArr);
	// 2.处理js加载
	var jsSource = source['js'];
	var jsArr = [];
	for(var key in jsSource){
		jsArr.push(jsSource[key]);
	}
	loadJs(jsArr);
});
/* js工具方法使用 */
window.console = window.console || {};
console.log || (console.log = typeof opera != "undefined" ? opera.postError : function(msg) {});

if(typeof console.group == "undefined"){
	console.group = function(){};
}
if(typeof console.groupEnd == "undefined"){
	console.groupEnd = function(){};
}

// isDebug配置已移植到了taglibs.jsp中
// 如果需要debug 请在 taglibs.jsp 中将 window.debug 修改为true
var isDebug = false; 
var filterDebug = '';
var debugGroup;
var lastTime = 0;
function Debug(){
	
}
Debug.log = function(){
	if(!isDebug){
		return;
	}
	var obj = {};
	var nowTime = new Date().getTime();
	obj['time'] = nowTime;
	if(lastTime != 0){
		obj['totalTime'] = nowTime - lastTime;
	}
	lastTime = nowTime;
	if(arguments.length > 0){
		for(var i = 0 ; i < arguments.length; i++){
			var item = arguments[i];
			var str = i + '';
			obj[str] = item;
		}
	}
	if(arguments.length > 0){
		var item = arguments[0];
		// 过滤不需要进行debug的模块
		if(filterDebug.indexOf(item) != -1){
			return;
		}
		if(item != debugGroup){
			console.groupEnd();
			console.group(item);
			debugGroup = item;
		}
		console.log(obj);
	}
}
/*校验工具*/
function Check(){
	
}
/*为空判断*/
Check.empty = function(obj){
	if(null == obj || '' == $.trim(obj) || 'undefined' == (typeof obj)){
		return true;
	}else{
		return false;
	}
}
Check.notEmpty = function(obj){
	return !Check.empty(obj);
}
/*公共工具命名空间*/

/*验证邮箱*/
Check.email = function(email){
	if(Check.empty(email)){
		return null;
	} else if(!/^[a-zA-Z0-9_\.]+@[a-zA-Z0-9-]+[\.a-zA-Z]+$/.test(email)){
		return false;
	} else{
		return true;
	}
}
/*cookie 操作方法*/
function Cookie(){
	
}
Cookie.put = function(path, key, value, expiredays){
	var exdate = new Date();
	exdate.setDate(exdate.getDate() + expiredays);
	document.cookie = key + '=' + escape(value) + ';expires=' + exdate.toGMTString() + ';path=' + path;
	return this;
}
Cookie.get = function(key){
	if (document.cookie.length > 0) {
		c_start = document.cookie.indexOf(key + '=')
		if (c_start != -1) {
			c_start = c_start + key.length + 1;
			c_end = document.cookie.indexOf(';', c_start);
			if (c_end == -1){
				c_end = document.cookie.length;
			}
			return unescape(document.cookie.substring(c_start, c_end));
		}
	}
	return null;
}
Cookie.delete = function(name){
	var exp = new Date();
	exp.setTime(exp.getTime() - 1);
	var cval = Cookie.get(name);
	if(cval != null)
	document.cookie = name + "="+cval+";expires="+exp.toGMTString();
}
/*日期时间工具*/
Date.prototype.format = function(format){ 
	var o = { 
		"M+" : this.getMonth()+1,
		"d+" : this.getDate(),
		"h+" : this.getHours(),
		"m+" : this.getMinutes(),
		"s+" : this.getSeconds(),
		"q+" : Math.floor((this.getMonth()+3)/3),
		"S" : this.getMilliseconds()
	}
	if(/(y+)/.test(format)){
		format = format.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));
	}
	for(var k in o) {
		if(new RegExp("("+ k +")").test(format)) { 
			format = format.replace(RegExp.$1, RegExp.$1.length==1 ? o[k] : ("00"+ o[k]).substr((""+ o[k]).length)); 
		}
	}
	return format;
}
Date.prototype.after = function(date){
	return !this.before(date);
};
Date.prototype.before = function(date){
	var x = this.getTime() - date.getTime;
	if(x > 0){
		return false;
	} else {
		return true;
	}
};
String.prototype.getDate = function(){
	var time = Date.parse(this);
	if(isNaN(time)){
		time = Date.parse(this.replace(/-/g,'/'));
	}
	if(isNaN(time) && this.length > 23){
		time = Date.parse(this.substr(0,23));
	}
	return new Date(time);
};
String.prototype.formatDate = function(format){
	return this.getDate().format(format);
};
String.prototype.afterDate = function(date){
	return !this.beforeDate(date);
};
String.prototype.beforeDate = function(dateStr) {
	var x = this.getDate().getTime() - dateStr.getDate().getTime();
	if(x > 0){
		return false;
	} else {
		return true;
	}
};
String.prototype.utf16ToUtf8 = function(){
	var out, i, len, c;
	out = "";
	len = this.length;
	for (i = 0; i < len; i++) {
		c = this.charCodeAt(i);
		if ((c >= 0x0001) && (c <= 0x007F)) {
			out += this.charAt(i);
		} else if (c > 0x07FF) {
			out += String.fromCharCode(0xE0 | ((c >> 12) & 0x0F));
			out += String.fromCharCode(0x80 | ((c >> 6) & 0x3F));
			out += String.fromCharCode(0x80 | ((c >> 0) & 0x3F));
		} else {
			out += String.fromCharCode(0xC0 | ((c >> 6) & 0x1F));
			out += String.fromCharCode(0x80 | ((c >> 0) & 0x3F));
		}
	}
	return out;
};
String.prototype.utf8ToUtf16 = function(){
	var out, i, len, c;
    var char2, char3;
    out = "";
    len = this.length;
    i = 0;
    while(i < len) {
    	c = this.charCodeAt(i++);
    	switch(c >> 4){
	   case 0: case 1: case 2: case 3: case 4: case 5: case 6: case 7:
	     // 0xxxxxxx
	     out += this.charAt(i-1);
	     break;
	   case 12: case 13:
	     // 110x xxxx 10xx xxxx
	     char2 = this.charCodeAt(i++);
	     out += String.fromCharCode(((c & 0x1F) << 6) | (char2 & 0x3F));
	     break;
	   case 14:
	     // 1110 xxxx 10xx xxxx 10xx xxxx
	     char2 = this.charCodeAt(i++);
	     char3 = this.charCodeAt(i++);
	     out += String.fromCharCode(((c & 0x0F) << 12) |
	        ((char2 & 0x3F) << 6) |
	        ((char3 & 0x3F) << 0));
	     break;
	 }
    }
    return out;
};
/* 数组工具 */
Array.prototype.insert = function(index, item) {
	this.splice(index, 0, item);
};
Array.prototype.clear=function(){
	this.length = 0; 
};
Array.prototype.indexOf = function(val) {
    for (var i = 0; i < this.length; i++) {
        if (this[i] == val) return i;
    }
    return -1;
};
Array.prototype.remove = function(val) {
    var index = this.indexOf(val);
    if (index > -1) {
        this.splice(index, 1);
    }
};
//判断元素是否在数组中
Array.prototype.contains = function (obj) {
    for (var i = 0; i < this.length; i++) {
        if (obj == this[i]) {
            return true;
        }
    }
    return false;
};
/* 去除字符两边空格 */
String.prototype.startWith = function(str){
	if(str == null || str == "" || this.length == 0 || str.length > this.length)
		return false;
	if(this.substr(0,str.length) == str)
		return true;
	else
		return false;
	return true;
}
String.prototype.endWith = function(str){
	if(str == null || str == "" || this.length == 0 || str.length > this.length)
		return false;
	if(this.substring(this.length - str.length) == str)
		return true;
	else
		return false;
	return true;
}
String.prototype.dealUrl = function(baseDomain){
	var _this = this.toString();
	if(_this.startWith('http://') || _this.startWith('https://')){
		return _this;
	}else{
		if(!baseDomain){
			if(imgdomain){
				baseDomain = imgdomain;
			}else{
				baseDomain = 'http://img.wkey.cn/';
			}
		}
		if(!baseDomain.endWith('/') && !_this.startWith('/')){
			baseDomain = baseDomain + '/';
		}
		if(baseDomain.endWith('/') && _this.startWith('/')){
			baseDomain = baseDomain.substr(0,baseDomain.length - 1);
		}
		return baseDomain + _this;
	}
}
String.prototype.replaceAll = function(s1,s2){
    return this.replace(new RegExp(s1,"gm"),s2);
}
String.prototype.toJson = function(){
    return JSON.parse(this.replaceAll('"','\"'));
};
//将一个字符串用给定的字符变成数组
String.prototype.toArray = function(tag) {
    if (this.indexOf(tag) != -1) {
        return this.split(tag);
    }else {
        if (this != '') {
            return [this.toString()];
        }else {
            return [];
        }
    }
}
//只留下数字(0123456789)
String.prototype.toNumber= function() { 
    return this.replace(/\D/g, ""); 
}
//转成int
String.prototype.toInt= function() {  
    var temp = this.replace(/\D/g, "");
    return isNaN(parseInt(temp)) ? this.toString() : parseInt(temp);  
}

var StringBuffer = function() {
    this._strs = new Array; 
};
StringBuffer.prototype.append = function (str) { 
    this._strs.push(str); 
}; 
StringBuffer.prototype.toString = function() { 
    return this._strs.join(""); 
};
/* 判断当前对象是否为空 */
window.isEmpty = function(obj) {
	return (typeof obj == "undefined" || null == obj || '' == $.trim(obj));
};
/* 判断当前对象是否非空 */
window.isNotEmpty = function(obj) {
	return !isEmpty(obj);
};
/* 更新浏览器地址栏链接地址 */
window.updateUrl = function(url) {
	if (window.history && window.history.pushState) {
		window.history.pushState(null, url, url);
	}
};
/*uuid生成处理*/
//Private array of chars to use
var CHARS = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
Math.uuid = function (len, radix) {
  var chars = CHARS, uuid = [], i;
  radix = radix || chars.length;
  if (len) {
    // Compact form
    for (i = 0; i < len; i++) uuid[i] = chars[0 | Math.random()*radix];
  } else {
    // rfc4122, version 4 form
    var r;
    // rfc4122 requires these characters
    uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
    uuid[14] = '4';

    // Fill in random data.  At i==19 set the high bits of clock sequence as
    // per rfc4122, sec. 4.1.5
    for (i = 0; i < 36; i++) {
      if (!uuid[i]) {
        r = 0 | Math.random()*16;
        uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
      }
    }
  }
  return uuid.join('');
};
/*****************************************组件封装************************************/
/*-----------------公共方法 start----------------*/
function dealImgUrl(url,defaultUrl){
	if(null != url && '' != url){
		url = url.dealUrl();
	} else {
		if(!defaultUrl){
			defaultUrl = '';
		}
		url = defaultUrl;
	}
	return url;
}
/*-----------------公共方法 end----------------*/
/*---------------------------------------------------------------------*/
/*
 * MAP对象，实现MAP功能
 *
 * 接口：
 * size()     获取MAP元素个数
 * isEmpty()    判断MAP是否为空
 * clear()     删除MAP所有元素
 * put(key, value)   向MAP中增加元素（key, value) 
 * remove(key)    删除指定KEY的元素，成功返回True，失败返回False
 * get(key)    获取指定KEY的元素值VALUE，失败返回NULL
 * element(index)   获取指定索引的元素（使用element.key，element.value获取KEY和VALUE），失败返回NULL
 * containsKey(key)  判断MAP中是否含有指定KEY的元素
 * containsValue(value) 判断MAP中是否含有指定VALUE的元素
 * values()    获取MAP中所有VALUE的数组（ARRAY）
 * keys()     获取MAP中所有KEY的数组（ARRAY）
 *
 * 例子：
 * var map = new Map();
 *
 * map.put("key", "value");
 * var val = map.get("key")
 * 
 *
 */
function Map() {
    this.elements = new Array();
    //获取MAP元素个数
    this.size = function() {
        return this.elements.length;
    };
    //判断MAP是否为空
    this.isEmpty = function() {
        return (this.elements.length < 1);
    };
    //删除MAP所有元素
    this.clear = function() {
        this.elements = new Array();
    };
    //向MAP中增加元素（key, value) 
    this.put = function(_key, _value) {
    	this.remove(_key);
        this.elements.push( {
            key : _key,
            value : _value
        });
    };
    //删除指定KEY的元素，成功返回True，失败返回False
    this.remove = function(_key) {
        var bln = false;
        try {
            for (i = 0; i < this.elements.length; i++) {
                if (this.elements[i].key == _key) {
                    this.elements.splice(i, 1);
                    return true;
                }
            }
        } catch (e) {
            bln = false;
        }
        return bln;
    };
    //获取指定KEY的元素值VALUE，失败返回NULL
    this.get = function(_key) {
        try {
            for (i = 0; i < this.elements.length; i++) {
                if (this.elements[i].key == _key) {
                    return this.elements[i].value;
                }
            }
        } catch (e) {
            return null;
        }
    };
    //获取指定索引的元素（使用element.key，element.value获取KEY和VALUE），失败返回NULL
    this.element = function(_index) {
        if (_index < 0 || _index >= this.elements.length) {
            return null;
        }
        return this.elements[_index];
    };
    //判断MAP中是否含有指定KEY的元素
    this.containsKey = function(_key) {
        var bln = false;
        try {
            for (i = 0; i < this.elements.length; i++) {
                if (this.elements[i].key == _key) {
                    bln = true;
                }
            }
        } catch (e) {
            bln = false;
        }
        return bln;
    };
    //判断MAP中是否含有指定VALUE的元素
    this.containsValue = function(_value) {
        var bln = false;
        try {
            for (i = 0; i < this.elements.length; i++) {
                if (this.elements[i].value == _value) {
                    bln = true;
                }
            }
        } catch (e) {
            bln = false;
        }
        return bln;
    };
    //获取MAP中所有VALUE的数组（ARRAY）
    this.values = function() {
        var arr = new Array();
        for (i = 0; i < this.elements.length; i++) {
            arr.push(this.elements[i].value);
        }
        return arr;
    };
    //获取MAP中所有KEY的数组（ARRAY）
    this.keys = function() {
        var arr = new Array();
        for (i = 0; i < this.elements.length; i++) {
            arr.push(this.elements[i].key);
        }
        return arr;
    };
};

/**
 * js实现list
 * 
 */
function List() {
    this.value = [];
    /* 添加 */
    this.add = function(obj) {
        return this.value.push(obj);
    };
    /* 大小 */
    this.size = function() {
        return this.value.length;
    };
    /* 返回指定索引的值 */
    this.get = function(index) {
        return this.value[index];
    };
    /* 删除指定索引的值 */
    this.remove = function(index) {
        this.value.splice(index,1);
        return this.value;
    };
    /* 删除全部值 */
    this.removeAll = function() {
        return this.value = [];
    };
    /* 是否包含某个对象 */
    this.constains = function(obj) {
        for ( var i in this.value) {
            if (obj == this.value[i]) {
                return true;
            } else {
                continue;
            }
        }
        return false;
    };
    /* 是否包含某个对象 */
    this.getAll = function() {
        var allInfos = '';
        for ( var i in this.value) {
            if(i != (value.length-1)){
                allInfos += this.value[i]+",";
            }else{
                allInfos += this.value[i];
            }
        }
        return allInfos += this.value[i]+",";;
    };
};
/*--------------------------文件上传组件-------------------------*/
/*
 * zxxFile.js 基于HTML5 文件上传的核心脚本 http://www.zhangxinxu.com/wordpress/?p=1923
 */
var ZXXFILE = {
	fileInput: null,				//html file控件
	dragDrop: null,					//拖拽敏感区域
	upButton: null,					//提交按钮
	url: "",						//ajax地址
	fileFilter: [],					//过滤后的文件数组
	filter: function(files) {		//选择文件组的过滤方法
		return files;	
	},
	onSelect: function() {},		//文件选择后
	onDelete: function() {},		//文件删除后
	onDragOver: function() {},		//文件拖拽到敏感区域时
	onDragLeave: function() {},	//文件离开到敏感区域时
	onProgress: function() {},		//文件上传进度
	onSuccess: function() {},		//文件上传成功时
	onFailure: function() {},		//文件上传失败时,
	onComplete: function() {},		//文件全部上传完毕时
	/* 开发参数和内置方法分界线 */
	//文件拖放
	funDragHover: function(e) {
		e.stopPropagation();
		e.preventDefault();
		this[e.type === "dragover"? "onDragOver": "onDragLeave"].call(e.target);
		return this;
	},
	//获取选择文件，file控件或拖放
	funGetFiles: function(e) {
		// 取消鼠标经过样式
		this.funDragHover(e);
		// 获取文件列表对象
		var files = e.target.files || e.dataTransfer.files;
		//继续添加文件
		this.fileFilter = this.fileFilter.concat(this.filter(files));
		this.funDealFiles();
		return this;
	},
	//选中文件的处理与回调
	funDealFiles: function() {
		for (var i = 0, file; file = this.fileFilter[i]; i++) {
			//增加唯一索引值
			file.index = i;
		}
		//执行选择回调
		this.onSelect(this.fileFilter);
		return this;
	},
	//删除对应的文件
	funDeleteFile: function(fileDelete) {
		var arrFile = [];
		for (var i = 0, file; file = this.fileFilter[i]; i++) {
			if (file != fileDelete) {
				arrFile.push(file);
			} else {
				this.onDelete(fileDelete);	
			}
		}
		this.fileFilter = arrFile;
		return this;
	},
	//文件上传
	funUploadFile: function() {
		var self = this;	
		if (location.host.indexOf("sitepointstatic") >= 0) {
			//非站点服务器上运行
			return;	
		}
		for (var i = 0, file; file = this.fileFilter[i]; i++) {
			(function(file) {
				var xhr = new XMLHttpRequest();
				if (xhr.upload) {
					// 上传中
					xhr.upload.addEventListener("progress", function(e) {
						self.onProgress(file, e.loaded, e.total);
					}, false);
					// 文件上传成功或是失败
					xhr.onreadystatechange = function(e) {
						if (xhr.readyState == 4) {
							if (xhr.status == 200) {
								self.onSuccess(file, xhr.responseText);
								self.funDeleteFile(file);
								if (!self.fileFilter.length) {
									//全部完毕
									self.onComplete();	
								}
							} else {
								self.onFailure(file, xhr.responseText);		
							}
						}
					};
					// 开始上传
					xhr.open("POST", self.url, true);
					xhr.setRequestHeader("X_FILENAME", file.name);
					xhr.send(file);
				}	
			})(file);	
		}	
	},
	init: function() {
		var self = this;
		if (this.dragDrop) {
			this.dragDrop.addEventListener("dragover", function(e) { self.funDragHover(e); }, false);
			this.dragDrop.addEventListener("dragleave", function(e) { self.funDragHover(e); }, false);
			this.dragDrop.addEventListener("drop", function(e) { self.funGetFiles(e); }, false);
		}
		//文件选择控件选择
		if (this.fileInput) {
			this.fileInput.addEventListener("change", function(e) { self.funGetFiles(e); }, false);	
		}
		//上传按钮提交
		if (this.upButton) {
			this.upButton.addEventListener("click", function(e) { self.funUploadFile(e); }, false);	
		} 
	}
};

/*请求后台的对象工具*/
/**
 *  var d = new DataContent({
 *		pageIndex : 2,
 *		pageSize : 10
 *	});
 *	d.putUpdate('id', 10);
 *	d.putUpdate('name', 'hehe');
 *	d.pushSort('id','desc');
 *	d.pushInclude('id');
 *	d.pushExcept('name');
 *
 *	alert(d.toJson());
 *
 *	d.post({
 *		url : 'http://www.baidu.com',
 *		callBack: function(data){
 *			alert(data);
 *		}
 *	});
 */
function DataContent(setting){
	this.alias = {
		/** 请求体别名 **/
		pageIndex: 'pageIndex',
		pageSize: 'pageSize',
		where: 'where',
		update: 'update',
		sort: 'sort',
		include: 'include',
		except: 'except'
	};
	if($.type(setting) == 'array'){
		this.data = $.extend([], setting || []);
	}else{
		this.data = $.extend({
			}, setting || {});
	}
};
/** 辅助工具 **/
DataContent.prototype.toJson = function(){
	return JSON.stringify(this.data);
};
DataContent.prototype.getData = function(){
	return this.data;
};
DataContent.prototype.checkArr = function(){
	if($.type(this.data) != 'array'){
		throw new Error('this data is not array');
	}
};
DataContent.prototype.checkObj = function(){
	if($.type(this.data) != 'object'){
		throw new Error('this data is not object');
	}
};
/** 最外层参数处理 **/
DataContent.prototype.get = function(key){
	this.checkObj();
	return this.data[key];
};
DataContent.prototype.put = function(key,value){
	this.checkObj();
	this.data[key] = value;
};
DataContent.prototype.remove = function(key){
	this.checkObj();
	delete this.data[key];
};
DataContent.prototype.dealCheckbox = function(key){
	this.checkObj();
	var arr = this.get(key);
	if(arr && arr.length != 0){
		this.put(key,arr[0]);
	}
};
DataContent.prototype.dealInt = function(key) {
	this.checkObj();
	var value = parseInt(this.get(key));
	if (isNaN(value)) {
		return;
	}
	this.put(key, value);
};
DataContent.prototype.dealFloat = function(key){
	this.checkObj();
	var value = parseFloat(this.get(key));
	if (isNaN(value)) {
		return;
	}
	this.put(key, value);
};

/** wherePara处理 **/
DataContent.prototype.getWhere = function(key){
	this.checkObj();
	var where = this.alias.where;
	if(typeof this.data[where] == 'undefined')
		return null;
	return this.data[where][key];
};
DataContent.prototype.putWhere = function(key,value){
	this.checkObj();
	var where = this.alias.where;
	if(typeof this.data[where] == 'undefined')
		this.data[where] = {};
	this.data[where][key] = value;
};
DataContent.prototype.removeWhere = function(key){
	this.checkObj();
	var where = this.alias.where;
	if(typeof this.data[where] == 'undefined')
		return;
	delete this.data[where][key];
};

DataContent.prototype.dealWhereInt = function(key) {
	this.checkObj();
	var where = this.alias.where;
	if(typeof this.data[where] == 'undefined')
		return;
	var value = parseInt(this.data[where][key]);
	if (isNaN(value)) {
		return;
	}
	this.putWhere(key, value);
};
DataContent.prototype.dealWhereFloat = function(key){
	this.checkObj();
	var where = this.alias.where;
	if(typeof this.data[where] == 'undefined')
		return;
	var value = parseFloat(this.data[where][key]);
	if (isNaN(value)) {
		return;
	}
	this.putWhere(key, value);
};

DataContent.prototype.dealWhereCheckbox = function(key){
	this.checkObj();
	var arr = this.getWhere(key);
	if(arr && arr.length != 0){
		this.putWhere(key,arr[0]);
	}
};
/** updatePara **/
DataContent.prototype.getUpdate = function(key){
	this.checkObj();
	var update = this.alias.update;
	if(typeof this.data[update] == 'undefined')
		return null;
	return this.data[update][key];
};
DataContent.prototype.putUpdate = function(key,value){
	this.checkObj();
	var update = this.alias.update;
	if(typeof this.data[update] == 'undefined')
		this.data[update] = {};
	this.data[update][key] = value;
};
DataContent.prototype.removeUpdate = function(key){
	this.checkObj();
	var update = this.alias.update;
	if(typeof this.data[update] == 'undefined')
		return;
	delete this.data[update][key];
};
DataContent.prototype.dealUpdateCheckbox = function(key){
	this.checkObj();
	var arr = this.getUpdate(key);
	if(arr && arr.length != 0){
		this.putUpdate(key,arr[0]);
	}
};
DataContent.prototype.dealUpdateInt = function(key) {
	this.checkObj();
	var update = this.alias.update;
	if(typeof this.data[update] == 'undefined')
		return;
	var value = parseInt(this.data[update][key]);
	if (isNaN(value)) {
		return;
	}
	this.putUpdate(key, value);
};
DataContent.prototype.dealUpdateFloat = function(key){
	this.checkObj();
	var update = this.alias.update;
	if(typeof this.data[update] == 'undefined')
		return;
	var value = parseFloat(this.data[update][key]);
	if (isNaN(value)) {
		return;
	}
	this.putUpdate(key, value);
};

/** 排序规则 **/
DataContent.prototype.getSort = function(key){
	this.checkObj();
	var sort = this.alias.sort;
	if(typeof this.data[sort] == 'undefined')
		return null;
	return this.data[sort][key];
};
DataContent.prototype.pushSort = function(key,value){
	this.checkObj();
	var sort = this.alias.sort;
	if(typeof this.data[sort] == 'undefined')
		this.data[sort] = {};
	this.data[sort][key] = value;
};
DataContent.prototype.removeSort = function(key){
	this.checkObj();
	var sort = this.alias.sort;
	if(typeof this.data[sort] == 'undefined')
		return;
	delete this.data[sort][key];
	for(var key in this.data[sort]){
		return;
	}
	this.remove(sort);
};
/** 包含 **/
DataContent.prototype.getInclude = function(){
	this.checkObj();
	var include = this.alias.include;
	if(typeof this.data[include] == 'undefined')
		return null;
	return this.data[include];
};
DataContent.prototype.pushInclude = function(col){
	this.checkObj();
	var include = this.alias.include;
	if(typeof this.data[include] == 'undefined')
		this.data[include] = [];
	this.data[include].push(col);
};
DataContent.prototype.removeInclude = function(col){
	this.checkObj();
	var include = this.alias.include;
	if(typeof this.data[include] == 'undefined')
		return;
	this.data[include].remove(col);
	if(0 == this.data[include].length){
		this.remove(include);
	}
};
/** 排除 **/
DataContent.prototype.getExcept = function(){
	this.checkObj();
	var except = this.alias.except;
	if(typeof this.data[except] == 'undefined')
		return null;
	return this.data[except];
};
DataContent.prototype.pushExcept = function(col){
	this.checkObj();
	var except = this.alias.except;
	if(typeof this.data[except] == 'undefined')
		this.data[except] = [];
	this.data[except].push(col);
};
DataContent.prototype.removeExceptCol = function(col){
	this.checkObj();
	var except = this.alias.except;
	if(typeof this.data[except] == 'undefined')
		return;
	this.data[except].remove(col);
	if(0 == this.data[except].length){
		this.remove(except);
	}
};
DataContent.prototype.pushItem = function(data){
	this.checkArr();
	return this.data.push(data);
};
/******************* 请求工具封装 End **********************/
/********************* 发送请求 Start ************************/
DataContent.prototype.post = function(setting){
	var dataContent = this;
	var setting = $.extend({
				url : '',
				data: 'dataContent=' + encodeURIComponent(dataContent.toJson()),
				dataType: 'json',
				type: 'POST',
				cache: true,
				async: true,
				callBack: function(data){
					Debug.log('return data is : ' + data);
				},
				errorCallBack: function(e){
					Debug.log('The network is not available:' + e);
				},
				complete: function(xMLHttpRequest){
					Debug.log('请求结束');
				},
				load: true,
			}, setting || {});
	if( isEmpty(setting.url) ) {
		throw new Error('URL is not allow empty');
	}
	if(setting.load && typeof layer != 'undefined'){
		layer.load(0,{
			shade: [0.5,'#6C6C6C'],
			skin : 'layui-layer-myloading'
		});
	}
	var requestTime = new Date().getTime();
	var innerCallBack = function(data){
		if(setting.load && typeof layer != 'undefined'){
			var nowTime = new Date().getTime();
			var x = nowTime - requestTime - 1500;
			if(x < 0){
				x = 10;
			}
			setTimeout(function(){
				layer.closeAll('loading');
			},x);
		}
		try {
			if(data.systemContent.state == 'LoginTimeout'){
				window.location.href = '/user/login.html';
				return;
			}else if(data.systemContent.state == 'SuperLoginTimeout'){
				window.location.href = '/websuper/user/login.html';
				return;
			}
		} catch (e) {
		}
		setting.callBack(data);
	}
	var innerError = function(xhr, ts, et){
		if(xhr.status == 500 && xhr.responseJSON && 'SuperLoginTimeout' == xhr.responseJSON.code){
			window.top.location.href = '/websuper/user/login.html';
			return;
		}
		if(setting.load && typeof layer != 'undefined'){
			layer.closeAll('loading');
		}
		if(xhr.status == 500 && xhr.responseJSON){
			setting.callBack(xhr.responseJSON);
			return;
		}
		setting.errorCallBack(xhr, ts, et);
	}
	var innerComplete = function(xMLHttpRequest){
		if(setting.load && typeof layer != 'undefined'){
			layer.closeAll('loading');
		}
		setting.complete(xMLHttpRequest);
	}
	$.ajax({
		url: setting.url,
		cache: setting.cache,
		data: setting.data,
		async: setting.async,
		dataType: setting.dataType,
		type: setting.type,
		success: innerCallBack,
		error: innerError,
		complete: innerComplete,
	});
};

DataContent.prototype.getrequest = function(setting){
	var dataContent = this;
	var setting = $.extend({
		url : '',
		headers:{
			Authorization:usertoken,
		},
		dataType: 'json',
		type: 'GET',
		cache: true,
		async: true,
		callBack: function(data){
			Debug.log('return data is : ' + data);
		},
		errorCallBack: function(e){
			Debug.log('The network is not available:' + e);
		},
		complete: function(xMLHttpRequest){
			Debug.log('请求结束');
		},
		load: true,
	}, setting || {});
	if( isEmpty(setting.url) ) {
		throw new Error('URL is not allow empty');
	}
	if(setting.load && typeof layer != 'undefined'){
		layer.load(0,{
			shade: [0.5,'#6C6C6C'],
			skin : 'layui-layer-myloading'
		});
	}
	var requestTime = new Date().getTime();
	var innerCallBack = function(data){
		if(setting.load && typeof layer != 'undefined'){
			var nowTime = new Date().getTime();
			var x = nowTime - requestTime - 1500;
			if(x < 0){
				x = 10;
			}
			setTimeout(function(){
				layer.closeAll('loading');
			},x);
		}
		try {
			if(data.systemContent.state == 'LoginTimeout'){
				window.location.href = '/user/login.html';
				return;
			}else if(data.systemContent.state == 'SuperLoginTimeout'){
				window.location.href = '/websuper/user/login.html';
				return;
			}
		} catch (e) {
		}
		setting.callBack(data);
	}
	var innerError = function(xhr, ts, et){
		if(xhr.status == 500 && xhr.responseJSON && 'SuperLoginTimeout' == xhr.responseJSON.code){
			window.top.location.href = '/websuper/user/login.html';
			return;
		}
		if(setting.load && typeof layer != 'undefined'){
			layer.closeAll('loading');
		}
		if(xhr.status == 500 && xhr.responseJSON){
			setting.callBack(xhr.responseJSON);
			return;
		}
		setting.errorCallBack(xhr, ts, et);
	}
	var innerComplete = function(xMLHttpRequest){
		if(setting.load && typeof layer != 'undefined'){
			layer.closeAll('loading');
		}
		setting.complete(xMLHttpRequest);
	}
	$.ajax({
		url: setting.url,
		cache: setting.cache,
		async: setting.async,
		dataType: setting.dataType,
		type: setting.type,
		headers: setting.headers,

		async: false,

		success: innerCallBack,
		error: innerError,
		complete: innerComplete,
	});
};
/********************* 发送请求 End ************************/
/********************* Socket 封装 Start ************************/
/*
 *  var socket = new Socket({
 *  	uri : '/echo2/1234',
 *  	onMessage : function(event) {
 *  		Debug.log(event.data);
 *  		var obj = {'word':event.data};
 *  		insertData(obj,function(result, event){
 *  			Debug.log('success');
 *  		});
 *  	}
 *  });
 *  socket.connect();
 *  $('#send').click(function() {
 *  	var msg = generateMixed(5);
 *  	Debug.log('客户端发送:' + msg);
 *  	socket.send(msg);
 *  });
 */
function Socket(setting) {
	var defaultSetting = {
		baseUrl : wsdomain ,
		uri : '',
		onOpen : function() {
			Debug.log('Info: connection opened.');
		},
		onMessage : function(uri, payload) {
			Debug.log('Received: ' +  payload.msg);
		},
		onClose : function(error) {
			//Debug.log('Info: connection closed.');
			//Debug.log(error);
			console.log("Disconnected for " + error.reason + " with code " + error.code);
			//close();
		}
	}
	this.setting = $.extend(defaultSetting, setting);
	this.socket = null;
	this.session = null;
};
Socket.prototype.connect = function() {

	var _this = this;

	_this.socket = WS.connect(_this.setting.baseUrl);

	_this.socket.on("socket/connect", function(session){
		session.subscribe("andy/channel",_this.setting.onMessage);
		_this.session = session;
		//session.publish("andy/channel", {msg: "I'm leaving, I will not see the next message"});
		//session.publish("andy/channel",{'system':{'cmd':'heart'},'data':{'ip': 123456}});
		/*var requestData = {'system':{'cmd':'newMessage',flag:null,no:14703,secondCmd:null,sendOne:false,userFlag:null},
			'data':{
				auditState:"Pass",
				content:"what 等等等等等等",contentType:"text",
				createDate:"2016-06-06T23:14:35.000+0800",
				deleteTag:"N",
				floorId:0,
				hide:"N",
				id:33568158,
				imgpath:"http://wx.qlogo.cn/mmopen/ECrvBPJ0WxbY6T3hicYVicibNKMxAz7FmZnDEJJnUG0YVmkAB8TCmZiaTLhOuT30Rice0sib86xVVktSsptvWZaX2y6kAFUicicnEdqP/0",
				nickName:"陈实",
				sort:23755463,
				source:null,
				style:null,
				updateDate:"2016-06-06T23:14:35.516+0800",
				userId:0,
				wallId:0,
				wxUserId:3784311}
		};
		session.publish("andy/channel",requestData);*/
	});

	_this.socket.on("socket/disconnect",_this.setting.onClose);

	/*if ('WebSocket' in window) {
		_this.socket = new WebSocket(_this.setting.baseUrl
				+ _this.setting.uri);
	} else if ('MozWebSocket' in window) {
		_this.socket = new MozWebSocket(_this.setting.baseUrl
				+ this.setting.uri);
	} else {
		// 未实现
		//_this.socket = new SockJS(_this.setting.baseUrl + '/sockjs' + this.setting.uri);
	}
	_this.socket.onopen = this.setting.onOpen;
	_this.socket.onmessage = this.setting.onMessage;
	_this.socket.onclose = this.setting.onClose;*/
};
Socket.prototype.close = function() {
	if (this.socket != null&&this.session!=null) {
		//this.socket.close();
		this.session.unsubscribe("andy/channel");
		this.socket = null;
		this.session=null;
	}
};
Socket.prototype.isOpen = function() {
	if (this.socket != null) {
		return true;
	} else {
		return false;
	}
};
Socket.prototype.send = function(data) {
	if (this.socket != null&&this.session!=null) {
		this.session.publish("andy/channel",data);
	}
};
/********************* Socket 封装 End ************************/
/********************* 图片工具 Start ************************/
/********************* 处理图片超出区域的问题 ************************/
var ImgUtils = {
	flag: false,
	delayTime: 10,
	allImgMap: new Map(),
	waitImgMap: new Map(),
};
ImgUtils.pushImgMap = function(path){
	if(!ImgUtils.allImgMap.get(path)){
		ImgUtils.allImgMap.put(path,null);
		ImgUtils.waitImgMap.put(path,null);
		if(!ImgUtils.flag){
			ImgUtils.load();
		}
	}
};
ImgUtils.load = function(){
	ImgUtils.flag = true;
	if(ImgUtils.waitImgMap.size() > 0){
		setTimeout(function(){
			var obj = ImgUtils.waitImgMap.element(0);
			var img = new Image();
			img.onload = function(){
				ImgUtils.waitImgMap.remove(obj.key);
				ImgUtils.load();
				ImgUtils.delayTime = 0;
			};
			img.onerror = function(e){
				ImgUtils.waitImgMap.remove(obj.key);
				ImgUtils.load();
				ImgUtils.delayTime = 0;
		    };
		    img.src = obj.key;
		},ImgUtils.delayTime);
	}else{
		ImgUtils.flag = false;
	}
};
ImgUtils.loadImg = function(url,fn){
	if(null == url || '' == $.trim(url)){
		fn && fn(img);
		return;
	}
	if(fn){
		var img = new Image();
		try{
			url = url.dealUrl();
			img.onload = function(){
				img.onload = null;
				fn && fn(img);
			};
			img.onerror = function(e){
				Debug.log('图片预加载失败');
				fn && fn(img,e);
		    };
		    img.src = url;
		}catch(e){
			Debug.log('图片预加载失败',e);
			fn && fn(img,e);
		}
	}else{
		ImgUtils.pushImgMap(url.dealUrl());
	}
};
ImgUtils.dealImgRotate = function(setting){
	setting = $.extend({
    	imgObj: null,
        maxWidth : 600,
        maxHeight : 600,
        callBack: function(width,height){

        }
    }, setting || {});
	setting.imgObj = $(setting.imgObj);

	var rotate = setting.imgObj.css('rotate');
	if(rotate%180 != 0){
		// 宽高对调
		var temp = setting.maxWidth;
		setting.maxWidth = setting.maxHeight;
		setting.maxHeight = temp;
	}
 	var img = new Image();
    img.src = setting.imgObj.attr('src');
    img.onload = function(){
		var width = img.width;
        var height = img.height;

        var newWidth = width;
        var newHeight = height;
        // 检测宽高是否超出对应的设置
        if(width <= setting.maxwidth && height <= setting.maxheight){
        	// 正常的宽高
        }
        // 通过最小宽度计算出对应的高，设置宽度
        var maxWidth1 = setting.maxWidth;
        var maxHeight1 = maxWidth1 * height / width;
        if(maxHeight1 <= setting.maxHeight){
        	// 方案可行
			newWidth = maxWidth1;
			newHeight = maxHeight1;
        }
        // 通过最小高计算出对应的宽，设置高度
        var maxHeight2 = setting.maxHeight;
        var maxWidth2 = maxHeight2 * width / height;
        if(maxWidth2 <= setting.maxWidth){
        	// 方案可行
			newWidth = maxWidth2;
			newHeight = maxHeight2;
        }
        setting.imgObj.css({
        	width: newWidth,
        	height: newHeight
        });
        setting.callBack(newWidth,newHeight);
    };
    img.onerror = function(){
    	setting.callBack();
    };
};
/********************* 图片工具 End ************************/
/********************* 图片弹出 Start ************************/
/*大图展示*/
var ImgView = {};
ImgView.show = function(setting){
	if($('div').hasClass('viewModel')){
		$('.viewshadow').click();
    	$('.viewModel').click();
    }
    setting = $.extend({
    	imgObj:null,
    	url: null,
    	rotate: 0,
        maxWidth : 600,
        maxHeight : 600,
        autoCloseMillisecond : -1,
        already : function(){

        },
        close : function(){

        },
        operateContral: false,
        turnLeft: function(){
        	
        },
        turnRight: function(){
        	
        },
        operateContralHeight: 30,
        callBack: function(){

        }
    }, setting || {});
    var url = '';
    if(null == setting.url){
    	url = setting.imgObj.attr('src');
    }else{
    	url = setting.url;
    }
    
    
    if(!url || url.indexOf('placeholder.png') != -1){
        return;
    }
    var html = '';
    html += '<div class="viewshadow"></div>';
    html += '<div class="viewModel">';
    html += '<div class="load-div">';
    html += '<img src="/images/wall/loading.gif">';
    html += '</div>';
    html += '<img class="show-view-model" src="" style="">';
    if(setting.operateContral){
    	html += '<div class="viewModelimg"><a href="javascript:;" class="turnleft">左转</a><a href="javascript:;" class="turnright">右转</a></div>';
    }
    html += '</div>';
    if($('#danmu-wall').length > 0){
    	$('#danmu-wall').before(html);
    }else{
    	$('body').append(html);
    }
    
    var imgs = new Image();
    imgs.src = url;
    imgs.onload = function(){
        var maxWidth = setting.maxWidth;
        var maxHeight = setting.maxHeight;
        var width = imgs.width;
        var height = imgs.height;
        
        var style = '';
        if(width > height){
            var x = height / width;
            width = width > maxWidth ? maxWidth : width;
            height = width * x;
            style = 'width:' + width + 'px;';
        }else if(width == height){
            width = width > maxWidth ? maxWidth : width;
            height = width;
            style = 'width:' + width + 'px;';
        }else{
            var x = width / height;
            height = height > maxHeight ? maxHeight : height;
            width = height * x;
            style = 'height:' + height + 'px;';
        }
        if(null != setting.imgObj){
        	var rotate = setting.imgObj.css('rotate');
        	if('' != rotate){
        		style += 'transform:rotate(' + rotate+ 'deg)';
        	}
        }

        $('.show-view-model').attr({
        	src: url,
        	style: style
        });
        $('.load-div').hide();
        $('.show-view-model').css('rotate',setting.rotate);
        
        var newWidth = $('.show-view-model').outerWidth();
        var newHeight = $('.show-view-model').outerHeight();
        $('.show-view-model').css('margin-top',-newHeight/2);
        $('.show-view-model').css("margin-left",-newWidth/2);
        if(setting.operateContral){// 控制面板设置
            var getshowViewModelRotate = function(change){
                var x = $('.show-view-model').css('rotate');
                x = parseInt(x);
                if(isNaN(x)){
                    x = 0;
                }
                if(!change){
                    change = 0;
                }
                return x + change;
            }
            var resizeShowViewModel = function(){
                var resizeNewWidth = $('.show-view-model').outerWidth();
                var resizeNewHeight = $('.show-view-model').outerHeight();
                var x = getshowViewModelRotate();
//                if(x%180 != 0){
//                    var temp = resizeNewWidth;
//                    resizeNewWidth = resizeNewHeight;
//                    resizeNewHeight = temp;
//                }
                $('.show-view-model').css({
                    'margin-top':-resizeNewHeight/2,
                    'margin-left':-resizeNewWidth/2,
                    width:resizeNewWidth,
                    height:resizeNewHeight
                });
            }
        	$('.turnleft').click(function(){
        		// -90
				$('.show-view-model').css('rotate',getshowViewModelRotate(-90));
                resizeShowViewModel();
        		setting.turnLeft();
        	});
        	$('.turnright').click(function(){
        		// +90
				$('.show-view-model').css('rotate',getshowViewModelRotate(90));
                resizeShowViewModel();
        		setting.turnRight();
        	});
        }
        $('.viewshadow').bind('click',function(){
            $(this).fadeOut(300,function(){
                $(this).remove();
            });
            $('.viewModel').fadeOut(300,function(){
                $('.viewModel').remove();
            });
            setTimeout(function(){
            	setting.close();
            },400);
        });
    	$('.show-view-model').fadeIn(600,function(){
    		if(-1 != setting.autoCloseMillisecond){
    			setTimeout(function(){
    				$('.viewshadow').click();
    			},setting.autoCloseMillisecond);
    		}
    	});
        setting.callBack();
    };
    imgs.onerror = function(){
        $('.viewshadow').fadeOut(300,function(){
        	 $('.viewshadow').fadeOut(300,function(){
                 $(this).remove();
             });
             $('.viewModel').fadeOut(300,function(){
                 $('.viewModel').remove();
             });
             setTimeout(function(){
             	setting.close();
             },300);
        });
    };
}
/********************* 图片弹出 End ************************/
/********************* 分页插件 Start ************************/
;(function($){
	var Pagination = function(panel,setting){
		setting = $.extend({
				totalRow: 0,
				itemsPageRow:15,/*每页显示的条目数*/
				numDisplayEntries:4,/*连续分页主体部分显示的分页条目数*/
				currentPage:0,/*当前选中的页面*/
				numEdgeEntries:3,/*两侧显示的首尾分页的条目数*/
				linkTo:"javascript:;",/*分页的链接*/
				firstText: "首页",/*首页的文字*/
				prevText:"上一页",/*“前一页”分页按钮上显示的文字*/
				nextText:"下一页",/*“下一页”分页按钮上显示的文字*/
				lastText: "尾页",/*尾页的文字*/
				ellipseText:"...",/*省略的页数用什么文字表示*/
				firstShowAlways: true,/*首页显示按钮*/
				prevShowAlways:true,/*是否显示“前一页”分页按钮*/
				nextShowAlways:true,/*是否显示“下一页”分页按钮*/
				lastShowAlways: true,/*最后一页显示按钮*/
				showTotalInfo:false,/*是否显示文字描述*/
				showTotalNum:10,/*文字描述上面显示的总条数*/
				showPagerNum:10,/*文字描述上面显示的页数*/
				callBack:function(pageId){
					return false;
				}
			},setting||{});
		this.setting = setting;
		this.currentPage = setting.currentPage;
		this.panel = $(panel);
	}
	Pagination.prototype.numPages = function(){
		var s = this.setting;
		return Math.ceil(s.totalRow/s.itemsPageRow);
	}
	Pagination.prototype.getInterval = function(){
		var s = this.setting;
		var cp = this.currentPage;
		var neHalf = Math.ceil(s.numDisplayEntries/2);
		var np = this.numPages();
		var upperLimit = np - s.numDisplayEntries;
		var start = cp>neHalf?Math.max(Math.min(cp-neHalf, upperLimit), 0):0;
		var end = cp>neHalf?Math.min(cp+neHalf, np):Math.min(s.numDisplayEntries, np);
		return [start,end];
	}
	Pagination.prototype.pageSelected = function(pageId, evt){
		this.currentPage = pageId;
		this.render();
		var cbFlag = this.setting.callBack(pageId + 1);
		if (!cbFlag) {
			if (evt.stopPropagation) {
				evt.stopPropagation();
			}
			else {
				evt.cancelBubble = true;
			}
		}
		return cbFlag;
	}
	Pagination.prototype.render = function() {
		var _this = this;
		var s = _this.setting;
		_this.panel.empty();
		var interval = _this.getInterval();
		var np = _this.numPages();
		/*新添加条数信息显示*/
		if(s.showTotalInfo){
			var infos = $('<span class="paginfo">每页显示<em>'+s.showPagerNum+'</em>条</span><span class="paginfo">总共有<em>'+s.showTotalNum+'</em>条</span>');
			_this.panel.append(infos);
		}
		// 这个辅助函数返回一个处理函数调用有着正确pageId的pageSelected。
		var getClickHandler = function(pageId) {
			return function(evt){
				return _this.pageSelected(pageId,evt);
			}
		}
		//辅助函数用来产生一个单链接(如果不是当前页则产生span标签)
		var appendItem = function(pageId, appendopts){
			pageId = pageId<0?0:(pageId<np?pageId:np-1); // 规范page id值
			appendopts = $.extend({text:pageId+1, classes:""}, appendopts||{});
			if(pageId == _this.currentPage){
				var lnk = $("<span class='current'>"+(appendopts.text)+"</span>");
			}else{
				var lnk = $("<a>"+(appendopts.text)+"</a>")
					.bind("click", getClickHandler(pageId))
					.attr('href', s.linkTo.replace(/__id__/,pageId));
			}
			if(appendopts.classes){
				lnk.addClass(appendopts.classes);
			}
			_this.panel.append(lnk);
		}
		// update firstPage
        if (s.firstShowAlways && s.firstText && (_this.currentPage > 0 || s.prevShowAlways)) {      
            appendItem(0, { text: s.firstText, classes: "prev first" });           
        } 
		// 产生"Previous"-链接
		if(s.prevText && (_this.currentPage > 0 || s.prevShowAlways)){
			appendItem(_this.currentPage-1,{text:s.prevText, classes:"prev"});
		}
		// 产生起始点
		if (interval[0] > 0 && s.numEdgeEntries > 0){
			var end = Math.min(s.numEdgeEntries, interval[0]);
			for(var i=0; i<end; i++) {
				appendItem(i);
			}
			if(s.numEdgeEntries < interval[0] && s.ellipseText)
			{
				$("<span>"+s.ellipseText+"</span>").appendTo(_this.panel);
			}
		}
		// 产生内部的些链接
		for(var i=interval[0]; i<interval[1]; i++) {
			appendItem(i);
		}
		// 产生结束点
		if (interval[1] < np && s.numEdgeEntries > 0){
			if(np-s.numEdgeEntries > interval[1]&& s.ellipseText){
				$("<span>"+s.ellipseText+"</span>").appendTo(_this.panel);
			}
			var begin = Math.max(np-s.numEdgeEntries, interval[1]);
			for(var i=begin; i<np; i++) {
				appendItem(i);
			}
		}
		// 产生 "Next"-链接
		if(s.nextText && (_this.currentPage < np-1 || s.nextShowAlways)){
			appendItem(_this.currentPage+1,{text:s.nextText, classes:"next"});
		}
		// update lastPage
        if (s.lastShowAlways && s.lastText && (_this.currentPage < np - 1 || s.nextShowAlways)) {            
             appendItem(np, { text: s.lastText, classes: "prev last" });          
        }
		var jumppage = $("<div class='jumppage'><input type='text'><a href='javascript:;' class='jumpbtn'>跳转</a></div>");
		_this.panel.append(jumppage);
		jumppage.find("input").bind("blur",function(){
			var regExg = /^[0-9]*[1-9][0-9]*$/;
			var putval = $(this).val();
			if(putval.length>0){
				if(!regExg.test(putval)){
					$(this).val("1");
				}else{
					if(putval > _this.numPages()){
						$(this).val(_this.numPages());
					}
				}
			}
		});
		jumppage.find("a").bind("click",function(ev){
			if($(this).siblings("input").val().length>0){
				_this.currentPage = $(this).siblings("input").val()-1;
				return _this.pageSelected(_this.currentPage,ev);
			}else{
				return false;
			}	
		});
	}
	Pagination.prototype.init = function(){
		this.render();
	}
	Pagination.prototype.reRender = function(setting){
		this.setting = $.extend(this.setting,setting||{});
		this.render();
	}
	Pagination.prototype.getCurrentPage = function(setting){
		return this.currentPage;
	}
	Pagination.prototype.show = function(){// 控制分页条显示
		this.panel.show();
		return this;
	}
	Pagination.prototype.hide = function(){// 控制分页条隐藏
		this.panel.hide();
		return this;
	}
	$.fn.pagination = function(setting){
		var p = new Pagination(this,$.extend({
			prevText: '<i class="fa fa-caret-left"></i>',
			nextText: '<i class="fa fa-caret-right"></i>',
			firstShowAlways: false,
			lastShowAlways: false
		},setting || {}));
		return p;
	}
	$.fn.pagination.init = function(){
		this.init();
	}
})($);
/********************* 分页插件 End ************************/
/******************************* Page Start **********************************/
;(function($){
	function Page(pagination,dataListDom,setting){
		var _this = this;
		_this.pagination = pagination;
		_this.dataListDom = dataListDom;
		_this.currentPageVO = null;
		_this.setting = $.extend({
			pageCall: function(pageVo){},
			eachItem: null,/*翻页时的回调*/
			url: '',/*分页使用的服务地址*/
			dataContent: null,/*分页中使用的请求对象DataContent*/
			htmlDealStart: null,/*每页开始前的回调*/
			tableHeadHtml: null,/*分页中表头的html代码*/
			tableHeadHtmlJquery: dataListDom.find('thead'),/*分页中的表头jquery对象*/
			dataHtmlJquery: dataListDom.find('tbody'),/*分页最终的数据显示的对应html的jquery对象，默认使用#dataList tbody节点为数据节点*/
			htmlDealEnd: null,/*每页结束后的回调*/
			emptyPagControl: 'hide',/*控制没有数据的时候分页条码的显示隐藏*/
		}, setting || {});
		if(null != _this.setting.tableHeadHtml){
			_this.setting.tableHeadHtmlJquery.empty();
			_this.setting.tableHeadHtmlJquery.append(_this.setting.tableHeadHtml);
		}
		if(null == _this.setting.dataContent){
			_this.setting.dataContent = new DataContent();
		}
	}
	Page.prototype.callBack = function(pageId,fn){
		if(typeof layer != 'undefined'){
			layer.load(0,{
				shade: [0.5,'#6C6C6C'],
				skin : 'layui-layer-myloading'
			});
		}
		var _this = this;
		var d = _this.setting.dataContent;
		d.put(d.alias.pageIndex,pageId);
		d.put(d.alias.pageSize,_this.pagination.setting.itemsPageRow);
		d.post({
			load: false,
			url: _this.setting.url,
			callBack: function(data){
				if('Right' == data.systemContent.state){
					_this.render(data.dataContent);
					try{
						if(_this.setting.emptyPagControl == 'hide' && data.dataContent.totalRows == 0){
							_this.pagination.hide();
						}else{
							_this.pagination.show();
						}
					}catch(e){
						_this.pagination.show();
					}
				} else {
					Debug.log('Form callBack',data.systemContent.msg);
				}
				if(typeof layer != 'undefined'){
					layer.closeAll('loading');
				}
				if(fn){
					fn();
				}
			},
			errorCallBack: function(e){
				if(typeof layer != 'undefined'){
					layer.msg('网络错误',{time:2000});
					layer.closeAll('loading');
				}
			}
		});
	}
	Page.prototype.render = function(pageVo){
		var _this = this;
		_this.currentPageVO = pageVo;
		// 分页信息进行重新设置
		if(_this.pagination.setting.totalRow != pageVo.totalRows){
			// 分页重绘
			_this.pagination.reRender({
				totalRow: pageVo.totalRows
			});
		}
		if(_this.setting.htmlDealStart){
			_this.setting.htmlDealStart(pageVo);
		}
		var dataList = pageVo.dataList || [];
		if(_this.setting.eachItem != null){
			var html = '';
			for(var x = 0 ;x < dataList.length;x++){
				var item = dataList[x];
				var itemHtml = _this.setting.eachItem(item);
				html += itemHtml;
			}
			_this.setting.dataHtmlJquery.empty();
			_this.setting.dataHtmlJquery.append(html);
		} else if (_this.setting.pageCall != null){
			var html = _this.setting.pageCall(pageVo);
			_this.setting.dataHtmlJquery.empty();
			_this.setting.dataHtmlJquery.append(html);
		} else {
			Debug.log('Form data',data);
		}
		_this.setting.dataHtmlJquery.children().each(function(i){
			$(this).attr('data-id',dataList[i].id);
			$(this).data('data',dataList[i]);
		});
		if(_this.setting.htmlDealEnd){// 回调
			_this.setting.htmlDealEnd(pageVo);
		}
	}
	Page.prototype.init = function(fn){
		var _this = this;
		var _this = this;
		_this.pagination.setting.callBack = function(pageId){// 把原有分页的回调设置为page中的回调
			_this.callBack(pageId);
		}

		// 初始化第一页
		var d = _this.setting.dataContent;
		d.put(d.alias.pageIndex,1);
		_this.callBack(1,fn);

		_this.pagination.init();// 初始化分页
	}
	Page.prototype.reload = function(fn){
		this.callBack(this.pagination.currentPage + 1,fn);
	}
	$.fn.page = function(pagination,setting){
		var p = new Page(pagination,$(this),setting);
		return p;
	}
})($);
/******************************* Page End **********************************/
/*Form的处理 Start*/
/*
 *  var form = new Form({
 *  	url : '/skjdfwe/update.html',
 *  	postBefore : function()
 *  	},
 *  	check : function()
 *  		return true;
 *  	},
 *  	postEnd : function()
 *  	},
 *  	error : function()
 *  	}
 *  });
 *  Debug.log(form.form());
 */
/*用于表单的提交（新增、修改）*/
Form.type = {
	add : 'add',
	edit : 'edit'
};
function Form(setting){
	var _this = this;
	_this.dataContent = null;/*http表单请求*/
	_this.setting = $.extend({
		formJquery : $('form').first(),/*需要处理的form表单对象，默认选择body中第一个form*/
		url : '',/*请求的服务地址*/
		type : null,/*请求类型,根据url进行默认判断，如果包含add.html则为add，如果包含update.html则为edit，否则按新增处理(add、edit)*/
		whereParamerName: ['id'],
		postBefore : function(dataContent){
			/*表单请求之前有可能需要对自动整理的DataContent进行重新整理*/
		},
		check : function(dataContent){
			/*该参数必填，对表单的验证*/
			return true;
		},
		postEnd : function(data){
			/*请求结束，返回处理结果*/
		},
		error : function(){
			/*错误处理*/
		}
	}, setting || {});
}
Form.prototype.getType = function(){
	if(null != this.setting.type){
		return this.setting.type;
	}
	if(this.setting.url.indexOf('add.html') != -1){
		return Form.type.add;
	} else if(this.setting.url.indexOf('update.html') != -1){
		return Form.type.edit;
	} else{
		return Form.type.add;
	}
}
Form.prototype.put = function(name,value,dataType){
	if(null == this.dataContent){
		this.dataContent = new DataContent();
	}
	var type = this.getType();
	if(type == Form.type.edit){
		if('Array' == dataType){
			var arr = this.dataContent.getUpdate(name);
			if(null == arr){
				this.dataContent.putUpdate(name,[value]);
			} else {
				arr.push(value);
				this.dataContent.putUpdate(name,arr);
			}
		} else {
			if(this.setting.whereParamerName && this.setting.whereParamerName.indexOf(name) != -1){
				this.dataContent.putWhere(name,value);
			} else {
				this.dataContent.putUpdate(name,value);
			}
		}
	} else {
		if('Array' == dataType){
			var arr = this.dataContent.get(name);
			if(null == arr){
				this.dataContent.put(name,[value]);
			} else {
				arr.push(value);
				this.dataContent.put(name,arr);
			}
		} else {
			this.dataContent.put(name,value);
		}
	}
}
Form.prototype.toDataContent = function(){
	var _this = this;
	// <input type="text" />
	// <input type="password" />
	_this.setting.formJquery.find('input[type="text"],input[type="password"],input[type="hidden"],input[type="number"]').each(function(i){
		if($(this).attr('name')){
			_this.put($(this).attr('name'),$.trim($(this).val()));
		}
	});
	// <input type="checkbox" name="" /> 为数组
	var jqueryCheckboxObj = _this.setting.formJquery.find('input[type="checkbox"]');
	$(_this.getNames(jqueryCheckboxObj)).each(function(){
		var name = this.toString();
		_this.setting.formJquery.find('input[name="' + name + '"]:checked').each(function(){
        	_this.put(name,$(this).val(),'Array');
        });
	});
	// <input type="radio" name="" /> 
	var jqueryRadioObj = _this.setting.formJquery.find('input[type="radio"]');
	$(_this.getNames(jqueryRadioObj)).each(function(){
		var name = this.toString();
		_this.setting.formJquery.find('input[name="' + name + '"]:checked').each(function(){
        	_this.put(name,$(this).val());
        });
	});
	// <select></select>
	var jquerySelectObj = _this.setting.formJquery.find('select');
	$(_this.getNames(jquerySelectObj)).each(function(){
		var name = this.toString();
		_this.setting.formJquery.find('select[name="' + name + '"]').each(function(){
        	_this.put(name,$(this).val());
        });
	});
	// <textarea></textarea>
	var jqueryTextareaObj = _this.setting.formJquery.find('textarea');
	$(_this.getNames(jqueryTextareaObj)).each(function(){
		var name = this.toString();
		_this.setting.formJquery.find('textarea[name="' + name + '"]').each(function(){
        	_this.put(name,$(this).val());
        });
	});
	return _this.dataContent;
}
Form.prototype.getNames = function(jqueryObj){
	var obj = {};
	jqueryObj.each(function(){
		obj[$(this).attr('name')] = '';
	});
	var arr = [];
	for(var key in obj){
		arr.push(key);
	}
	return arr;
}
Form.prototype.post = function(){
	var _this = this;
	_this.toDataContent();
	if(!_this.setting.check(_this.dataContent)){/*自定义校验*/
		return;
	}
	_this.setting.postBefore(_this.dataContent);
	_this.dataContent.post({
		url : _this.setting.url,
		callBack : function(data){
			_this.setting.postEnd(data);
		},
		errorCallBack : function(){
			_this.setting.error();
		}
	});
}
/*-----------------------------Form的处理 End -----------------------*/
/*----------------------- 锚点设置组件 Start -----------------------*/
function Anchor(){
	this.anchor = {};
}
Anchor.prototype.getHashStr = function(){
	return window.location.hash;
}
Anchor.prototype.setHashStr = function(hash){
	window.location.hash = hash;
}
Anchor.prototype.clear = function(key,value){
	this.anchor = {};
	return this;
}
Anchor.prototype.put = function(key,value){
	if(this.anchor[key]){
		delete this.anchor[key];
	}
	this.anchor[key] = value;
	return this;
}
Anchor.prototype.remove = function(key){
	delete this.anchor[key];
	return this;
}
Anchor.prototype.parse = function(){
	this.clear();
	var str = this.getHashStr();
	if('' == str){
		return this;
	}
	if(str.startWith('#')){
		str = str.substr(1,str.length);
	}
	var firstArr = str.split('&');
	for(var i = 0;i < firstArr.length;i++){
		var itemArr = firstArr[i].split('=');
		var key = itemArr[0] || '';
		var value = itemArr[1] || '';
		this.put(key,value);
	}
	return this;
}
Anchor.prototype.setHash = function(){
	var str = '';
	for(var key in this.anchor){
		str += key + '=' + this.anchor[key] + '&';
	}
	str = str.substr(0,str.length - 1);
	this.setHashStr(str);
}
Anchor.prototype.get = function(key){
	this.parse();
	var value = this.anchor[key];
	return value || '';
}
/*----------------------------- 锚点设置组件 End -----------------------*/
/*----------------------------- 文件上传 Start(支持ie10+) -----------------------*/
;(function($){
	// 文件上传插件
	var createXHR = function() {
		if (window.ActiveXObject) {
			xmlHttp = new ActiveXObject("Microsoft.XMLHTTP");
		} else if (window.XMLHttpRequest) {
			xmlHttp = new XMLHttpRequest();
		}
		return xmlHttp;
	};
	// 文件上传对象
	function Upload(_this,setting){
		this.inputObj = _this;
		this.xhr = createXHR();
		this.setting = $.extend({
			error: function(){},
			progress: function(percentComplete){},
			uploadCanceled: function(){},
		}, setting || {});
		this.responseText = '';
	}
	Upload.prototype = {
		error: function(fn){
			this.setting.error = fn;
			return this;
		},
		abort: function(){
			if(this.xhr){
				this.xhr.abort();
			}
			return this;
		},
		uploadCanceled: function(fn){
			this.setting.uploadCanceled = fn;
			return this;
		},
		progress: function(fn){
			this.setting.progress = fn;
			return this;
		},
		done: function(fn){
			try{
				var _this = this;
				// 拼接数据开始传递
				var xhr = this.xhr;
				// 进度更新
				$(xhr.upload).bind("progress", function(evt){
					if (evt.lengthComputable) {
						var percentComplete = Math.round(evt.loaded * 100 / evt.total);
						_this.setting.progress(percentComplete);
					}
				}, false);
				// 上传完成
	            xhr.onreadystatechange = function() {
	            	if(fn){
						if (xhr.readyState == 4) {
							var flag = xhr.responseText;
							fn(flag);
						}
					}
				};
	            // 上传错误
				$(xhr).bind("error", function(){
	            	_this.setting.error();
	            }, false);
	            // 上传终止
				$(xhr).bind("abort", function(){
	            	_this.setting.uploadCanceled();
	            }, false);
	            xhr.open("post", "/admin/common/upload.html", true);
				xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
				//表单数据
				var fd = new FormData();
				var files = this.inputObj.prop('files');
				fd.append('uploadFile', files[0]);
				$.each(['wallId','flag','autoRotation'],function(index, el){
					var obj = _this.setting[el];
					if(obj){
						fd.append(el, obj);
					}
				});
				//执行发送
				xhr.send(fd);
				return this;
			}catch(e){
				this.setting.error(e);
			}
		},
	};
	$.fn.extend({
		upload: function(setting){
			return (new Upload(this,setting));
		}
	});
})(jQuery);
/*----------------------------- 文件上传 End -----------------------*/

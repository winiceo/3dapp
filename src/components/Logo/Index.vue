<template>

    <nav class="site-navbar navbar navbar-default navbar-fixed-top navbar-mega navbar-inverse"
         role="navigation">
        <div class="navbar-header">
            <button type="button" class="navbar-toggle hamburger hamburger-close navbar-toggle-left hided"
                    data-toggle="menubar">
                <span class="sr-only">Toggle navigation</span>
                <span class="hamburger-bar"></span>
            </button>
            <button type="button" class="navbar-toggle collapsed" data-target="#site-navbar-collapse"
                    data-toggle="collapse">
                <i class="icon wb-more-horizontal" aria-hidden="true"></i>
            </button>
            <a class="" href="../index.html">

                <logo></logo>

            </a>

            <!-- <button type="button" class="navbar-toggle collapsed" data-target="#site-navbar-search"
                    data-toggle="collapse">
                <span class="sr-only">Toggle Search</span>
                <i class="icon wb-search" aria-hidden="true"></i>
            </button> -->
        </div>

        <div class="navbar-container container-fluid">
            <!-- Navbar Collapse -->
            <div class="collapse navbar-collapse navbar-collapse-toolbar" id="site-navbar-collapse">
                <!-- Navbar Toolbar -->
                <ul class="nav navbar-toolbar">
                    <li class="hidden-float" id="toggleMenubar">
                        <a data-toggle="menubar" href="#" role="button">
                            <i class="icon hamburger hamburger-arrow-left">
                                <span class="sr-only">Toggle menubar</span>
                                <span class="hamburger-bar"></span>
                            </i>
                        </a>
                    </li>
                    <li>
                        <a href="/app/wall.html">
                            <i class="icon wb-grid-4" aria-hidden="true">活动列表</i>
                        </a>
                    </li>
                    <li class="dropdown dropdown-mega"><a class="dropdown-toggle" data-toggle="dropdown" href="#"
                                                          aria-expanded="false">上传logo<b class="caret"></b></a>
                        <ul class="dropdown-menu" role="menu">
                            <li>
                                <div class="row">
                                    <div class="col-sm-6 logoset">
                                        <div class="fl">
                                            <div class="img">
                                                <img id="egImg" src="../../assets/logo/images/set/heart-default.jpg"
                                                     width="115" height="64">
                                                <canvas id="cv" class="none">ie</canvas>
                                                <p class="txt">修改图片</p>
                                                <form class="fileform" id="fileform">
                                                    <input type="hidden" name="callBack" value="callBack">
                                                    <input name="file" type="file" value="上传图片" id="up-button">
                                                    <input type="hidden" id="logopic">
                                                    <input type="hidden" name="context" value="logowall">
                                                </form>
                                                <div class="remove">×</div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-sm-6">

                                        <p class="desc">图片主体是红色，背景为白色<br>建议尺寸990x560

                                            <br><input id="getResult" type="button" name="shengcheng"
                                                       class="btn btn-block btn-danger" value="转为LOGO图"/>

                                        </p>
                                    </div>

                                </div>

                            </li>
                        </ul>
                    </li>

                    <!-- Thumbnails Demo -->
                    <li class="dropdown dropdown-mega"><a class="dropdown-toggle" data-toggle="dropdown" href="#"
                                                          aria-expanded="false">配置<b class="caret"></b></a>
                        <ul class="dropdown-menu" role="menu">
                            <li>
                                <div class="mega-content" style="width:400px">
                                    <div class="row">
                                        <div class="fl">
                                            <h3>效果设置</h3>
                                            <p>头像方块尺寸：
                                                <!-- 定义单元格大小 -->
                                                <select name="cellNum" id="cell">
                                                    <option value="10" selected>10</option>
                                                    <option value="20">20</option>
                                                    <option value="30">30</option>
                                                    <option value="40">40</option>
                                                    <option value="50">50</option>
                                                </select>
                                                <br>
                                                方块默认颜色：<input id="squreColor" type="color" value="#e50150">
                                                <br>
                                                签到方块数量： <span id="totalCell">566</span>
                                                <br>
                                                <button type="button" class="btn btn-warning ladda-button"
                                                        data-style="zoom-in" data-plugin="ladda">
                                                    <span id="lookDefault">恢复默认</span></button>

                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </li>
                        </ul>
                    </li>


                    <li class="li-button">


                        <button type="button" class="btn btn-block btn-warning ladda-button" id="save-edite">保存</button>


                    </li>

                </ul>
                <!-- End Navbar Toolbar -->

                <!-- Navbar Toolbar Right -->

                <!-- End Navbar Toolbar Right -->
            </div>
            <!-- End Navbar Collapse -->

            <!-- Site Navbar Seach -->

            <!-- End Site Navbar Seach -->
        </div>
    </nav>


    <div class="page animsition" style="padding-top: 50px">


        <div class="page-content container-fluid lt-body bg-primary-100 text-center padding-20 ">
            <div class="col-xlg-4 col-md-12">
                <div id="recentActivityWidget" class="widget widget-shadow padding-bottom-20">

                    <div id="customLogo" class="wrap990 custom-logo">
                        <!-- 默认显示心形logo墙 -->

                    </div>
                    <div class="edit-tips">点击小方格，可修改图案</div>

                    <iframe name="upload" style="display: none;"></iframe>

                </div>
            </div>

        </div>


        <!-- End Create New Notes Modal -->


        <!--contextMenu END-->

    </div>


</template>
<style>
    * {
        margin: 0;
        padding: 0;
    }

    body {
        padding-top: 0px;;
    }

    .li-button {
        padding-top: 15px;
        padding-bottom: 22px;
        padding-left: 20px;
    }

</style>
<script>
    var imgdomain = window.imgdomain = ""
    require('../../assets/examples/css/dashboard/team.min.css');
    require('../../utils/u.js')
    require('layer/layer.js')
    require('layer/skin/layer.css')
    // ##require('../../assets/logo/layer/skin/layer.css')
    require('../../assets/logo/fonts/font-hixianchang.css')
    require('../../assets/logo/wall-set.css')
    require('../../assets/logo/config')
    require('../../assets/logo/jquery.base64.min')
    var Parse = require("parse");
    import logo from "../Common/logo.vue"


    export default{

        components: {logo},
        data(){
            return {
                token: '',
                status: -1,
                count: 0,
                next: 1,
                busy: false,
                item: {}

            }

        },
        methods: {
            init: function () {
                window.Site.cc();
                this.getdata();
                ;
            },
            openurl: function (url, id) {
                window.open(url + "?id=" + id)
            },

            selected: function (item) {
                console.log(item.toJSON())
                this.item = item.toJSON();
            },
            remove: function (index, item) {

            },


            calldata: function (status) {
                this.status = status;
                this.next = 1;
                this.items = [];
                this.getdata();
            },
            save: function () {
                var _vm = this;
                //_vm.item.style=parseInt(_vm.item.style);

                var act = "update"
                var id = _vm.app.aid;

                fetch(_vm.app.api + '/logowall/' + act + '/' + id, {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                        'Authorization': _vm.app.token
                    },
                    body: JSON.stringify(_vm.item)

                }).then(function (response) {
                    if (response.status >= 400) {
                        throw new Error("Bad response from server");
                    }

                    return response.json();
                }).then(function (item) {
                    console.log(item)

                    toastr.info('保存成功')

                });
            },

            getdata: function (callback) {


                var _vm = this;
                // var data = {
                //     next: this.next,
                //     status: this.status
                // }
                // var u = new URLSearchParams();
                // u.append('next', this.next);
                // u.append('status', this.status);

                fetch(_vm.app.api + '/logowall/' + _vm.app.aid, {
                    method: 'GET',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                        'Authorization': _vm.app.token
                    }


                }).then(function (response) {
                    if (response.status >= 400) {
                        throw new Error("Bad response from server");
                    }

                    return response.json();
                }).then(function (item) {


                    _vm.item = item.data;
                    _vm.initjs(item.data);


                });


            },


            initjs: function (app) {
                var _vm = this;


                //执行图片预加载，并上传默认图片.
                console.log("自定义logo墙");

//                //图片上传回调
//                function callBack(commonFile) {
//                    $('#up-button').parents("form")[0].reset();
//                    layer.closeAll();
//                    if (null != commonFile) {
//                        var imgPath = commonFile.url.dealUrl();
//                        var imgObj = new Image();
//                        imgObj.src = imgPath;
//                        imgObj.onload = function () {
//                            $('#egImg').attr('src', imgPath);
//                            $('#logopic').val(commonFile.url);
//                            $('.remove').show();
//                        }
//                    }
//                    $('#cell').val(10);
//                }

                //图片上传回调
                function callBack(commonFile) {
                    $('#up-button').parents("form")[0].reset();
                    layer.closeAll();
                    if (null != commonFile) {
                        var imgPath = commonFile.url;
                        var imgObj = new Image();
                        imgObj.src = imgPath;
                        imgObj.onload = function () {
                            $('#egImg').attr('src', imgPath);
                            $('#logopic').val(imgPath);
                            $('.remove').show();
                        }
                    }
                    $('#cell').val(10);
                }


                $(function () {
                    // 还原需要编辑的数据
                    var wall = {
                        "id": 33556689,
                        "createDate": "2016-06-06 20:39:39",
                        "updateDate": "2016-06-16 10:07:30",
                        "deleteTag": "N",
                        "userId": 251928,
                        "theme": "erqwer",
                        "title": "erqwer",
                        "startDate": "2016-06-07 05:00:00",
                        "endDate": "2016-06-24 04:00:00",
                        "backgroundImg": "http://img.wkey.cn/group4/M00/7B/ED/yq0KYVdNB2WAYE3NAAFV7lcj9Wk269.jpg",
                        "word": "qwrqwer",
                        "logo": "http://img.wkey.cn/group4/M00/7B/EC/yq0KYVdNBliALl4AAAOTZoyW1g099.jpeg",
                        "qrCode": null,
                        "ruleDes": "PHA+5YWz5rOo5b6u5L+h5YWs5LyX5Y+3LOWPkemAgSJxd3Jxd2VyIuWNs+WPr+WPguS4juS6kuWKqOWkp+Wxj+W5lTwvcD4=",
                        "sponsor": "[{\"img\":\"http://img.wkey.cn/group1/M00/5F/6B/yq0KXVXvxpyANwaMAAASLRJg8OU893.png\",\"cont\":\"Hi现场工作室提供技术支持\"}]",
                        "activeState": "In",
                        "examine": "N",
                        "filterWords": "Y",
                        "useMode": "Y",
                        "outTime": 2,
                        "styleName": "year-cheer",
                        "flag": "d78f4b2e41764ce3a690e358d4d2f4d9",
                        "onWallMsgNum": 0,
                        "partakeNum": 0,
                        "pendingNum": 0,
                        "type": "Bound",
                        "tempStyle": "{\"userHeadShape\":\"0\",\"messageShape\":\"0\",\"flipEffect\":\"simplified\",\"sponerAlign\":\"center\",\"msgOpacity\":\"2\",\"fontColor\":\"#cc0000\",\"customBg\":\"#fff\",\"msglength\":\"3\"}",
                        "qrText": "PHA+5YWz5rOo5b6u5L+h5YWs5LyX5Y+3LOWPkemAgSZxdW90O3F3cnF3ZXImcXVvdDvljbPlj6/lj4LkuI7kupLliqjlpKflsY/luZU8L3A+",
                        "encodeFlag": "Y",
                        "comeFrom": "normal",
                        "wallapplysignDesign": null
                    };
                    var defaultImg = $("#egImg").attr("src");//默认图片
                    var defaultColor = "#e50150";//默认方格颜色
                    //加载背景图
                    var bgImg = '';
                    if (wall.backgroundImg) {
                        bgImg = (wall.backgroundImg).dealUrl();
                    } else {
                        bgImg = tempGlobal[wall.styleName].bgImg;
                    }
                    //$('body').attr('style', 'background-image:url(' + bgImg + ')');
                    //初始化渲染
                    function initLogo() {
                        var d = new DataContent({
                            where: {
                                "wallId": parseInt(wall.id)
                            }
                        }).post({
                            type: 'get',
                            url: "/static/read.json",
                            callBack: function (data) {
                                if ('Right' == data.systemContent.state) {
                                    var logoWallObj = $('#customLogo'), squreColor, cellNum, showCell;
                                    if (data.dataContent.logoDesign) {
                                        var logojson = JSON.parse($.base64.atob(data.dataContent.logoDesign, true));
                                        squreColor = logojson.squreColor ? logojson.squreColor : defaultColor;
                                        cellNum = logojson.cellNum;
                                        showCell = logojson.showCell;
                                        //初始化数据
                                        var egImg = logojson.logopic;
                                        if (egImg && egImg != defaultImg) {
                                            $('#egImg').attr('src', egImg.dealUrl());
                                            $('#logopic').val(egImg);
                                        } else {
                                            $('#egImg').attr('src', defaultImg);
                                            $('#logopic').val(defaultImg);
                                        }
                                        $('#cell').val(cellNum);
                                        $('#squreColor').val(squreColor);
                                        $('#totalCell').text(showCell.length);//计算有多少单元格
                                        $('.remove').show(100);
                                        //生成方格dom结构
                                        var html = '';
                                        for (var j = 0; j < logojson.row; j++) {
                                            html += '<ul>';
                                            for (var i = 0; i < logojson.col; i++) {
                                                html += '<li data-axis="' + j + '*' + i + '"></li>';
                                            }
                                            html += '</ul>';
                                        }
                                        logoWallObj.empty().append(html).css('width', cellNum * logojson.col + 'px');
                                        //渲染出要填充的单元格
                                        for (var i = 0; i < showCell.length; i++) {
                                            $('li[data-axis="' + logojson.showCell[i] + '"]').addClass("showcell").css('background-color', squreColor);
                                        }
                                        //提供图案修改功能
                                        correctLogo();
                                    } else {
                                        //第一次进入,初始化心形
                                        var img = new Image();
                                        img.src = defaultImg;
                                        cellNum = 40;
                                        $('#cell').val(40);
                                        $('#logopic').val(defaultImg)
                                        initToSqure(img, 40, defaultColor);
                                    }
                                    //为单元格设置大小
                                    $('#customLogo ul').css("height", cellNum + "px");
                                    $('#customLogo ul li').css({
                                        width: cellNum + 'px',
                                        height: cellNum + 'px'
                                    });
                                } else {
                                    layer.msg(data.systemContent.msg);
                                }
                            }
                        });
                    }

                    // initLogo();

                    function setDesign() {

                        //var logoDesign=app.get("logoDesign")
                        var logoDesign = _vm.item.logo_hex;

                        var logoWallObj = $('#customLogo'), squreColor, cellNum, showCell;
                        if (logoDesign) {
                            var logojson = JSON.parse($.base64.atob(logoDesign, true));
                            squreColor = logojson.squreColor ? logojson.squreColor : defaultColor;
                            cellNum = logojson.cellNum;
                            showCell = logojson.showCell;
                            //初始化数据
                            var egImg = logojson.logopic;
                            if (egImg && egImg != defaultImg) {
                                $('#egImg').attr('src', egImg.dealUrl());
                                $('#logopic').val(egImg);
                            } else {
                                $('#egImg').attr('src', defaultImg);
                                $('#logopic').val(defaultImg);
                            }
                            $('#cell').val(cellNum);
                            $('#squreColor').val(squreColor);
                            $('#totalCell').text(showCell.length);//计算有多少单元格
                            $('.remove').show(100);
                            //生成方格dom结构
                            var html = '';
                            for (var j = 0; j < logojson.row; j++) {
                                html += '<ul>';
                                for (var i = 0; i < logojson.col; i++) {
                                    html += '<li data-axis="' + j + '*' + i + '"></li>';
                                }
                                html += '</ul>';
                            }
                            logoWallObj.empty().append(html).css('width', cellNum * logojson.col + 'px');
                            //渲染出要填充的单元格
                            for (var i = 0; i < showCell.length; i++) {
                                $('li[data-axis="' + logojson.showCell[i] + '"]').addClass("showcell").css('background-color', squreColor);
                            }
                            //提供图案修改功能
                            correctLogo();
                        } else {
                            //第一次进入,初始化心形
                            var img = new Image();
                            img.src = defaultImg;
                            cellNum = 40;
                            $('#cell').val(40);
                            $('#logopic').val(defaultImg)
                            initToSqure(img, 40, defaultColor);
                        }
                        //为单元格设置大小
                        $('#customLogo ul').css("height", cellNum + "px");
                        $('#customLogo ul li').css({
                            width: cellNum + 'px',
                            height: cellNum + 'px'
                        });
                    }

//
//                    function initDesign(){
//                        var logoData = Parse.Object.extend("walls");
//                        var query = new Parse.Query(logoData);
//                        query.equalTo("wallid", _vm.app.aid);
//                        query.limit(1)
//                        query.find({
//                            success: function(results) {
//                                if(results.length==1){
//                                    var app=results[0]
//                                    _vm.item=app;
//                                    setDesign(app)
//                                }else{
//                                    var app=new Parse.Object("walls");
//                                    _vm.item=app;
//                                    setDesign(app)
//                                }
//
//                            },
//                            error: function(error) {
//                                alert("Error: " + error.code + " " + error.message);
//                            }
//                        });
//                    }
                    setDesign();

                    //上传图片生成方格图
                    $("#getResult").click(function () {
                        layer.msg("请先上传图片~");
                    });
                    // 获取图片
                    function getImg(file) {
                        var reader = new FileReader(),
                                img = new Image(),
                                flag = true,
                                _this = $(this);
                        file = document.getElementById('up-button').files[0];
                        reader.readAsDataURL(file);
                        reader.onload = function () {
                            img.src = reader.result;
                            if (img.width > 1300 || img.height > 600) {
                                layer.msg('宽度必须小于1300px，高度小于600px!', {
                                    time: 4000, //4s后自动关闭
                                });
                                flag = false;
                            }
                            if (flag) {
                                var oForm = _this.parents('form');
                                oForm.attr({
                                    'action': _vm.app.upload,
                                    'enctype': 'multipart/form-data',
                                    'target': 'upload',
                                    'method': 'post'
                                });
                                layer.load(0, {
                                    shade: [0.5, '#6C6C6C'],
                                    skin: 'layui-layer-myloading'
                                });
                                var input = document.querySelector('input[type="file"]')

                                var data = new FormData()
                                data.append('file', input.files[0])
                                data.append('content', 'logowall')
                                // oForm.submit();

                                fetch(_vm.app.upload, {
                                    method: 'post',
                                    headers: {
                                        'Accept': 'application/json',

                                        'Authorization': _vm.app.token
                                    },
                                    body: data


                                }).then(function (response) {
                                    if (response.status >= 400) {
                                        throw new Error("Bad response from server");
                                    }

                                    return response.json();
                                }).then(function (item) {

                                    //layer.closeAll()
                                    _vm.item.pic = item;
                                    item.url=_vm.app.img+ item.url
                                    callBack(item)
                                   // $("#egImg")[0].src =_vm.app.img+ item.url;


                                });


//                                var name = "photo.jpg";
//
//                                var parseFile = new Parse.File(name, file);
//
//
//                                parseFile.save().then(function(a) {
//                                    // The file has been saved to Parse.
//                                    //console.log(a)
//
//                                    var jobApplication = _vm.item;
//                                    jobApplication.set("wallid",_vm.app.aid);
//                                    jobApplication.set("file", parseFile);
//                                    jobApplication.set("cate", "logo");
//                                    jobApplication.save();
//                                    console.log(parseFile);
//
//                                    //var profilePhoto = profile.get("photoFile");
//                                    //$("#profileImg")[0].src = parseFile.url();
//                                    callBack(parseFile)
//
//                                }, function(error) {
//                                    // The file either could not be read, or could not be saved to Parse.
//                                });
                            }
                        }
                    }

                    $("#up-button").change(getImg);

                    //转换成矩阵
                    function toLogoImg() {
                        var img = new Image();
                        img.crossOrigin = "anonymous";
                        var oldImg = $('#logopic').val();
                        if (oldImg != defaultImg) {
                            img.src = $('#logopic').val();//.dealUrl(wwwdomain) + '?app=hi';
                        } else {
                            img.src = defaultImg;
                        }
                        var squreColor = $("#squreColor").val();
                        var cellNum = $("#cell").val() ? parseInt($("#cell").val()) : 20;
                        initToSqure(img, cellNum, squreColor);
                    }

                    // 触发生成矩阵事件
                    $('#getResult').unbind('click').click(toLogoImg);
                    $("#cell").change(toLogoImg);
                    $('#squreColor').change(function () {//改颜色
                        var color = $(this).val();
                        $('#customLogo ul li.showcell').css('background-color', color);
                    });
                    //提供图案修改功能
                    function correctLogo() {
                        var isTap = false;
                        $('#customLogo ul li').mousedown(function (e) {
                            isTap = true;
                            e.preventDefault();
                        });
                        $('#customLogo ul li').mouseup(function (e) {
                            isTap = false;
                            e.preventDefault();
                        });
                        $('#customLogo ul li').mouseover(function (e) {
                            e.preventDefault();
                            if (isTap) {
                                var li = $(e.target);
                                //li.addClass('showcell').css('background-color',color);
                                if (!li.hasClass('showcell')) {
                                    li.addClass('showcell').css('background-color', $('#squreColor').val());
                                } else {
                                    li.removeClass('showcell').css('background-color', 'transparent');
                                }
                            }
                        });
                        $('#customLogo ul li').click(function () {
                            var li = $(this);
                            if (!li.hasClass('showcell')) {
                                li.addClass('showcell').css('background-color', $('#squreColor').val());
                                ;
                            } else {
                                li.removeClass('showcell').css('background-color', 'transparent');
                            }
                        });
                    }


                    // 转换成矩阵的初始化
                    function initToSqure(img, cellNum, color) {
                        var cv = document.getElementById('cv'),
                                c = cv.getContext('2d'),
                                customLogo = $('#customLogo');
                        img.onload = function () {
                            cv.width = img.width;
                            cv.height = img.height;
                            c.drawImage(img, 0, 0);
                            if (!cellNum) {
                                cellNum = 20
                            }
                            ;
                            var imgData = c.getImageData(0, 0, img.width, img.height);
                            var imgDataArr = imgData.data;
                            var imgDataWidth = imgData.width;
                            var imgDataHeight = imgData.height;
                            var html = '', axisX = 0, totalNum = cellNum * cellNum;
                            for (var h = 0; h < imgDataHeight; h += cellNum) {
                                var ul = '<ul>', axisY = 0;
                                for (var w = 0; w < imgDataWidth; w += cellNum) {
                                    var totalr = 0, totalg = 0, totalb = 0;
                                    for (var dx = 0; dx < cellNum; dx++) {
                                        for (var dy = 0; dy < cellNum; dy++) {
                                            var x = w + dx;
                                            var y = h + dy;

                                            var index = (y * imgDataWidth + x) * 4;
                                            totalr += imgDataArr[index + 0];
                                            totalg += imgDataArr[index + 1];
                                            totalb += imgDataArr[index + 2];

                                        }
                                    }
                                    ;

                                    var index = (w + imgDataWidth * h) * 4;
                                    var r = totalr / totalNum;
                                    var g = totalg / totalNum;
                                    var b = totalb / totalNum;
                                    var gray = getGray(r, g, b);
                                    ul += toSquare(gray, axisX, axisY, color);//参数是灰度值，行，列；行和列都从0开始
                                    axisY++;
                                }
                                ul += '</ul>';
                                axisX++;
                                html += ul;
                                customLogo.css('width', cellNum * axisY + 'px');
                            }
                            customLogo.empty().append(html);

                            //去除边沿多余的空行---------待优化，可能会出现多个前后空行（中间间隔的空行不可删除）
                            /* var ul = $('#customLogo ul'),firstRow = ul[0],lastRow = ul[ul.length - 1];
                             if(!$(firstRow).hasClass('showcell')){$(firstRow).remove()};
                             if(!$(lastRow).hasClass('showcell')){$(lastRow).remove()}; */

                            //统计总共有多少可填充的单元格
                            $('#totalCell').text($('ul li.showcell').length);
                            //为单元格设置大小
                            $('#customLogo ul').css("height", cellNum + "px");
                            $('#customLogo ul li').css({
                                width: cellNum + 'px',
                                height: cellNum + 'px'
                            });

                            correctLogo();
                        }
                    }

                    // 根据rgb值计算灰度
                    function getGray(r, g, b) {
                        return 0.299 * r + 0.578 * g + 0.114 * b;
                    }

                    // 根据灰度生成相应单元格
                    function toSquare(g, x, y, color) {
                        if (g <= 255 / 2) {
                            return '<li data-axis="' + x + '*' + y + '" class="showcell" style="background-color:' + color + '"></li>';
                        } else {
                            return '<li data-axis="' + x + '*' + y + '"></li>';//白色背景部分，不填充
                        }
                    }


                    /*************************保存*********************************/
                    function saveCustomLogo(isTips, fn) {//isTips为true的时候不提示
                        var logoDesign = {};//需要提交数据库的参数
                        //自定义logo墙
                        var showCellArr = [];//生成数组
                        //获取要填充的数组
                        var tempArr = $('ul li.showcell');
                        for (var i = tempArr.length - 1; i >= 0; i--) {
                            showCellArr.push($(tempArr[i]).attr('data-axis'));
                        }
                        ;
                        logoDesign = {
                            'col': $('#customLogo ul').first().find('li').length,
                            'row': $('#customLogo ul').length,
                            'logopic': $('#logopic').val(),
                            'squreColor': $('#squreColor').val(),
                            'cellNum': parseInt($('#cell').val()),
                            'showCell': showCellArr
                        };
                        var json = JSON.stringify(logoDesign);

                        _vm.item.logo_hex = $.base64.btoa(json, true);

                        //var jobApplication = _vm.item;
                        _vm.$set("item.logo_hex", $.base64.btoa(json, true));
                        _vm.save();

//                        jobApplication.set("logoDesign",$.base64.btoa(json, true));
//
//                        jobApplication.save(null,{
//                            success:function(item){
//                                $('#totalCell').text(showCellArr.length);
//                                if (!isTips) {
//                                    layer.msg('发布成功！')
//                                }
//                                ;
//                                if (fn) {
//                                    fn()
//                                }
//                            },
//                            error: function(item, error) {
//                                layer.msg(" (￣y▽￣)╭~刷新再试下吧亲~");
//                            }
//                        });
//                        var d = new DataContent({
//                            where: {
//                                wallId: parseInt(wall.id)
//                            },
//                            update: {
//                                logoDesign: $.base64.btoa(json, true)
//                            }
//                        }).post({
//                            url: "/api/wallapplysignConfig/update.html",
//                            callBack: function (data) {
//                                if ('Right' == data.systemContent.state) {
//                                    //统计单元格总数
//                                    $('#totalCell').text(showCellArr.length);
//                                    if (!isTips) {
//                                        layer.msg('发布成功！')
//                                    }
//                                    ;
//                                    if (fn) {
//                                        fn()
//                                    }
//                                    ;
//                                } else {
//                                    //layer.msg(data.systemContent.msg);
//                                    layer.msg(" (￣y▽￣)╭~刷新再试下吧亲~");
//                                }
//                            }
//                        });
                    }

                    //保存当前设置
                    $('#save-edite').click(function () {
                        saveCustomLogo();
                    });
                    $('#back-edite').click(function () {
                        var _this = $(this);
                        var backHref = _this.attr('href');
                        layer.open({
                            content: '未发布的内容会丢失，请选择你要执行的操作',
                            title: false,
                            area: '475px',
                            skin: 'layui-layer-saveconfirm',
                            btn: ['发布并离开', '不发布离开'],
                            btn1: function () {
                                saveCustomLogo(false, function () {
                                    window.location.href = backHref;
                                });
                            },
                            btn2: function (index) {
                                window.location.href = backHref;
                            }
                        });
                        return false;
                    });
                    $('#toTempStyle').click(function () {
                        saveCustomLogo(true, function () {
                            window.location.href = '/admin/wall/wallTempStyle.html?flag=' + wall.flag;
                        });
                    });


                    /*************************删除图片*********************************/
                    $('.remove,#lookDefault').click(function () {//恢复默认状态
                        $('#egImg').attr('src', defaultImg);
                        $('#logopic').val(defaultImg);
                        $('#squreColor').val(defaultColor);
                        $('#cell').val(40);
                        $('#totalCell').text(120);
                        var img = new Image();
                        img.src = defaultImg;
                        initToSqure(img, 40, defaultColor);
                        $('.remove').hide();
                    });

                    //查看示例
                    $('#lookEg').click(function () {
                        var html = '<div class="egbox">';
                        html += '<img src="/images/set/logo-eg.jpg">';
                        html += '<i>×</i>';
                        html += '<a class="download" href="' + wwwdomain + '/api/wall/logo/example.html">样图下载</a>'
                        html += '</div>';
                        $(this).after(html);
                        $('.egbox i').unbind('click').click(function (e) {
                            e.stopPropagation();
                            $('.egbox').remove();
                        });
                    });

                })
            }
        }

    }
</script>
<template>
    <nav class="site-navbar navbar navbar-default navbar-fixed-top navbar-mega navbar-inverse"
         role="navigation">
        <div class="navbar-header">

            <a class="" href="../index.html">

                <logo></logo>

            </a>


        </div>

        <div class="navbar-container container-fluid">
            <!-- Navbar Collapse -->
            <div class="collapse navbar-collapse navbar-collapse-toolbar" id="site-navbar-collapse">
                <!-- Navbar Toolbar -->
                <ul class="nav navbar-toolbar">

                    <li>
                        <a href="/app/wall.html">
                            <i class="icon wb-grid-4" aria-hidden="true">活动列表</i>
                        </a>
                    </li>


                    <li v-show="showScreen">
                        <a href="{{WallUrl}}?id={{aid}}&token={{token}}" target="_blank" id="screenUrl">
                            <i class="icon wb-grid-4" aria-hidden="true">进入大屏</i>
                        </a>
                    </li>

                    <li v-show="showScreen">
                        <a href="/app/logo.html?id={{aid}}&token={{token}}" target="_blank" id="logoUrl">
                            <i class="icon wb-grid-4" aria-hidden="true">logo墙设计</i>
                        </a>
                    </li>

                </ul>
                <!-- End Navbar Toolbar -->

                <!-- Navbar Toolbar Right -->
                <ul class="nav navbar-toolbar navbar-right navbar-toolbar-right">

                    <li class="dropdown">
                        <a class="navbar-avatar dropdown-toggle" data-toggle="dropdown" href="#" aria-expanded="false"
                           data-animation="scale-up" role="button">
                          <span class="avatar avatar-online">
                            <img src="../../global/avatar.png" alt="...">
                            <i></i>
                          </span>
                        </a>
                        <ul class="dropdown-menu" role="menu">
                            <li role="presentation">
                                <a href="javascript:void(0)" @click="user_center"
                                ><i
                                        class="icon wb-settings"
                                        aria-hidden="true"></i> 个人中心</a>
                            </li>

                            <li role="presentation">


                                <a href="#" data-animation="scale-up" data-target="#setting_passwd"
                                   data-toggle="modal" role="menuitem"  ><i
                                        class="icon wb-settings"
                                        aria-hidden="true"></i>修改资料</a>
                            </li>

                            <!--<li role="presentation">-->
                                <!--<a href="#" data-animation="scale-up" data-target="#setting_wechat"-->
                                   <!--data-toggle="modal" role="menuitem" role="menuitem"><i-->
                                        <!--class="icon wb-settings"-->
                                        <!--aria-hidden="true"></i> 配置公众号</a>-->
                            <!--</li>-->
                            <li class="divider" role="presentation"></li>
                            <li role="presentation">
                                <a href="javascript:void(0)" @click="logout" role="menuitem"><i class="icon wb-power"
                                                                                                aria-hidden="true"></i>
                                    退出</a>
                            </li>
                        </ul>
                    </li>


                </ul>
                <!-- End Navbar Toolbar Right -->
            </div>
            <!-- End Navbar Collapse -->

            <!-- Site Navbar Seach -->
            <div class="collapse navbar-search-overlap" id="site-navbar-search">
                <form role="search">
                    <div class="form-group">
                        <div class="input-search">
                            <i class="input-search-icon wb-search" aria-hidden="true"></i>
                            <input type="text" class="form-control" name="site-search" placeholder="Search...">
                            <button type="button" class="input-search-close icon wb-close"
                                    data-target="#site-navbar-search"
                                    data-toggle="collapse" aria-label="Close"></button>
                        </div>
                    </div>
                </form>
            </div>
            <!-- End Site Navbar Seach -->
        </div>
    </nav>

    <div class="modal fade modal-super-scaled mybody" id="setting_passwd"
         aria-labelledby="exampleModalTitle" role="dialog" tabindex="-1">
        <div class="modal-dialog">
            <div class="modal-content">

                <div class="example-wrap">
                    <div class="nav-tabs-horizontal">
                        <ul class="nav nav-tabs" data-plugin="nav-tabs" role="tablist">
                            <li class="active" role="presentation"><a data-toggle="tab" href="#base"
                                                                      aria-controls="exampleTabsOne" role="tab"
                                                                      aria-expanded="true">基本信息</a></li>
                            <li role="presentation" class=""><a data-toggle="tab" href="#pwd"
                                                                aria-controls="exampleTabsTwo" role="tab"
                                                                aria-expanded="false">更新密码</a></li>

                        </ul>
                        <div class="tab-content padding-top-20">
                            <div class="tab-pane active" id="base" role="tabpanel">
                                <div class="form-group">
                                    <form-input
                                            :model.sync="userinfo.username"
                                            type="text"
                                            label="用户名:"
                                            :error="checkName"
                                            message="用户名不能为空"
                                    >

                                    </form-input>
                                </div>
                                <div class="form-group">
                                    <form-input
                                            :model.sync="userinfo.email"
                                            type="email"
                                            label="邮箱:"
                                            :error="checkEmail"
                                            message="邮箱不能为空"
                                    >
                                    </form-input>

                                </div>
                                <div style="text-align:center">
                                    <button type="button" class="btn btn-default margin-0" @click="save">确定
                                    </button>
                                    <button type="button" class="btn btn-primary" data-dismiss="modal">取消</button>

                                </div>
                            </div>

                            <div class="tab-pane" id="pwd" role="tabpanel">
                                <div class="form-group">
                                    <form-input
                                            :model.sync="userinfo.password"
                                            type="password"
                                            label="密    码:"
                                            :error="checkPasswd"


                                            message="密码不能小于6位数"
                                    >

                                    </form-input>
                                </div>
                                <div class="form-group">
                                    <form-input
                                            :model.sync="userinfo.repassword"
                                            type="password"
                                            label="重复密码:"
                                            :error="error"


                                            message="重复密码输入不一致"
                                    >
                                    </form-input>

                                </div>
                                <div style="text-align:center"><a class="btn btn-default margin-0" @click="save">确定
                                </a>                    <button type="button" class="btn btn-primary" data-dismiss="modal">取消</button>

                                </div>


                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>


    <div class="modal fade modal-super-scaled mybody" id="setting_wechat" aria-hidden="true"
         aria-labelledby="exampleModalTitle" role="dialog" tabindex="-1">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">×</span>
                    </button>
                    <h4 class="modal-title">配置公众号</h4>
                </div>
                <div class="modal-body ">
                    <div class="" v-if="authorizer!=false">
                        <div class="widget widget-shadow">
                            <div class="widget-header bg-white-600 text-center  ">
                                <div class="font-size-20 black">您的公众号授权成功</div>

                                <div class="grey-300 font-size-14 margin-bottom-20">

                                    <img :src="authorizer.head_img" width=150 height="150">
                                    <br>
                                    {{authorizer.nick_name}}

                                </div>
                                <a href="#" @click='set_wechat'>改用手动配置公众号方式</a>
                            </div>
                        </div>

                    </div>


                    <div v-if="authorizer==false">
                        <div class="row" data-plugin="matchHeight" data-by-row="true">


                            <div class="col-lg-6 col-md-6" style="height: 190px;" @click="get_wechat">
                                <div class="widget widget-shadow">
                                    <div class="widget-header bg-green-600 text-center padding-30 padding-bottom-15">
                                        <div class="font-size-20 white">安全模式(推荐)</div>
                                        <div class="grey-300 font-size-14 margin-bottom-20">登录公众号，一键授权</div>

                                    </div>
                                </div>
                            </div>

                            <div class="col-lg-6 col-md-6" style="height: 190px;" @click='set_wechat'>
                                <div class="widget widget-shadow">
                                    <div class="widget-header bg-orange-700  text-center padding-30 padding-bottom-15">
                                        <div class="font-size-20 white">常规模式</div>
                                        <div class="grey-300 font-size-14 margin-bottom-20">手动设置微信号</div>

                                    </div>
                                </div>
                            </div>


                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-default margin-0" data-dismiss="modal" @click="save">确定
                    </button>
                    <button type="button" class="btn btn-primary" data-dismiss="modal">取消</button>

                </div>
            </div>
        </div>
    </div>


</template>
<style>
    .password > div{
        width:100%;
    }
    .my3d .modal-header {
       padding: 0;
        border-bottom: none;
    }
    .my3d .modal-container
    {
        padding:0px;
    }
    .mybody1 .modal-header{
        background-color: #f96868;
        border-radius: 4px 4px 0 0;
    }
     .mybody1 .modal-body{
     padding-left:10px;
     padding-right:10px;
     padding-bottom:5px;
     }
     .mybody {
        padding:10px;
     }
     .mybody .form-input{
     width:400px;
     }
     .mybody .form-label{
     width:80px;
     text-align:right;
     font-size:14px;
     }
     .mybody .widget{
     margin-bottom:5px;
     }

     .mybody .modal-body {
            padding: 1rem 0 0rem 0;
        }
    .example-wrap{
     padding:10px;
    }




</style>
<script>
    require('../../assets/css/app.css');

    import logo from "../Common/logo.vue"
    import {ModalAlert, FormInput} from "../../lib/components"
    //require('../../global/js/components/toastr.min');
    //import { vsFormInput } from 'vuestrap-base-components/src/components'
    import {User_Center,WallUrl} from "../../config"
    import {whatever, api} from "../../utils/leven"

    export default{
        data(){
            return {
                WallUrl:WallUrl,
                userinfo: {
                    username:'',
                    email:''
                },
                error: false,
                aid:0,
                token:'',
                showScreen:this.$parent.showScreen,
                showModalAlert: false,
                authorizer:false
            }
        },


        computed: {

        },
        components: {logo, ModalAlert, FormInput},
        methods: {
         error: function () {
                return this.userinfo.password == this.userinfo.repassword ? false : true
            },
            checkPasswd: function () {
                if (this.userinfo.password) {
                    return this.userinfo.password.toString().length < 6
                } else {
                    return false;
                }

                //this.error=this.userinfo.password==this.userinfo.repassword?false:true;
            },
            checkName:function(){
                if(this.userinfo.username==""||this.uerinfo.usernmae.length<2){

                    return false;
                }

            },
            checkEmail:function(){
                if(this.userinfo.email==""||this.uerinfo.usernmae.email<2){

                    return false;
                }

            },

            init:function(){
                this.token=this.app.token
                this.aid =this.app.aid;
                this.get_userinfo( );


            },
            logout: function () {
                this.$clearStorage();
                window.location.href = User_Center + "/logout";//"/app/wall.html#!/login"
            },
            changeBase:function(){


                 $('#setting_passwd').modal('show')

            },
            openWe:function(){
                 this.get_userinfo( );

                 $('#setting_wechat').modal()

            },

            get_userinfo: function ( ) {

                var _vm = this;
                fetch(_vm.app.api + '/user/profile', {
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
                }).then(function (res) {
                    var data=res.data
                     console.log("======");
                     console.log(res.data);
                     console.log("========")
                    _vm.userinfo = data;
                    if(data.authorizer_info){


                        if(data.authorizer_info.authorization_info){



                        _vm.authorizer=data.authorizer_info.authorizer_info
                        }



                    }
                    _vm.$parent.hideLoading();


                });


            },

            get_wechat: function () {


                var _vm = this;

                api(_vm).get(_vm.app.api + '/common/wechat/open/preauth' ).then(function (data) {

                    console.log(data)
                    if(data.code=="0"){

                       window.open(data.data)
                    }else{
                        alert("获取信息出错")
                    }



                });


            },
            set_wechat:function(){
            window.open("/app/wall.html#!/setting2")

            },


            user_center:function(){
            window.open("/app/wall.html#!/usercenter")

            },


            save: function () {

              var _vm = this;
              api(_vm).post(_vm.app.api + '/user/update' , JSON.stringify(_vm.userinfo))
             .then(function (item) {
                     if(item.code==0){
                        toastr.info('更新成功');
                        $("#setting_passwd").modal('hide')
                         window.location.href = User_Center+"/login"
                     }else{
                        toastr.error(item.message);
                     }
                    //_vm.add ? _vm.items.push(item.data) : ""

                    //toastr.info('更新成功');


                });
            }
        }
    }


</script>
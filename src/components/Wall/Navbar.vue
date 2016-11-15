<template>
    <nav class="site-navbar navbar navbar-default navbar-fixed-top navbar-mega navbar-inverse"
         role="navigation">
        <div class="navbar-header">
            <!--<button type="button" class="navbar-toggle hamburger hamburger-close navbar-toggle-left hided"-->
                    <!--data-toggle="menubar">-->
                <!--<span class="sr-only">Toggle navigation</span>-->
                <!--<span class="hamburger-bar"></span>-->
            <!--</button>-->
            <!--<button type="button" class="navbar-toggle collapsed" data-target="#site-navbar-collapse"-->
                    <!--data-toggle="collapse">-->
                <!--<i class="icon wb-more-horizontal" aria-hidden="true"></i>-->
            <!--</button>-->
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
                    <!--<li class="hidden-float" id="toggleMenubar">-->
                        <!--<a data-toggle="menubar" href="#" role="button">-->
                            <!--<i class="icon hamburger hamburger-arrow-left">-->
                                <!--<span class="sr-only">Toggle menubar</span>-->
                                <!--<span class="hamburger-bar"></span>-->
                            <!--</i>-->
                        <!--</a>-->
                    <!--</li>-->
                    <li>
                        <a href="/app/wall.html">
                            <i class="icon wb-grid-4" aria-hidden="true">活动列表</i>
                        </a>
                    </li>


                    <li v-show="showScreen">
                        <a href="{{WallUrl}}?id={{aid}}&token={{app.token}}" target="_blank" id="screenUrl">
                            <i class="icon wb-grid-4" aria-hidden="true">进入大屏</i>
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
                                <a href="javascript:void(0)" @click="showModalAlert = true" role="menuitem"><i
                                        class="icon wb-settings"
                                        aria-hidden="true"></i> 设置</a>
                            </li>
                            <li class="divider" role="presentation"></li>
                            <li role="presentation">
                                <a href="javascript:void(0)" @click="logout" role="menuitem"><i class="icon wb-power"
                                                                                                aria-hidden="true"></i>
                                    退出</a>
                            </li>
                        </ul>
                    </li>
                    <!--  <li class="dropdown">
                         <a data-toggle="dropdown" href="javascript:void(0)" title="Notifications" aria-expanded="false"
                            data-animation="scale-up" role="button">
                             <i class="icon wb-bell" aria-hidden="true"></i>
                             <span class="badge badge-danger up">5</span>
                         </a>
                         <ul class="dropdown-menu dropdown-menu-right dropdown-menu-media" role="menu">
                             <li class="dropdown-menu-header" role="presentation">
                                 <h5>NOTIFICATIONS</h5>
                                 <span class="label label-round label-danger">New 5</span>
                             </li>

                             <li class="list-group" role="presentation">
                                 <div data-role="container">
                                     <div data-role="content">
                                         <a class="list-group-item" href="javascript:void(0)" role="menuitem">
                                             <div class="media">
                                                 <div class="media-left padding-right-10">
                                                     <i class="icon wb-order bg-red-600 white icon-circle" aria-hidden="true"></i>
                                                 </div>
                                                 <div class="media-body">
                                                     <h6 class="media-heading">A new order has been placed</h6>
                                                     <time class="media-meta" datetime="2016-06-12T20:50:48+08:00">5 hours ago</time>
                                                 </div>
                                             </div>
                                         </a>
                                         <a class="list-group-item" href="javascript:void(0)" role="menuitem">
                                             <div class="media">
                                                 <div class="media-left padding-right-10">
                                                     <i class="icon wb-user bg-green-600 white icon-circle" aria-hidden="true"></i>
                                                 </div>
                                                 <div class="media-body">
                                                     <h6 class="media-heading">Completed the task</h6>
                                                     <time class="media-meta" datetime="2016-06-11T18:29:20+08:00">2 days ago</time>
                                                 </div>
                                             </div>
                                         </a>
                                         <a class="list-group-item" href="javascript:void(0)" role="menuitem">
                                             <div class="media">
                                                 <div class="media-left padding-right-10">
                                                     <i class="icon wb-settings bg-red-600 white icon-circle" aria-hidden="true"></i>
                                                 </div>
                                                 <div class="media-body">
                                                     <h6 class="media-heading">Settings updated</h6>
                                                     <time class="media-meta" datetime="2016-06-11T14:05:00+08:00">2 days ago</time>
                                                 </div>
                                             </div>
                                         </a>
                                         <a class="list-group-item" href="javascript:void(0)" role="menuitem">
                                             <div class="media">
                                                 <div class="media-left padding-right-10">
                                                     <i class="icon wb-calendar bg-blue-600 white icon-circle" aria-hidden="true"></i>
                                                 </div>
                                                 <div class="media-body">
                                                     <h6 class="media-heading">Event started</h6>
                                                     <time class="media-meta" datetime="2016-06-10T13:50:18+08:00">3 days ago</time>
                                                 </div>
                                             </div>
                                         </a>
                                         <a class="list-group-item" href="javascript:void(0)" role="menuitem">
                                             <div class="media">
                                                 <div class="media-left padding-right-10">
                                                     <i class="icon wb-chat bg-orange-600 white icon-circle" aria-hidden="true"></i>
                                                 </div>
                                                 <div class="media-body">
                                                     <h6 class="media-heading">Message received</h6>
                                                     <time class="media-meta" datetime="2016-06-10T12:34:48+08:00">3 days ago</time>
                                                 </div>
                                             </div>
                                         </a>
                                     </div>
                                 </div>
                             </li>
                             <li class="dropdown-menu-footer" role="presentation">
                                 <a class="dropdown-menu-footer-btn" href="javascript:void(0)" role="button">
                                     <i class="icon wb-settings" aria-hidden="true"></i>
                                 </a>
                                 <a href="javascript:void(0)" role="menuitem">
                                     All notifications
                                 </a>
                             </li>
                         </ul>
                     </li>
                     <li class="dropdown">
                         <a data-toggle="dropdown" href="javascript:void(0)" title="Messages" aria-expanded="false"
                            data-animation="scale-up" role="button">
                             <i class="icon wb-envelope" aria-hidden="true"></i>
                             <span class="badge badge-info up">3</span>
                         </a>
                         <ul class="dropdown-menu dropdown-menu-right dropdown-menu-media" role="menu">
                             <li class="dropdown-menu-header" role="presentation">
                                 <h5>MESSAGES</h5>
                                 <span class="label label-round label-info">New 3</span>
                             </li>

                             <li class="list-group" role="presentation">
                                 <div data-role="container">
                                     <div data-role="content">
                                         <a class="list-group-item" href="javascript:void(0)" role="menuitem">
                                             <div class="media">
                                                 <div class="media-left padding-right-10">
                           <span class="avatar avatar-sm avatar-online">
                             <img src="../../global/portraits/2.jpg" alt="..." />
                             <i></i>
                           </span>
                                                 </div>
                                                 <div class="media-body">
                                                     <h6 class="media-heading">Mary Adams</h6>
                                                     <div class="media-meta">
                                                         <time datetime="2016-06-17T20:22:05+08:00">30 minutes ago</time>
                                                     </div>
                                                     <div class="media-detail">Anyways, i would like just do it</div>
                                                 </div>
                                             </div>
                                         </a>
                                         <a class="list-group-item" href="javascript:void(0)" role="menuitem">
                                             <div class="media">
                                                 <div class="media-left padding-right-10">
                           <span class="avatar avatar-sm avatar-off">
                             <img src="../../global/portraits/3.jpg" alt="..." />
                             <i></i>
                           </span>
                                                 </div>
                                                 <div class="media-body">
                                                     <h6 class="media-heading">Caleb Richards</h6>
                                                     <div class="media-meta">
                                                         <time datetime="2016-06-17T12:30:30+08:00">12 hours ago</time>
                                                     </div>
                                                     <div class="media-detail">I checheck the document. But there seems</div>
                                                 </div>
                                             </div>
                                         </a>
                                         <a class="list-group-item" href="javascript:void(0)" role="menuitem">
                                             <div class="media">
                                                 <div class="media-left padding-right-10">
                           <span class="avatar avatar-sm avatar-busy">
                             <img src="../../global/portraits/4.jpg" alt="..." />
                             <i></i>
                           </span>
                                                 </div>
                                                 <div class="media-body">
                                                     <h6 class="media-heading">June Lane</h6>
                                                     <div class="media-meta">
                                                         <time datetime="2016-06-16T18:38:40+08:00">2 days ago</time>
                                                     </div>
                                                     <div class="media-detail">Lorem ipsum Id consectetur et minim</div>
                                                 </div>
                                             </div>
                                         </a>
                                         <a class="list-group-item" href="javascript:void(0)" role="menuitem">
                                             <div class="media">
                                                 <div class="media-left padding-right-10">
                           <span class="avatar avatar-sm avatar-away">
                             <img src="../../global/portraits/5.jpg" alt="..." />
                             <i></i>
                           </span>
                                                 </div>
                                                 <div class="media-body">
                                                     <h6 class="media-heading">Edward Fletcher</h6>
                                                     <div class="media-meta">
                                                         <time datetime="2016-06-15T20:34:48+08:00">3 days ago</time>
                                                     </div>
                                                     <div class="media-detail">Dolor et irure cupidatat commodo nostrud nostrud.</div>
                                                 </div>
                                             </div>
                                         </a>
                                     </div>
                                 </div>
                             </li>
                             <li class="dropdown-menu-footer" role="presentation">
                                 <a class="dropdown-menu-footer-btn" href="javascript:void(0)" role="button">
                                     <i class="icon wb-settings" aria-hidden="true"></i>
                                 </a>
                                 <a href="javascript:void(0)" role="menuitem">
                                     See all messages
                                 </a>
                             </li>
                         </ul>
                     </li>
                     <li id="toggleChat">
                         <a data-toggle="site-sidebar" href="javascript:void(0)" title="Chat" data-url="../site-sidebar.tpl">
                             <i class="icon wb-chat" aria-hidden="true"></i>
                         </a>
                     </li> -->
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

    <modal-alert :show.sync="showModalAlert" class='my3d' title="更新密码" ,foot="false">

        <div slot="content" id="form" class="styleguide-section">

            <div class="  cf password">
                <div class="form-group">
                <form-input
                        :model.sync="userinfo.password"
                        type="password"
                        label="密码"
                        :error="checkPasswd"


                        message="密码不能小于6位数"
                >

                </form-input>
                    </div>
                <div class="form-group">
                <form-input
                        :model.sync="userinfo.repassword"
                        type="password"
                        label="重复密码"
                        :error="error"


                        message="重复密码输入不一致"
                >
                </form-input>
                </div>
                <div class="form-group" style="text-align:center">

                <button class="button btn btn-default btn-outline" :class="{'button-disabled' : error}" @click="save">
                    确定
                </button>
                    </div>
            </div>

        </div>


    </modal-alert>
</template>
<style>
    .password > div{
        width:100%;
    }
    .my3d .modal-header {
       padding: 0;
        border-bottom: none;
    }

</style>
<script>
    require('../../assets/css/app.css');

    import logo from "../Common/logo.vue"
    import {ModalAlert, FormInput} from "../../lib/components"
    //require('../../global/js/components/toastr.min');
    //import { vsFormInput } from 'vuestrap-base-components/src/components'
    import {User_Center,WallUrl} from "../../config"

    export default{
        data(){
            return {
                WallUrl:WallUrl,
                userinfo: {},
                error: false,
                aid:0,
                showScreen:this.$parent.showScreen,
                showModalAlert: false
            }
        },


        computed: {
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
            }
        },
        components: {logo, ModalAlert, FormInput},
        methods: {
            init:function(){

                this.aid =this.app.aid;
            },
            logout: function () {
                this.$clearStorage();
                window.location.href = User_Center + "/logout";//"/app/wall.html#!/login"
            },
            getuser: function () {
                var _vm = this;
                fetch(_vm.app.api + '/user', {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                        'Authorization': _vm.app.token
                    },
                    body: JSON.stringify(_vm.userinfo)

                }).then(function (response) {
                    if (response.status >= 400) {
                        throw new Error("Bad response from server");
                    }

                    return response.json();
                }).then(function (item) {
                    //_vm.add ? _vm.items.push(item.data) : ""
                    console.log(item)
                    _vm.userinfo = item;

                });
            },
            save: function () {

                var _vm = this;
                fetch(_vm.app.api + '/user/update', {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                        'Authorization': _vm.app.token
                    },
                    body: JSON.stringify(_vm.userinfo)

                }).then(function (response) {
                    if (response.status >= 400) {
                        throw new Error("Bad response from server");
                    }

                    return response.json();
                }).then(function (item) {
                    //_vm.add ? _vm.items.push(item.data) : ""

                    //toastr.info('更新成功');
                    _vm.showModalAlert = false;

                });
            }
        }
    }
</script>
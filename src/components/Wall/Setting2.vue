<template>

    <Navbar></Navbar>

    <div class="page animsition">

        <div class="row" data-plugin="matchHeight" data-by-row="true" styel="text-alien:center">
            <div class='col-md-6 col-md-offset-2'>
            <table class='mytable'>

                <tr><td >

                   <h1>微信公众号手动配置</h1>



                </td></tr>
                <tr><td >

                    <img src="../../assets/images/pm-first.jpeg"><br><br>



                </td></tr>

                <tr><td>  <img src="../../assets/images/pm-second.jpeg"></td></tr>

                <tr><td style='text-align:left'>
                    <span style='text-align:left'>
                    URL（服务器地址）： http://pmker.com/**********
                    <br>
                    Token（令牌）： ***********
                    <br>
                    将上面的URL和Token复制到 开发-基本配置-修改配置 模块中（用于接收用户信息）
                    </span>
                </td></tr>


                </table>

            </div>


        </div>

    </div>


</template>
<style>
.mytable{

text-align:center;
}
    .mytable td{
    text-align:center;
    }

    .modal-super-scaled .modal-header {
        background-color: #f96868;
        border-radius: 4px 4px 0 0;
    }
    .timeline::before {

        height: 94%;

    }

    .dropzone {
        min-height: 120px;
        width: 150px;
        height: 150px;
        padding: 0;

    }

    .dropzone .dz-preview .dz-image {
        border-radius: 10px;
        overflow: hidden;
        width: 120px;
        height: 120px;
        position: relative;
        display: block;
        z-index: 10;
    }

    /* Circle */
    .hover15 figure {
        position: relative;
    }

    .hover15 figure::before {
        position: absolute;
        top: 50%;
        left: 50%;
        z-index: 2;
        display: block;
        content: '';
        width: 0;
        height: 0;
        background: rgba(255, 255, 255, .2);
        border-radius: 100%;
        -webkit-transform: translate(-50%, -50%);
        transform: translate(-50%, -50%);
        opacity: 0;
    }

    figure {

        margin: 0;
        padding: 0;
        background: #fff;
        overflow: hidden;
    }

    figure:hover + span {
        bottom: -36px;
        opacity: 1;
    }

    .column {
        margin: 15px 15px 0;
        padding: 0;
    }

    .column:last-child {
        padding-bottom: 60px;
    }

    .column::after {
        content: '';
        clear: both;
        display: block;
    }

    .column div {
        position: relative;
        float: left;

        margin: 0 0 0 25px;
        padding: 0;
    }

    .column div:first-child {
        margin-left: 0;
    }

    .column div span {
        position: absolute;
        bottom: -20px;
        left: 0;
        z-index: -1;
        display: block;
        width: 300px;
        margin: 0;
        padding: 0;
        color: #444;
        font-size: 18px;
        text-decoration: none;
        text-align: center;
        -webkit-transition: .3s ease-in-out;
        transition: .3s ease-in-out;
        opacity: 0;
    }

    .hover15 figure:hover::before {
        -webkit-animation: circle .75s;
        animation: circle .75s;
    }

    @-webkit-keyframes circle {
        0% {
            opacity: 1;
        }
        40% {
            opacity: 1;
        }
        100% {
            width: 200%;
            height: 200%;
            opacity: 0;
        }
    }

    @keyframes circle {
        0% {
            opacity: 1;
        }
        40% {
            opacity: 1;
        }
        100% {
            width: 200%;
            height: 200%;
            opacity: 0;
        }
    }


</style>
<script>

    require('../../assets/examples/css/dashboard/team.min.css');


    var infiniteScroll = require('vue-infinite-scroll').infiniteScroll;
    require("dropzone/dist/min/dropzone.min.css")
    var Dropzone = require("dropzone/dist/min/dropzone-amd-module.min")
    import Navbar from './Navbar'
    import Sitebar from './Sitebar'
    import {whatever, api} from "../../utils/leven"
    import  vuestrapBase from  'vuestrap-base-components/dist/vuestrapBase.min'
    import lazyload from 'vue-lazyload'
    import {WallUrl} from '../../config.js'

    import Vue from "vue";
    Vue.use(lazyload)
    export default{

        components: {Navbar, Sitebar, 'vs-modal': vuestrapBase.modal},
        data(){
            return {

                user:{},

            }

        },
        methods: {
            start: function () {

                 this.get_userinfo();
                  this.$parent.hideLoading();
                window.Site.cc();
                window.AppNoteBook = Site.extend({
                    handleHeight: function () {
                        var height = $(document).height()
                        console.log(height)


                        $(".page-main").css("height", (height - 70) + "px")
                    }, handleResize: function () {
                        var self = this;
                        $(window).on("resize", function () {
                            self.handleHeight()
                        })
                    }, run: function (next) {
                        this.handleHeight(), this.handleResize()
                    }
                }),

                  AppNoteBook.run()
            },
              get_userinfo: function () {


                var _vm = this;

                api(_vm).get(_vm.app.api + '/user/profile' ).then(function (res) {
                    var data=res.data

                    _vm.user=data;
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
            go_wechat:function(){

            window.open("https://mp.weixin.qq.com/cgi-bin/loginpage?t=wxm2-login&lang=zh_CN")
            }


        }
        ,ready:function(){


                $("body").css({"padding-top":"110px"})
                if(this.$route.query.token){

                    this.gettoken(this.start);
                }else{
                    this._init(this.start);
                }


        }
    }


</script>
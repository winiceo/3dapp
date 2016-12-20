<template>

    <Navbar></Navbar>

    <div class="page animsition">

        <div class="row" v-if="authorizer!=false" data-plugin="matchHeight" data-by-row="true">


            <div class="col-lg-12 col-md-12" style="height: 190px;"  >
                <div class="widget widget-shadow">
                    <div class="widget-header bg-blue-grey-600 text-center padding-30 padding-bottom-15">
                        <div class="font-size-20 white">您的公众号授权成功</div>
                        <div class="grey-300 font-size-14 margin-bottom-20">

                            <img :src="authorizer.head_img">
                            <br>
                            {{authorizer.nick_name}}

                        </div>

                    </div>
                </div>
                <a href="#"  @click='set_wechat'>改用手动配置公众号方式</a>
            </div>




        </div>
        <div class="row" v-if="authorizer==false" data-plugin="matchHeight" data-by-row="true">


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


</template>
<style>


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
                authorizer:false
            }

        },
        methods: {
            start: function () {

                // this.get_wechat();
                this.get_userinfo();
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
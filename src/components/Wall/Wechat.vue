<template>

    <Navbar></Navbar>

    <div class="page animsition" v-cloak>


        <div style="padding-left:50px">
            <Row>
                <i-col span="3"><i-button type="primary" @click="get_wechat_one">一键授权</i-button></i-col>
                <i-col span="3" @click="newwechat=true"> <i-button type="ghost">新增公众号</i-button></i-col>
                <i-col span="18" v-show="newwechat"><Tooltip >
                <i-input :value.sync="item.name" placeholder="公众号名字" style="width: 300px"></i-input> <i-button type="ghost" @click="save">保存</i-button><i-button type="ghost" @click="help">使用说明</i-button>

                    <div slot="content">
                        <p>新增后，系统会在下边列表显示</p>
                        <p>配置的url和token,复制的到微信后台即可</p>

                    </div>
                </Tooltip>
                </i-col>
            </Row>
            </div>

        <Row>
            <i-col span="24"> <div class="mytable">

                <Row>
                    <i-col span="24">

                        <Card :bordered="false">
                            <i-table border :content="self" :columns="columns1" :data="userinfo.wxoas_config"></i-table>
                        </Card>
                    </i-col>
                      </Row>

            </div>

            </i-col>

        </Row>


    </div>


</template>
<style>
.mytable{

background:#eee;padding: 20px;color:black;
}
.mytable table th {

     color: black;
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
                item:{},
                user:{},
                self: this,
                update:false,
                newwechat:false,
                userinfo:{},
                columns1: [
                    {
                        title: '图像',
                        key: 'head_img',
                        render (row, column, index) {
                            return `<img src=${row.data.head_img} width=80 height=80>`;
                        }
                    },
                    {
                        title: '名称',
                        key: 'name',
                        render (row, column, index) {
                            return `<input type=text value=${row.name} id="name${index}"  >`;
                        }
                    },
                    {
                        title: 'token',
                        key: 'key',
                        render (row, column, index) {
                            return `${row.data.wxoas_token}`;
                        }
                    },{
                        title: 'url',
                        key: 'url',
                        render (row, column, index) {
                            return `${row.data.wxoas_url}`;
                        }
                    },

                     {
                        title: '类型',
                        key: 'type',
                        render (row, column, index) {
                            return `${row.data.type==1?"一键授权":"绑定"}`;
                        }
                    },
                    {
                        title: '操作',
                        key: 'action',
                        width: 150,
                        align: 'center',
                        render (row, column, index) {
                            return `<i-button type="primary" size="small" @click="updateName(${index})">修改名称</i-button> `;
                        }
                    }
                ],

            }

        },
        methods: {
            start: function () {
                var _vm=this;
                  _vm.getuserinfo(function(userinfo){
                    _vm.userinfo=userinfo
                    console.log(userinfo)
                })
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

            updateName:function(index){
                this.userinfo.wxoas_config[index].name=$("#name"+index).val()
                this.item=this.userinfo.wxoas_config[index]
                this.update=true
                this.save()
            },


            save:function(){
                var _vm=this;
                 var action=this.update?"update":"new"
                 fetch(_vm.app.api + '/user/wxoas/'+action, {
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
                }).then(function (docs) {


                    _vm.getuserinfo(function(userinfo){
                        _vm.userinfo=userinfo
                        console.log(userinfo)
                    })
                    toastr.info('保存成功')



                });

            },

            get_wechat_one: function () {


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
            },

             help:function(){
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
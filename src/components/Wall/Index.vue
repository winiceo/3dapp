<template>

    <Navbar   v-if="!nochrome"></Navbar>
    <div v-if="!nochrome" class="site-menubar site-menubar-light">
        <div class="site-menubar-body">
            <div>
                <div>
                    <div class="nav-button example-buttons">
                        <button type="button" class="btn btn-outline btn-default" @click="calldata(-1)">全部活动</button>
                        <button type="button" class="btn btn-outline btn-default" @click="calldata(0)">未开始</button>
                        <button type="button" class="btn btn-outline btn-default" @click="calldata(1)">进行中</button>
                        <button type="button" class="btn btn-outline btn-default" @click="calldata(2)">已结束</button>

                        <button type="button" class="btn btn-default btn-outline pull-right" v-link="'usercenter'">
                            创建新活动
                        </button>
                    </div>

                </div>
            </div>
        </div>
    </div>

    <div class="row" v-if="nochrome">
        <div class="col-sm-2">

        </div>
        <div class="col-sm-8">
            <div class="panel panel-bordered panel-danger">
                <div class="panel-heading">
                    <h3 class="panel-title">友情提醒</h3>
                </div>
                <div class="panel-body">
                    <p>你当前不是使用的chrome浏览器，请切换至chrome浏览器。</p>

                    <p class="chrm-tip2">如果你还没有安装，请前往<a target="_blank" class="browser-chrome" href="http://rj.baidu.com/soft/detail/14744.html?ald">下载chrome</a>谷歌浏览器</p>
                </div>
            </div>
        </div>
        <div class="col-sm-2">

        </div>


    </div>

    <div class="page animsition">



        <div v-if="!nochrome" v-show="items.length>0" class="page-content container-fluid lt-body bg-primary-100 text-center padding-20 "
             v-infinite-scroll="loadMore()" infinite-scroll-disabled="busy"
             infinite-scroll-distance="100">
            <div class="col-md-12 col-lg-12">
                <div id="recentActivityWidget" class="widget widget-shadow padding-bottom-20">

                    <ul class="timeline timeline-icon">
                        <template v-for="(index,item) in items">

                            <li class="timeline-reverse">
                                <div class="timeline-content-wrap">
                                    <div class="timeline-dot " :class="item.free? 'bg-gree-600':'bg-red-600'">
                                        <i class="icon wb-chat" aria-hidden="true"></i>
                                    </div>
                                    <div class="timeline-content">
                                        <div class="row myrow">
                                            <div class="widget widget-shadow text-center">
                                                <div class="widget-content">
                                                    <div class="row no-space">

                                                        <div class="col-xs-6">

                                                            <div class="bg-blue-grey-700 white vertical-align height-200">
                                                                <span v-if="item.free==false" class="badge up badge-danger">已付费</span>
                                                                <span v-if="item.free==true" class="badge up label-gree">免费</span>

                                                                <div class="vertical-align-middle">
                                                                    <div class="font-size-40">

                                                                        <span class="font-size-30">{{item.name}}</span>
                                                                    </div>
                                                                    <div class="font-size-10">
                                                                        {{item.start_at}}~{{item.end_at}}
                                                                    </div>
                                                                    <div class="font-size-10">
                                                                        <ul class="operates">

                                                                            <li>

                                                                                <button class="btn btn-outline btn-danger btn-round" @click="removeItem=item;"
                                                                                        data-animation="scale-up" data-target="#remove_activty"
                                                                                        data-toggle="modal">删除</button>
                                                                            </li>
                                                                        </ul>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div class="col-xs-6">
                                                            <div class="bg-white height-200">

                                                                <div class="row no-space vertical-align">
                                                                    <template v-for="(n,act) in acts">

                                                                        <div class="col-sm-4"
                                                                             @click="openurl(item,act)"
                                                                        >


                                                                            <div class="counter counter-lg counter-inverse  vertical-align height-100"
                                                                                 :class="act.color">
                                                                                <div class="vertical-align-middle">
                                                                                    <div class="counter-icon margin-bottom-5">
                                                                                        <i class="icon "
                                                                                           :class="act.icon"
                                                                                           aria-hidden="true"></i></div>
                                                                                    <span class="counter-number"  >{{act.text}}</span>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </template>


                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </li>

                        </template>
                    </ul>
                </div>
            </div>

        </div>
        <div class="page-content container-fluid lt-body bg-primary-100 text-center padding-20" v-show="nodata">

            <div class="widget">


                暂时没有更多数据


            </div>
        </div>


        <!-- End Create New Notes Modal -->


        <!--contextMenu END-->

    </div>




    <!-- Modal -->
    <div class="modal fade modal-super-scaled" id="remove_activty" aria-hidden="true"
         aria-labelledby="exampleModalTitle" role="dialog" tabindex="-1">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">×</span>
                    </button>
                    <h4 class="modal-title">确认要删除吗</h4>
                </div>
                <div class="modal-body">
                    <p style="text-align:center;font-size:20px">{{removeItem.title}}</p>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-default margin-0" data-dismiss="modal" @click="remove">确定
                    </button>
                    <button type="button" class="btn btn-primary" data-dismiss="modal">取消</button>

                </div>
            </div>
        </div>
    </div>

    <div class="modal fade modal-super-scaled" id="control_activty" aria-hidden="true"
         aria-labelledby="exampleModalTitle" role="dialog" tabindex="-1">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">×</span>
                    </button>
                    <h4 class="modal-title">控制台地址</h4>
                </div>
                <div class="modal-body" style="text-align:center">
                    <p>
                    <a class="" href="javascript:void(0)">

                        <img    v-lazy="item.control_url" width=200>
                    </a>
                    </p>

                        <div class="form-group vertical-align-middle" style='text-align:center'>
                            <input type="text" class="form-control" style="    width: 400px;" value="{{item.control_url_web}}"  >
                        </div>


                </div>
                <div class="modal-footer">

                    <button type="button" class="btn btn-primary" data-dismiss="modal">取消</button>

                </div>
            </div>
        </div>
    </div>






    <div class="modal fade modal-super-scaled" id="copy_activty" aria-hidden="true"
         aria-labelledby="exampleModalTitle" role="dialog" tabindex="-1">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">×</span>
                    </button>
                    <h4 class="modal-title">确认要删除吗</h4>
                </div>
                <div class="modal-body">
                    <div class="row">
                        <div class="col-lg-4 form-group">
                            <input type="text" class="form-control" name="firstName" placeholder="First Name">
                        </div>
                        <div class="col-lg-4 form-group">
                            <input type="email" class="form-control" name="lastName" placeholder="Last Name">
                        </div>
                        <div class="col-lg-4 form-group">
                            <input type="email" class="form-control" name="email" placeholder="Your Email">
                        </div>
                        <div class="col-lg-12 form-group">
                            <textarea class="form-control" rows="5" placeholder="Type your message"></textarea>
                        </div>
                        <div class="col-sm-12 pull-right">
                            <button class="btn btn-primary btn-outline" data-dismiss="modal" type="button">Add Comment</button>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    </div>

    <div class="modal fade modal-super-scaled" id="wall_activty" aria-hidden="true"
         aria-labelledby="exampleModalTitle" role="dialog" tabindex="-1">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">×</span>
                    </button>
                    <h4 class="modal-title">上墙地址</h4>
                </div>
                <div class="modal-body" style="text-align:center">
                    <div class="widget-header ">

                        <div class="   vertical-align">
                            <div class="vertical-align-middle">
                                <a class="" href="javascript:void(0)">

                                    <img    v-lazy="item.wx_address" width=200>
                                </a>
                                <div class="font-size-20 margin-top-10">
                                    <div class="form-group">
                                        <input type="text" class="form-control" style="    width: 400px;" value="{{item.wx_url}}"  >
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="widget-content">

                        登录微信公众平台，把“上墙地址”设置到“自动回复”或“自定义菜单”，这样可使参与活动的人员必须先关注您的微信公众号哦！

                    </div>
                </div>
                <div class="modal-footer">

                    <button type="button" class="btn btn-primary" data-dismiss="modal">取消</button>

                </div>
            </div>
        </div>
    </div>


</template>
<style>

    .badge.up {
    position: absolute;
    top: 5px;
    left:10px;
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
.label-gree{
background-color: #62a8ea;
color:white;

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
    import {WallUrl,NoticeUrl} from '../../config.js'

    import Vue from "vue";
    Vue.use(lazyload)
    export default{
        directives: {infiniteScroll},
        components: {Navbar, Sitebar},
        data(){
            return {
            nochrome:false,
                showScreen:false,
                token: '',
                status: -1,
                removeItem:{},
                copyItem:{},
                count: 0,
                next: 1,
                busy: false,
                items: [],
                item: {},
                nomore:false,
                acts: [
                    {text: "活动功能", icon: "wb-extension", url: "/app/admin.html", color: "bg-red-600",case:''},
                    {text: "活动数据", icon: "wb-table", url: "/app/static.html", color: "bg-green-600",case:''},
                    {text: "上墙地址", icon: "wb-map", url: "modal1", target: "modal", color: "bg-orange-600",case:"wechatwall"},
                    {text: "大屏幕", icon: "wb-grid-9", url: WallUrl,target:"_blank", color: "bg-indigo-600",case:"wall"},
                    {text: "屏幕控制台", icon: "wb-hammer", url: "", color: "bg-purple-600",case:"control" },
                    {text: "消息审核", icon: "wb-pencil", url: NoticeUrl,target:"_blank", color: "bg-blue-600",case:'notice'}


                ]
            }

        },
        methods: {
            start: function () {


                if(this.app.api!=""){
                    this.calldata(-1);
                }
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

            openurl: function (item, act) {
                var self=this;
                this.item=item;
                if(act.case=="wechatwall"){
                    $('#wall_activty').modal()
                    return;
                }
                if(act.case=="control"){
                    this.item=item;
                    $('#control_activty').modal()

                    return;
                }

                if(act.url){
                    if(act.target=="_blank"){
                       console.log(act.url + "?id=" + item.id+"&token="+self.app.token)
                        window.open(act.url + "?id=" + item.id+"&token="+self.app.token)

                    }else{
                        window.location.href=(act.url + "?id=" + item.id)

                    }
                }
//                if (act.target == "modal") {
//
//                    this.item = item;
//                    setTimeout(function(){
//
//                        self.$broadcast('show::modal', act.url)
//                    },10)
//
//                } else {
//
//                    if(act.case=="control1"){
//                        this.item=item;
//                        $('#control_activty').modal()
////                        this.item = item;
////                        setTimeout(function(){
////
////                            self.$broadcast('show::modal', act.url)
////                        },10)
////
////                        window.open(item.control_url +"&token="+self.app.token)
//                        return;
//                    }
//                    if(act.url){
//                        if(act.target=="_blank"){
//                            window.open(act.url + "?id=" + item.id+"&token="+self.app.token)
//
//                        }else{
//                            window.location.href=(act.url + "?id=" + item.id)
//
//                        }
//                    }
//                }
            },

            selected: function (item) {
                console.log(item.toJSON())
                this.item = item.toJSON();
            },
            remove: function (index, item) {
                var index = this.removeIndex, item = this.removeItem;
                console.log(index, item)
                //this.item.delete(index)
                var _vm = this;
                //this.items.splice(item, 1)
                api(_vm).post(_vm.app.api + '/activity/delete/' + item.id).then(function (item) {
                    _vm.items = _.filter(_vm.items, function (o) {
                        return o.id != _vm.removeItem.id;
                    });



                    console.log(item);
                    toastr.info('删除成功')

                });
            },
            calldata: function (status) {
                this.status = status;
                this.next = 1;
                this.$set("nodata", false);
                this.items = [];
               

                this.getdata();
            },

            getdata: function () {


                var _vm = this;
                _vm.$parent.showLoading();
                var data = {
                    next: this.next,
                    status: this.status
                }

                var p="next="+this.next+"&status"+this.status
                if(_vm.app.api==""){
                    return ;
                }
                //console.log(u)
                //alert(_vm.app.api + '/activities?' + p)
                api(_vm).get(_vm.app.api + '/activities?' + p).then(function (docs) {
                    //alert(docs)
                    _vm.$parent.hideLoading();
                    console.log(docs)
                    if(docs.length==0||!docs){
                        _vm.nomore=true;

                        return false;
                    }
                    _.forEach(docs, function (o) {

                        _vm.items.push(o)

                    });


                    _vm.busy = false;
                    if (_vm.items.length == 0) {
                        _vm.busy = true;
                        _vm.nomore=true;
                        _vm.$set("nodata", true);
                    } else {
                        _vm.$set("nodata", false);
                    }
                    _vm.$parent.hideLoading();


                });


            },
            loadMore: function () {
                if(this.nomore){return}
                this.busy = true;
                this.next += 1;
                //console.log(this.next)
                this.getdata();

            }
        }
        ,ready:function(){
            var _vm=this;

            if (navigator.userAgent.indexOf("Chrome") > -1||navigator.userAgent.indexOf("Safari") > -1){
              $("body").css({"padding-top":"110px"})
                if(this.$route.query.token){

                    _vm.gettoken(_vm.start);
                }else{
                    _vm._init(_vm.start);
                }



            }else{
                this.nochrome=true;
                this.$parent.hideLoading();

            }



        }
    }
</script>
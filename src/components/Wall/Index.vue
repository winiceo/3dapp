<template>

    <Navbar></Navbar>
    <div class="site-menubar site-menubar-light">
        <div class="site-menubar-body">
            <div>
                <div>
                    <div class="nav-button example-buttons">
                        <button type="button" class="btn btn-outline btn-default" @click="calldata(-1)">全部活动</button>
                        <button type="button" class="btn btn-outline btn-default" @click="calldata(0)">未开始</button>
                        <button type="button" class="btn btn-outline btn-default" @click="calldata(1)">进行中</button>
                        <button type="button" class="btn btn-outline btn-default" @click="calldata(2)">已结束</button>

                        <button type="button" class="btn btn-default btn-outline pull-right" v-link="'new_activity'">创建新活动</button>
                    </div>

                </div>
            </div>
        </div>
    </div>
    <div class="page animsition">


        <div v-show="items.length>0" class="page-content container-fluid lt-body bg-primary-100 text-center padding-20 "
             v-infinite-scroll="loadMore()" infinite-scroll-disabled="busy"
             infinite-scroll-distance="100">
            <div class="col-xlg-4 col-md-12">
                <div id="recentActivityWidget" class="widget widget-shadow padding-bottom-20">

                    <ul class="timeline timeline-icon">
                        <template v-for="(index,item) in items">

                            <li class="timeline-reverse">
                                <div class="timeline-content-wrap">
                                    <div class="timeline-dot bg-green-600">
                                        <i class="icon wb-chat" aria-hidden="true"></i>
                                    </div>
                                    <div class="timeline-content">
                                        <div class="row myrow">
                                            <div class="widget widget-shadow text-center">
                                                <div class="widget-content">
                                                    <div class="row no-space">
                                                        <div class="col-xs-6">
                                                            <div class="bg-blue-grey-700 white vertical-align height-200">
                                                                <div class="vertical-align-middle">
                                                                    <div class="font-size-40">

                                                                        <span class="font-size-30">{{item.title}}</span>
                                                                    </div>
                                                                    <div class="font-size-10">
                                                                        {{item.start_at}}~{{item.end_at}}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div class="col-xs-6">
                                                            <div class="bg-white height-200">

                                                                <div class="row no-space vertical-align">
                                                                    <template v-for="(n,act) in acts">

                                                                        <div class="col-sm-4"
                                                                             @click="openurl(act.url,item.id)">
                                                                            <div class="counter counter-lg counter-inverse  vertical-align height-100"
                                                                                 :class="act.color">
                                                                                <div class="vertical-align-middle">
                                                                                    <div class="counter-icon margin-bottom-5">
                                                                                        <i class="icon "
                                                                                           :class="act.icon"
                                                                                           aria-hidden="true"></i></div>
                                                                                    <span class="counter-number">{{act.text}}</span>
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


</template>
<style>

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
    import {whatever, checkStatus} from "../../utils/leven"

    export default{
        directives: {infiniteScroll},
        components: {Navbar, Sitebar},
        data(){
            return {
                token: '',
                status:-1,

                count: 0,
                next: 1,
                busy: false,
                items: [],
                item: {},
                acts: [
                    {text: "屏幕设计", icon: "wb-pencil", url: "/app/logo.html", color: "bg-blue-600"},
                    {text: "活动功能", icon: "wb-extension", url: "/app/admin.html", color: "bg-red-600"},
                    {text: "屏幕控制台", icon: "wb-hammer", url: "", color: "bg-purple-600"},
                    {text: "活动数据", icon: "wb-table", url: "", color: "bg-green-600"},
                    {text: "上墙地址", icon: "wb-map", url: "", color: "bg-orange-600"},
                    {text: "大屏幕", icon: "wb-grid-9", url: "/wallmain.html", color: "bg-indigo-600"},


                ]
            }

        },
        methods: {
            init: function () {
                window.Site.cc();
                this.calldata(-1);
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
            calldata:function(status){
              this.status=status;
              this.next=1;
              this.$set("nodata",false);
              this.items=[];
              this.getdata();
            },

            getdata: function () {


                var _vm = this;
                _vm.$parent.showLoading();
                var data={
                    next:this.next,
                    status:this.status
                }
                var u = new URLSearchParams();
                u.append('next', this.next);
                u.append('status', this.status);

                fetch(_vm.app.api + '/activities?'+u, {
                    method: 'GET',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                        'Authorization': _vm.app.token
                    }


                }).then(checkStatus).then(function (response) {
                    if (response.status >= 400) {
                        throw new Error("Bad response from server");
                    }

                    return response.json();
                }).then(function (docs) {

                    console.log(docs);

                    _.forEach(docs, function (o) {

                        _vm.items.push(o)

                    });


                    _vm.busy = false;
                    if (_vm.items.length == 0) {
                        _vm.busy = true;
                        _vm.$set("nodata",true);
                    }else{
                        _vm.$set("nodata",false);
                    }
                    _vm.$parent.hideLoading();



                });


            },
            loadMore: function () {

                this.busy = true;
                this.next += 1;
                console.log(this.next)
                this.getdata();

            }
        }

    }
</script>
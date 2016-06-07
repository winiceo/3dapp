<template>

    <Navbar></Navbar>
    <Sitebar></Sitebar>
    <div class="page animsition">


        <div class="page-content container-fluid lt-body bg-primary-100 text-center padding-20 "
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

                                                                        <div class="col-sm-4" @click="openurl(act.url)">
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


        <!-- End Create New Notes Modal -->


        <!--contextMenu END-->

    </div>


</template>
<style>


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


    var Parse = require("parse");
    Parse.initialize("71an.com", "71an.com");
    Parse.serverURL = ("http://baas.71an.com:8043/parse");
    //Parse.User.logIn("leven", "56os.com", {
    //    success: function(user) {
    //        console.log(user)
    //        // Do stuff after successful login.
    //    },
    //    error: function(user, error) {
    //        // The login failed. Check error to see why.
    //    }
    //});
    var infiniteScroll = require('vue-infinite-scroll').infiniteScroll;
    require("../../bower_components/dropzone/dist/min/dropzone.min.css")
    var Dropzone = require("../../bower_components/dropzone/dist/min/dropzone-amd-module.min")
    import {API_ROOT, Token} from '../../config.js'

     import Navbar from './Navbar'
     import Sitebar from './Sitebar'

    export default{
        directives: {infiniteScroll},
        components: {Navbar, Sitebar},
        data(){
            return {
                baseUrl: API_ROOT,
                imgUrl: API_ROOT + "/upload/",
                count: 0,
                skip: 0,
                busy: false,
                items: [],
                item: {},
                acts: [
                    {text: "屏幕设计", icon: "wb-pencil", url: "", color: "bg-blue-600"},
                    {text: "活动功能", icon: "wb-extension", url: "/app/admin.html", color: "bg-red-600"},
                    {text: "屏幕控制台", icon: "wb-hammer", url: "", color: "bg-purple-600"},
                    {text: "活动数据", icon: "wb-table", url: "", color: "bg-green-600"},
                    {text: "上墙地址", icon: "wb-map", url: "", color: "bg-orange-600"},
                    {text: "大屏幕", icon: "wb-grid-9", url: "/front/index.html", color: "bg-indigo-600"},


                ]
            }

        },
        methods: {
            openurl: function (url) {
                window.open(url + "?id=1")
            },

            selected: function (item) {
                console.log(item.toJSON())
                this.item = item.toJSON();
            },
            remove: function (index, item) {
                console.log(index, item)
                //this.item.delete(index)

                this.items.splice(item, 1)
                item.destroy({
                    success: function (o) {
                        console.log(o)
                        // The object was deleted from the Parse Cloud.
                    },
                    error: function (o, error) {
                        // The delete failed.
                        // error is a Parse.Error with an error code and message.
                        console.log(error)
                    }
                });
            },
            newPoll: function () {
                this.item = {
                    title: '',
                    options: [
                        {pic: "", title: ""},
                        {pic: "", title: ""}
                    ]
                }
                var _vm = this;
                setTimeout(function () {
                    _vm.setup();
                }, 500)

            },
            save_poll: function () {
                var _vm = this;

                var Polls = Parse.Object.extend("Polls");
                var poll = new Polls(this.item);
                poll.save(null, {
                    success: function (poll) {
                        console.log(poll)
                        _vm.items.unshift(poll)
                    }
                })
            },
            getdata: function () {


                var _vm = this;

                fetch(API_ROOT + '/activities', {
                    method: 'GET',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                        'Authorization': Token
                    }

                }).then(function (response) {
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
                    if (docs.length == 0) {
                        _vm.busy = true;
                    }


                });


            },
            loadMore: function () {
                this.busy = true;
                this.skip += 10;
                console.log(this.skip)
                // this.getdata();

            },

            setup: function () {
                var _vm = this;
                // alert($(".imgUpload").size())
                $(".dropzone").each(function () {
                    var that = this;
                    console.log(234234)
                    $(that).dropzone({
                        url: "/upload",
                        dictDefaultMessage: $(that).data("title"),
                        maxFiles: 1,
                        init: function () {
                            //alert($(that).data("field"))

                            this.on("success", function (file, response) {
                                $('.dz-progress').hide();
                                $('.dz-size').hide();
                                $('.dz-error-mark').hide();
                                console.log(response);
                                console.log(file);

                                _vm.item[$(that).data("field")] = response.name


                                //$(".dz-message").show("slow")

                            });
                            this.on("addedfile", function (file) {
                                var removeButton = Dropzone.createElement("<a href=\"#\">删除</a>");
                                var _this = this;
                                removeButton.addEventListener("click", function (e) {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    _this.removeFile(file);
//                                var name = "largeFileName=" + cd.pi.largePicPath + "&smallFileName=" + cd.pi.smallPicPath;
//                                $.ajax({type: 'POST', url: 'DeleteImage', data: name, dataType: 'json'});
                                });
                                file.previewElement.appendChild(removeButton);
                            });

                        }

                    });
                })
            },
        },

        ready(){

            this.getdata();
            window.Site.cc();
//      window.AppNoteBook = App.extend({
//        handleHeight: function () {
//          var height = $(document).height()
//          console.log(height)
//
//
//          $(".page-main").css("height", (height - 120) + "px")
//        }, handleResize: function () {
//          var self = this;
//          $(window).on("resize", function () {
//            self.handleHeight()
//          })
//        }, run: function (next) {
//          this.handleHeight(), this.handleResize()
//        }
//      }),
//              AppNoteBook.run()

            Dropzone.autoDiscover = false;


        }
    }
</script>
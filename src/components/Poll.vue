<template>
    <div class="page animsition">
        <!-- Notebook Sidebar -->
        <div class="page-aside">
            <div class="page-aside-switch">
                <i class="icon wb-chevron-left" aria-hidden="true"></i>
                <i class="icon wb-chevron-right" aria-hidden="true"></i>
            </div>
            <div class="page-aside-inner">
                <div class="input-search">
                    <button class="input-search-btn" type="submit">
                        <i class="icon wb-search" aria-hidden="true"></i>
                    </button>
                    <form>
                        <input class="form-control" type="text" placeholder="Search Keyword" name="">
                    </form>
                </div>

                <div class="app-notebook-list " data-plugin="pageAsideScroll">
                    <div data-role="container">
                        <div data-role="content">
                            <ul class="list-group" v-infinite-scroll="loadMore()" infinite-scroll-disabled="busy"
                                infinite-scroll-distance="100">
                                <template v-for="(index,item) in items">

                                    <li class="list-group-item active  " @click="selected(item)"  >
                                         <h4 class="list-group-item-heading">{{item.get("title")}}</h4>

                                        <div class="info">
                                            <span class="icon wb-trash "  @click="remove(index,item)"
                                                  data-animation="scale-up"></span>
                                             <span class="time">Dec 12th, 7:35 am</span>


                                        </div>


                                    </li>
                                </template>

                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!-- End Notebook Sidebar -->

        <div class="page-main">
            <div class="page-content">
                <div class="panel">
                    <div class="panel-body container-fluid">
                        <div class="row row-lg">
                            <div class="col-sm-12 col-md-12">
                                <!-- Example Horizontal Form -->
                                <div class="example-wrap">
                                    <h4 class="example-title">配置</h4>

                                    <div class="example">


                                        <div class="form-group">
                                            <label class="col-sm-2 control-label">题目: </label>
                                            <div class="col-sm-10">
                                                <input type="text" class="form-control" v-model="item.title"
                                                >
                                                <div class="radio-custom radio-default radio-inline">
                                                    <input type="radio" id="inputHorizontalMale"
                                                           name="inputRadiosMale2">
                                                    <label for="inputHorizontalMale">单选</label>
                                                </div>
                                                <div class="radio-custom radio-default radio-inline">
                                                    <input type="radio" id="inputHorizontalFemale"
                                                           name="inputRadiosMale2" checked="">
                                                    <label for="inputHorizontalFemale">多选</label>
                                                </div>
                                            </div>
                                        </div>
                                        <template v-for="option in item.options">

                                            <div class="form-group row">
                                                <label class="col-sm-2 control-label">选项: </label>
                                                <div class="col-sm-10">
                                                    <div class="col-sm-4">

                                                        <div class="dropzone" data-title="上传图片">
                                                            <img v-if="item.options.pic" :src="imgUrl+item.options.pic"
                                                                 width="50"
                                                                 height="50">
                                                        </div>
                                                    </div>
                                                    <div class="col-sm-8">

                                                        <input type="text" class="form-control" v-model="option.title"
                                                        >

                                                    </div>
                                                </div>

                                            </div>
                                        </template>
                                        <div class="form-group">
                                            <label class="col-sm-3 control-label">添加选项: </label>
                                            <div class="col-sm-9">


                                            </div>
                                        </div>


                                        <div class="form-group">
                                            <div class="col-sm-9 col-sm-offset-3">
                                                <button type="button" @click="save_poll"
                                                        class="btn btn-primary save_poll">保存
                                                </button>
                                                <button type="reset" class="btn btn-default btn-outline">预览</button>
                                            </div>
                                        </div>


                                    </div>
                                </div>
                                <!-- End Example Horizontal Form -->
                            </div>


                        </div>
                    </div>
                </div>


            </div>

        </div>


        <!-- Site Action -->
        <div class="site-action">
            <button type="button" @click="newPoll()"
                    class="site-action-toggle btn-raised btn btn-success btn-floating ">
                <i class="front-icon wb-plus animation-scale-up" aria-hidden="true"></i>
                <i class="back-icon wb-close animation-scale-up" aria-hidden="true"></i>
            </button>

        </div>
        <!-- End Site Action -->


        <!-- End Create New Notes Modal -->



        <!--contextMenu END-->

    </div>

    <!-- Footer -->
    <footer class="site-footer">
        <div class="site-footer-legal">© 2016 <a
                href="http://themeforest.net/item/remark-responsive-bootstrap-admin-template/11989202">Remark</a></div>
        <div class="site-footer-right">
            Crafted with <i class="red-600 wb wb-heart"></i> by <a href="http://themeforest.net/user/amazingSurge">amazingSurge</a>
        </div>
    </footer>

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
        background: rgba(255,255,255,.2);
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
    figure:hover+span {
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

    require('../assets/examples/css/apps/notebook.min.css');
    require('../global/vendor/slidepanel/slidePanel.min.css');
    require('../global/vendor/slidepanel/jquery-slidePanel.min.js');
    require('../global/vendor/bootstrap-contextmenu/bootstrap-contextmenu');


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
    require("../bower_components/dropzone/dist/min/dropzone.min.css")
    var Dropzone = require("../bower_components/dropzone/dist/min/dropzone-amd-module.min")
    import {API_ROOT} from '../config.js'


    export default{
        directives: {infiniteScroll},
        data(){
            return {
                baseUrl: API_ROOT,
                imgUrl: API_ROOT + "/upload/",
                count: 0,
                skip: 0,
                busy: false,
                items: [],
                item: {}
            }
        },
        methods: {
            selected: function (item) {
                console.log(item.toJSON())
                this.item = item.toJSON();
            },
            remove:function(index,item){
                console.log(index,item)
                //this.item.delete(index)

                this.items.splice(item, 1)
                item.destroy({
                    success: function(o) {
                        console.log(o)
                        // The object was deleted from the Parse Cloud.
                    },
                    error: function(o, error) {
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
                var Polls = Parse.Object.extend("Polls");


                var query = new Parse.Query(Polls);

                // Retrieve the most recent ones
                query.descending("createdAt");

                // Only retrieve the last ten
                query.limit(10);

                query.skip(_vm.skip)
                query.find({
                    success: function (polls) {
                        _.forEach(polls, function (o) {
                            _vm.items.push(o)
                        });

                        _vm.busy = false;
                        if (polls.length == 0) {
                            _vm.busy = true;
                        }
                    }
                });

            },
            loadMore: function () {
                this.busy = true;
                this.skip += 10;
                console.log(this.skip)
                this.getdata();

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
            window.AppNoteBook = App.extend({
                handleHeight: function () {
                    var height = $(document).height()
                    console.log(height)


                    $(".page-main").css("height", (height - 120) + "px")
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

            Dropzone.autoDiscover = false;
            this.newPoll()

        }
    }
</script>
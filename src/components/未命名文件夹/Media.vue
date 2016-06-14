<template>
         <div class="page bg-white animsition" style="animation-duration: 800ms; opacity: 1;">
            <!-- Media Sidebar -->
            <div class="page-aside">
                <div class="page-aside-switch">
                    <i class="icon wb-chevron-left" aria-hidden="true"></i>
                    <i class="icon wb-chevron-right" aria-hidden="true"></i>
                </div>
                <div class="page-aside-inner scrollable is-enabled scrollable-vertical" data-plugin="pageAsideScroll"
                     style="position: relative;">
                    <div data-role="container" class="scrollable-container" style="height: 689px; width: 259px;">
                        <div data-role="content" class="scrollable-content" style="width: 259px;">

                            <section class="page-aside-section">


                                <h5 class="page-aside-title">分类</h5>
                                <div class="list-group">
                                    <a class="list-group-item" href="javascript:void(0)" @click="select(1)"><i
                                            class="icon wb-image"
                                            aria-hidden="true"></i>图片</a>
                                    <a class="list-group-item" href="javascript:void(0)" @click="select(2)"><i
                                            class="icon wb-volume-high"
                                            aria-hidden="true"></i>音乐</a>
                                    <a class="list-group-item" href="javascript:void(0)" @click="select(3)"><i
                                            class="icon wb-camera"
                                            aria-hidden="true"></i>视频</a>


                                </div>
                            </section>
                        </div>
                    </div>
                    <div class="scrollable-bar scrollable-bar-vertical is-disabled scrollable-bar-hide"
                         draggable="false">
                        <div class="scrollable-bar-handle"></div>
                    </div>
                </div>
            </div>

            <!-- Media Content -->
            <div class="page-main">

                <!-- Media Content Header -->


                <!-- Media Content -->
                <div class="page-content page-content-table" data-selectable="selectable">



                    <!-- Media -->
                    <div class="media-list is-grid padding-bottom-50">
                        <ul class="blocks blocks-100 blocks-xlg-4 blocks-lg-3 blocks-md-3 blocks-ms-2 blocks-xs-2"
                            data-plugin="animateList" data-child=">li">
                            <li class="animation-scale-up"
                                style="animation-fill-mode: backwards; animation-duration: 250ms; animation-delay: 0ms;">
                                <div class="media-item" data-toggle="slidePanel" data-url="panel.tpl">
                                    <form action="{{baseUrl}}/api/upload" class="dropzone thumbnail"
                                          style="margin:10px;"
                                          id="my-awesome-dropzone" enctype="multipart/form-data">

                                        <input type="hidden" name="cate" value="{{cate}}">
                                        <input type="hidden" name="default" value="0">
                                        <div class="fallback">

                                        </div>
                                    </form>
                                </div>
                            </li>
                            <template v-for="item in items">
                                <li class="animation-scale-up"
                                    style="animation-fill-mode: backwards; animation-duration: 250ms; animation-delay: 0ms;">
                                    <div class="media-item   " :class="{ 'bg-teal-600': item.default  }" data-toggle="slidePanel" data-url="panel.tpl">
                                        <div class="checkbox-custom checkbox-primary checkbox-lg">
                                            <input type="checkbox" class="selectable-item" id="media_1">
                                            <label for="media_1"></label>
                                        </div>
                                        <div class="image-wrap" >
                                            <figure class="overlay overlay-hover animation-hover">
                                                <img class="image img-rounded overlay-figure overlay-scale" style="height:200px;width:200px;"
                                                     :src="imgUrl+item.name"
                                                     alt="...">
                                                 <figcaption class="overlay-panel overlay-background overlay-fade text-center vertical-align">

                                                    <button v-if="!item.default" type="button" @click="setDefault(item)" class="btn btn-outline btn-inverse vertical-align-middle" style="margin: 5px;">设为默认</button>

                                                     <button type="button" @click="remove(item._id)" class="btn btn-outline btn-inverse vertical-align-middle">删除</button>
                                                </figcaption>
                                            </figure>

                                        </div>
                                        <div class="info-wrap">
                                            <!--<div class="dropdown">-->
                                            <!--<span class="icon wb-settings dropdown-toggle" role="button"-->
                                                  <!--data-animation="scale-up"></span>-->
                                                <!--<ul class="dropdown-menu dropdown-menu-right" role="menu">-->
                                                    <!--<li><a href="javascript:void(0)"-->
                                                           <!--v-on:click="remove(item._id,$index)"><i class="icon wb-trash"-->
                                                                                                   <!--aria-hidden="true"></i>设为默认-->
                                                    <!--</a>-->
                                                    <!--<li><a href="javascript:void(0)"-->
                                                           <!--v-on:click="remove(item._id,$index)"><i class="icon wb-trash"-->
                                                                                                   <!--aria-hidden="true"></i>删除-->
                                                    <!--</a>-->
                                                    <!--</li>-->
                                                <!--</ul>-->
                                            <!--</div>-->
                                            <div class="title"></div>
                                            <div class="time">{{item.time | moment }}</div>
                                            <div class="media-item-actions btn-group">

                                                <button class="btn btn-icon btn-pure btn-default"
                                                        data-original-title="删除" data-toggle="tooltip"
                                                        data-container="body" data-placement="top" data-trigger="hover"
                                                        type="button">
                                                    <i class="icon wb-trash" aria-hidden="true"></i>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </li>
                            </template>

                        </ul>
                    </div>
                </div>
            </div>
        </div>

</template>
<style>

</style>

<script>
    //require('../global/vendor/jquery-ui/jquery-ui.min');
    //import tmpl from '../bower_components/blueimp-tmpl/js/tmpl.min';

    //    require('../bower_components/blueimp-load-image/js/load-image.all.min');
    //    require('../bower_components/blueimp-canvas-to-blob/js/canvas-to-blob.min');
    //require('../bower_components/blueimp-file-upload/js/jquery.fileupload');
    //    require('../bower_components/blueimp-file-upload/js/jquery.fileupload-process');
    //    require('../bower_components/blueimp-file-upload/js/jquery.fileupload-image');
    //    require('../bower_components/blueimp-file-upload/js/jquery.fileupload-audio');
    //    require('../bower_components/blueimp-file-upload/js/jquery.fileupload-video');
    //    require('../bower_components/blueimp-file-upload/js/jquery.fileupload-validate');
    //    require('../bower_components/blueimp-file-upload/js/jquery.fileupload-ui');

    //    require('../global/vendor/dropify/dropify.min');
    //    require('../global/js/components/dropify.min');
    require('../assets/css/site.min.css');

    require('../assets/examples/css/apps/media.min.css');
    require('../assets/js/app.min');
    //var Dropzone = require("dropzone");
    require("dropzone/dist/min/basic.min.css")
    require("dropzone/dist/min/dropzone.min.css")
    var Dropzone = require("dropzone/dist/min/dropzone-amd-module.min")
    import moment from 'moment';

    import 'whatwg-fetch';
    var _ = require('lodash');
    import { API_ROOT } from '../config.js'

    export default{
        data(){
            return {
                baseUrl: API_ROOT,
                imgUrl: API_ROOT+"/upload/",
                items: [],
                cate: 1
            }
        },
        methods: {
            init: function () {
                var _vm = this;
                fetch(API_ROOT+'/api/images/' + _vm.cate)
                        .then(function (response) {
                            if (response.status >= 400) {
                                throw new Error("Bad response from server");
                            }

                            return response.json();
                        })
                        .then(function (docs) {

                            console.log(docs);

                            _vm.items = docs;
                        });

            },
            select: function (cate) {
                this.cate = cate;
                console.log(this.cate)
                this.items = [];
                this.init();

            },
            moment: function (date) {
                return moment(date);
            },
            date: function (date) {
                return moment(date).format('MMMM Do YYYY, h:mm:ss a');
            },
            remove: function (id) {
                var _vm = this;

                fetch(API_ROOT+'/api/remove', {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        id: id,
                    })

                })
                        .then(function (response) {
                            if (response.status >= 400) {
                                throw new Error("Bad response from server");
                            }

                            return response.json();
                        })
                        .then(function (docs) {



                            //_vm.items=_.filter(_vm.items, ['_id', id]);
                            _vm.items=_.filter(_vm.items, function(o) { return o._id !=id; });

                            //_.find(_vm.items, function(o) { return o._id !=id; });

//                            _vm.items= _.dropRightWhile(_vm.items, function (o) {
//                                console.log(o._id)
//                                return o._id = id;
//                            });

                        });

            },
            setDefault: function (item) {



                var _vm = this;

                fetch(API_ROOT+'/api/default', {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        id:item._id,
                        file:item.name,
                        cate:item.cate
                    })

                })
                        .then(function (response) {
                            if (response.status >= 400) {
                                throw new Error("Bad response from server");
                            }

                            return response.json();
                        })
                        .then(function (docs) {

                            //_vm.items=_.filter(_vm.items, function(o) { return o._id !=id; });
                            _.forEach(_vm.items, function(o) {
                                o.default=0;
                            });
                            item.default=1;

                        });

            }
        },
        filters: {
            moment: function (date) {
                return moment(date).format('L');
            }
        },
        ready(){
            this.init();
            Dropzone.autoDiscover = false;
            var _vm = this;
            $(".dropzone").dropzone({

                dictDefaultMessage: '点击上传',
                maxFiles: 20,
                init: function () {
                    var cd;
                    this.on("success", function (file, response) {
                        $('.dz-progress').hide();
                        $('.dz-size').hide();
                        $('.dz-error-mark').hide();
                        console.log(response);
                        console.log(file);
                        _vm.items.unshift(response);
                        $(".dz-preview").remove();
                        $(".dz-message").show("slow")
                        cd = response;
                    });

                }

            });
            window.Site.cc();
            // init();

        }
    }
    function init() {
        !function (document, window, $) {
            "use strict";
            window.AppMedia = App.extend({
                handleArrangement: function () {
                    $("#arrangement-grid").on("click", function () {
                        var $this = $(this);
                        $this.hasClass("active") || ($("#arrangement-list").removeClass("active"), $this.addClass("active"), $(".media-list").removeClass("is-list").addClass("is-grid"), $(".media-list>ul>li").removeClass("animation-fade").addClass("animation-scale-up"))
                    }), $("#arrangement-list").on("click", function () {
                        var $this = $(this);
                        $this.hasClass("active") || ($("#arrangement-grid").removeClass("active"), $this.addClass("active"), $(".media-list").removeClass("is-grid").addClass("is-list"), $(".media-list>ul>li").removeClass("animation-scale-up").addClass("animation-fade"))
                    })
                }, handleActive: function () {
                    $.components.getDefaults("selectable").rowSelector = ".media-item"
                }, handleDropdownAction: function () {
//                    $(".info-wrap>.dropdown").on("show.bs.dropdown", function () {
//                        $(this).closest(".media-item").toggleClass("item-active")
//                    }).on("hidden.bs.dropdown", function () {
//                        $(this).closest(".media-item").toggleClass("item-active")
//                    }), $(".info-wrap .dropdown-menu").on("click", function (e) {
//                        e.stopPropagation()
//                    })
                }, run: function () {
                    $(".media-item-actions").on("click", function (e) {
                        e.stopPropagation()
                    }), this.handleArrangement(), this.handleActive(), this.handleDropdownAction()
                }
            }), $(document).ready(function () {
                AppMedia.run()

            })
        }(document, window, jQuery);
    }

</script>
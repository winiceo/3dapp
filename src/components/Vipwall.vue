<template>
    <div class="page bg-white animsition" style="animation-duration: 800ms; opacity: 1;">
        <!-- Media Sidebar -->


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
                            <div class="media-item">

                                <img data-src="example.com/150x150?theme=simple" id="newUpload">

                                <input type="file" id="upload" name="image" @change="upload()" multiple/>
                            </div>
                        </li>
                        <template v-for="item in items">
                            <li class="animation-scale-up"
                                style="animation-fill-mode: backwards; animation-duration: 250ms; animation-delay: 0ms;">
                            <div class="widget widget-shadow text-center">
                                <div class="widget-header cover overlay" style="height: calc(100% - 100px);">
                                    <img class="cover-image" src="../global/photos/view-3-960x640.jpg" alt="..." style="height: 100%;">
                                    <div class="overlay-panel vertical-align">
                                        <div class="vertical-align-middle">
                                            <a class="avatar avatar-100 bg-white margin-bottom-10 img-bordered margin-xs-0" href="javascript:void(0)">
                                                <img  :src="item.get('url')" alt="">
                                            </a>
                                            <div class="font-size-20">李小龙</div>
                                            <div class="font-size-14 grey-400">Designer</div>
                                        </div>
                                    </div>
                                </div>
                                <div class="widget-footer padding-horizontal-30 padding-vertical-20 height-100">

                                    <p class="margin-bottom-35 blue-grey-500">Menandri nixam arguerent quanti fecerit laudem vidisse elegantis.
                                    </p>
                                </div>
                            </div>
                        </template>
                    </li>
                    </ul>
                </div>
            </div>
        </div>
    </div>

</template>
<style>
    #upload {
        opacity: 0;
        position: absolute;
        top:-1px;
        z-index: 10;
        width: 150px;
        height: 150px;
        border:1px solid grey;
    }
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
    require("../bower_components/dropzone/dist/min/basic.min.css")
    require("../bower_components/dropzone/dist/min/dropzone.min.css")
    var Dropzone = require("../bower_components/dropzone/dist/min/dropzone-amd-module.min")
    import moment from 'moment';


    // import Holder from 'holder'
    import 'whatwg-fetch';
    var _ = require('lodash');
    import {API_ROOT} from '../config.js'


    var Parse = require("parse");
    Parse.initialize("71an.com", "71an.com");
    Parse.serverURL = ("http://baas.71an.com:8043/parse");

    export default{
        data(){
            return {
                baseUrl: API_ROOT,
                imgUrl: API_ROOT + "/upload/",
                items: [],
                cate: 1,
                skip:0
            }
        },
        methods: {
            init: function () {
                var _vm = this;
                fetch(API_ROOT + '/api/images/' + _vm.cate)
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

            getdata: function () {
                var _vm = this;
                var Picture = Parse.Object.extend("Vipwall");


                var query = new Parse.Query(Picture);

                // Retrieve the most recent ones
                query.descending("createdAt");

                // Only retrieve the last ten
                query.limit(10);

                query.skip(_vm.skip)
                query.find({
                    success: function (picture) {
                        _.forEach(picture, function (o) {
                            _vm.items.push(o)
                        });


                    }
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

                fetch(API_ROOT + '/api/remove', {
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
                            _vm.items = _.filter(_vm.items, function (o) {
                                return o._id != id;
                            });

                            //_.find(_vm.items, function(o) { return o._id !=id; });

//                            _vm.items= _.dropRightWhile(_vm.items, function (o) {
//                                console.log(o._id)
//                                return o._id = id;
//                            });

                        });

            },
            holders: function () {
                //require("../bower_components/holderjs/holder")

                Holder.run({
                    domain: "example.com",
                    themes: {
                        "simple": {
                            bg: "#fff",
                            fg: "#000",
                            size: 12
                        }
                    },
                    images: "#newUpload"
                });
            },
            upload: function () {

                var _vm=this;
                var fileUploadControl = $("#upload")[0];
                $.each(fileUploadControl.files,function(i,file){


                    var name = "photo.jpg";
                    var parseFile = new Parse.File(name, file);


                    parseFile.save().then(function (a) {
                        // The file has been saved to Parse.
                        console.log(a)


                        console.log(parseFile)

                        $("#newUpload")[0].src = parseFile.url();

                        var Pictrues = Parse.Object.extend("Vipwall");
                        var pic = new Pictrues();
                        pic.set("activty_id",1);
                        pic.set("url",parseFile.url());
                        pic.save(null, {
                            success: function (pic) {

                                _vm.items.unshift(pic)
                            }
                        })



                    }, function (error) {
                        // The file either could not be read, or could not be saved to Parse.
                    });


                });
            },
            setDefault: function (item) {


                var _vm = this;

                fetch(API_ROOT + '/api/default', {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        id: item._id,
                        file: item.name,
                        cate: item.cate
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
                            _.forEach(_vm.items, function (o) {
                                o.default = 0;
                            });
                            item.default = 1;

                        });

            }
        },
        filters: {
            moment: function (date) {
                return moment(date).format('L');
            }
        },


        ready(){
            this.holders();
            this.getdata();
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
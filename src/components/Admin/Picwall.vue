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
                                <form action="/" class="dropzone thumbnail"
                                      style="margin:10px;"
                                      id="picupload" enctype="multipart/form-data" data-title="上传图片">

                                    <input type="hidden" name="context" value="{{context}}">
                                    <div class="fallback">

                                    </div>
                                </form>



                            </div>
                        </li>
                        <template v-for="(index,co) in items">
                            <li class="animation-scale-up"
                                style="animation-fill-mode: backwards; animation-duration: 250ms; animation-delay: 0ms;">
                                <div class="widget widget-shadow text-center">
                                    <div class="widget-header cover overlay" style="height: calc(100% - 100px);">
                                        <img class="cover-image" src="../../global/photos/view-3-960x640.jpg" alt="..." style="height: 100%;">
                                        <div class="overlay-panel vertical-align">
                                            <div class="vertical-align-middle">
                                                <a class="avatar avatar-100 bg-white margin-bottom-10 img-bordered margin-xs-0" href="javascript:void(0)">
                                                    <img  :src="app.img+co.pic.url" alt="">
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="widget-footer padding-horizontal-30 padding-vertical-20 height-100">
                                        <div class="font-size-20"><input type="text" v-model="co.name"></div>
                                        <div class="font-size-14 grey-400"><input type="text" v-model="co.title"></div>

                                        <p class="margin-bottom-35 blue-grey-500"><input type="text" v-model="co.description">
                                        </p>
                                        <button @click="save">保存</button>
                                        <button @click="add=false,item=co,save()">更新</button>
                                        <button @click="remove(index,co)">删除</button>
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

    require('../../assets/examples/css/apps/notebook.min.css');
    require('../../global/vendor/slidepanel/slidePanel.min.css');
    require('../../global/vendor/slidepanel/jquery-slidePanel.min.js');
    require('../../global/vendor/bootstrap-contextmenu/bootstrap-contextmenu');


    var infiniteScroll = require('vue-infinite-scroll').infiniteScroll;
    require("dropzone/dist/min/dropzone.min.css")
    var Dropzone = require("dropzone/dist/min/dropzone-amd-module.min")
    import {whatever} from "../../utils/leven"


    var uuid = require('node-uuid');

    export default{
        directives: {infiniteScroll},
        data(){
            return {
                add: true,
                context: "picwall",

                count: 0,
                skip: 0,
                busy: false,
                items: [],
                item: {

                },
                choice: {

                    id: "",
                    pic: "",
                    name: ""
                }
            }
        },
        methods: {
            init: function () {
                // this.uploadUrl = "http://localhost:9999/upload",

                this.getdata();
                window.Site.cc();
                window.AppNoteBook = Site.extend({
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
                this.new_pic()


            },
            selected: function (item) {
                this.item = item;
                this.add = false;
            },
            remove: function (index, item) {
                console.log(index, item)
                //this.item.delete(index)
                var _vm = this;
                this.items.splice(item, 1)
                fetch(_vm.app.api + '/picwall/pic/delete/' + item.id, {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                        'Authorization': _vm.app.token
                    }

                }).then(function (response) {
                    if (response.status >= 400) {
                        throw new Error("Bad response from server");
                    }

                    return response.json();
                }).then(function (item) {

                    console.log(item);
                    toastr.info('删除成功')

                });
            },

            new_pic: function () {
                var _vm = this;



                this.add = true;

                setTimeout(function () {
                    _vm.setup("#uppic");

                }, 500)


            },
            save: function () {
                var _vm = this;
                //_vm.item.style=parseInt(_vm.item.style);

                var act = this.add ? "new" : "update"
                var id=this.add?_vm.app.aid:_vm.item.id;
                fetch(_vm.app.api + '/picwall/pic/' + act + '/' + id, {
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
                }).then(function (item) {
                    _vm.add?_vm.items.unshift(item):""
                    console.log(item);
                    toastr.info('保存成功')

                });
            },
            getdata: function (callback) {
                var _vm = this;
                console.log(this.app)
                fetch(_vm.app.api + '/picwall/' + _vm.app.aid, {
                    method: 'GET',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                        'Authorization': _vm.app.token
                    }

                }).then(function (response) {
                    if (response.status >= 400) {
                        throw new Error("Bad response from server");
                    }

                    return response.json();
                }).then(function (items) {

                    console.log(items);
                    _vm.items = items;
                    whatever(callback)


                }).catch(function (ex) {
                    console.log('parsing failed', ex)
                    whatever(callback)

                });

            },
            loadMore: function () {
                this.busy = true;
                this.skip += 10;
                console.log(this.skip)
                this.getdata();

            },


            setup: function (that) {
                var _vm = this;
//                // alert($(".imgUpload").size())
//                $(".dropzone").each(function () {
//                    var that = this;

                new Dropzone("#picupload", {

                    dictDefaultMessage: $(that).data("title"),
                    maxFiles: 1,
                    paramName: "file",
                    url:_vm.app.upload,
                    headers: {
                        'Accept': 'application/json',

                        'Authorization': _vm.app.token
                    },
                    init: function () {
                        //alert($(that).data("field"))
                        // this.on("addedfile", function(file) { alert("Added file."); });
                        this.on("success", function (file, response) {
                            $('.dz-progress').hide();
                            $('.dz-size').hide();
                            $('.dz-error-mark').hide();
                            console.log(response);
                            console.log(file);

                            _vm.item.pic  = response
                            _vm.items.unshift(_vm.item);

                            //$(".dz-message").show("slow")

                        });
                        this.on("addedfile", function (file) {
                            console.log(file)
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
//                })
            }
        }
        ,ready:function(){
            Dropzone.autoDiscover = false;

        }
    }
</script>
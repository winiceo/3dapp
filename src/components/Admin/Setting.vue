<template>
    <div class="page animsition" style="animation-duration: 800ms; opacity: 1;">
        <div class="page-content container-fluid">
            <div class="row">


                <div class="col-md-12">
                    <!-- Panel -->
                    <div class="panel">
                        <div class="panel-body nav-tabs-animate">
                            <ul class="nav nav-tabs nav-tabs-line" data-plugin="nav-tabs" role="tablist">
                                <li class="active" role="presentation"><a data-toggle="tab" href="#activities"
                                                                          aria-controls="activities" role="tab"
                                                                          aria-expanded="false">会议设置 </a></li>

                            </ul>


                            <div class="tab-content">
                                <div class="tab-pane animation-slide-left active" id="activities" role="tabpanel">

                                    <div class="example">
                                        <!--<form autocomplete="off">-->


                                        <div class="form-group">
                                            <label class="control-label">会议名称</label>
                                            <input type="text" class="form-control"
                                                   v-model="item.title" placeholder="" autocomplete="off">
                                        </div>

                                        <div class="form-group">

                                            <label class="col-sm-3 control-label">
                                                开始时间:
                                            </label>
                                            <div class="col-sm-3">
                                                <input class=flatpickr data-enabletime=true data-time_24hr=true
                                                       data-timeFormat="H:i" v-model="item.start_at">
                                            </div>
                                            <label class="col-sm-3 control-label">
                                                结束时间:
                                            </label>
                                            <div class="col-sm-3">
                                                <input class=flatpickr data-enabletime=true data-time_24hr=true
                                                       data-timeFormat="H:i" v-model="item.end_at">
                                            </div>
                                        </div>

                                        <div class="form-group">
                                            <label class="control-label">微信设置</label>
                                            <div>
                                                <div class="radio-custom radio-default radio-inline">
                                                    <input type="radio" value=0 v-model="item.multiple">
                                                    <label>微信网页版(不需要绑定)</label>
                                                </div>
                                                <div class="radio-custom radio-default radio-inline">
                                                    <input type="radio" value=1 v-model="item.multiple">

                                                    <label>绑定版(需要公众号)</label>
                                                </div>
                                            </div>
                                        </div>
                                        <template v-if="item.multiple==1">
                                            <div class="row row-lg">

                                                <div class="form-group col-sm-4">
                                                    上墙关键字
                                                </div>
                                                <div class="form-group col-sm-8">
                                                    <input type="text" class="form-control"
                                                           v-model="item.max_choices" placeholder="我要上墙">
                                                </div>


                                            </div>


                                        </template>



                                        <div class="row">
                                            <div class="col-md-6 col-xs-12 masonry-item">
                                                <div class="form-group">
                                                    <label class="control-label">背景图片</label>
                                                    <div class="dropzone   vip_uppic"
                                                         id="dropzone_0"
                                                         style="margin:10px;"

                                                         data-title="上传图片" data-url="bgImage">
                                                        <template v-if="item.bg_image">
                                                            <img dz-clickable
                                                                 class="image  " style="z-index:-10"

                                                                 :src="app.img+item.bg_image.url" height="120"
                                                                 alt="...">

                                            <span class="addMember-remove"
                                                  @click="reset('dropzone_0')"><i
                                                    class="wb-minus-circle"></i></span>
                                                        </template>

                                                        <input type="hidden" name="context" value="{{context}}">

                                                        <div class="fallback">

                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="col-md-6 col-xs-12 masonry-item">
                                                <div class="form-group">
                                                    <label class="control-label">背景音乐</label>
                                                    <div class="dropzone   vip_uppic"
                                                         id="dropzone_1"
                                                         style="margin:10px;"

                                                         data-title="上传背景音乐" data-url="bgAudio">
                                                        <template v-if="item.bg_audio">


                                                            <div class="cover plyr plyr--audio plyr--stopped">
                                                                <audio>
                                                                    <!-- Audio Files -->
                                                                    <source type="audio/mp3"
                                                                            :src="app.img+item.bg_audio.url">

                                                                </audio>

                                                            </div>

                                            <span class="addMember-remove"
                                                  @click="reset('dropzone_1')"><i
                                                    class="wb-minus-circle"></i></span>
                                                        </template>

                                                        <input type="hidden" name="context" value="audio">

                                                        <div class="fallback">

                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="form-group">
                                            <button type="button" class="btn btn-primary " @click="save">保存</button>
                                        </div>
                                        <!--</form>-->
                                    </div>

                                </div>



                            </div>
                        </div>
                    </div>
                    <!-- End Panel -->
                </div>
            </div>
        </div>
    </div>

</template>
<style>

</style>
<script>

    var infiniteScroll = require('vue-infinite-scroll').infiniteScroll;

    import {whatever} from "../../utils/leven"
    import {aside} from '../../lib/vue-strap'
    import flatpickr from "flatpickr";


    require("flatpickr/dist/flatpickr.material_blue.min.css")
    //    require("../../global/vendor/plyr/plyr.min.css")
    //    require("../../global/vendor/plyr/plyr")
    var plyr = require("plyr/dist/plyr")
    require("plyr/dist/plyr.css")

    var uuid = require('node-uuid');
    var Dropzone = require("dropzone/dist/min/dropzone-amd-module.min")
    Dropzone.autoDiscover = false;
    require('../../global/js/components/toastr.min');

    export default{
        directives: {infiniteScroll},
        components: {aside},
        data(){
            return {
                app: {},
                index: 0,
                showLeft: false,
                showRight: false,
                add: true,
                context: "awards",

                count: 0,
                skip: 0,
                busy: false,

                item: {}

            }
        },
        watch: {


            'showRight': function (val, oldVal) {
                if (val) {

                    $('.aside-backdrop').css("z-index", 100000)
                }
            },
        },
        methods: {
            init: function () {
                // this.uploadUrl = "http://localhost:9999/upload",
                var _vm = this;
                this.getdata(function () {
                    _vm.setup("#dropzone_0");
                    _vm.setup("#dropzone_1");

                });
                flatpickr.init.prototype.l10n.weekdays.longhand = ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'];
                flatpickr('.flatpickr')

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


            },

            new_item: function () {
                this.showRight = true
                this.item = {pic: null}
                this.add = true;
                var _vm = this;
                setTimeout(function () {
                    _vm.setup(".dropzone");

                }, 200)


            },
            reset: function (a) {
                var _vm = this;
                if(a=="dropzone_0"){
                    _vm.item.bg_image = null;
                }else if(a=="dropzone_1"){
                    _vm.item.bg_audio=null;
                }
                _vm.setup(a);
            },
            selected: function (item) {
                this.item = item;
                this.add = false;
                _vm.setup(".dropzone");

            },
            remove: function () {

                //this.item.delete(index)
                var _vm = this;
                this.items.splice(_vm.index, 1)
                fetch(_vm.app.api + '/vipwall/vip/delete/' + _vm.item.id, {
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
                }).then(function () {


                    _vm.items = _.filter(_vm.items, function (o) {
                        return o.id != item.id;
                    });

                    toastr.info('删除成功')

                });
            },
            save: function () {
                var _vm = this;
                //_vm.item.style=parseInt(_vm.item.style);

                var act = "update"
                var id = this.add ? _vm.app.aid : _vm.item.id;
                fetch(_vm.app.api + '/activity/' + act + '/' + id, {
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
                    _vm.add ? _vm.items.push(item.data) : ""

                    toastr.info('保存成功')

                });
            },
            getdata: function (callback) {
                var _vm = this;
                console.log(this.app)
                fetch(_vm.app.api + '/activity/' + _vm.app.aid, {
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
                }).then(function (item) {

                    //console.log(items);
                    _vm.item = item;
                    setTimeout(function () {
                        if (_vm.item.bg_audio) {
                            plyr.setup();
                        }
                    }, 500);


                    //_vm.item.bgMusic = "https://cdn.selz.com/plyr/1.0/logistics-96-sample.mp3"
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
                var url = _vm.app.api + "/activity/" + $(that).data("url") + "/new"

                try {
                    $(that).dropzone({

                        dictDefaultMessage: $(that).data("title"),
                        maxFiles: 1,
                        paramName: "file",
                        url: url,
                        headers: {
                            'Accept': 'application/json',

                            'Authorization': _vm.app.token
                        },
                        init: function () {

                            this.on("success", function (file, response) {
                                $('.dz-progress').hide();
                                $('.dz-size').hide();
                                $('.dz-error-mark').hide();
                                console.log(response.data)
                                //_vm.$set(_vm.item,$(that).data("url"),response.data)

                                if ($(that).data("url") == "bgImage") {
                                    _vm.$set('item.bg_image', response.data)
                                    $(that).find(".dz-message").hide();

                                }
                                if ($(that).data("url") == "bgAudio") {
                                    _vm.$set('item.bg_audio', response.data)
                                    plyr.setup();
                                    $(that).find(".dz-message").hide();

                                }
                                // _vm.item[$(that).data("url")] = response.data
                                // alert(_vm.item.pic)


                            });
                            this.on("addedfile", function (file) {


                            });
                            this.on("complete", function (file) {
                                this.removeFile(file);

                            });


                        }

                    });
                } catch (e) {
                    alert(e)
                }
            }
        }

    }
</script>
<template>
    <div class="page animsition" style="animation-duration: 800ms; opacity: 1;">
        <Row class='pagehead'>
            <i-col span="24"><h3>设置</h3></i-col>

        </Row>
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
                                            <label class="control-label">会议名称(必填)</label>
                                            <input type="text" class="form-control"
                                                   v-model="item.name" placeholder="" autocomplete="off">
                                        </div>

                                        <div class="form-group">
                                            <label class="control-label">报名签到</label>

                                            <Switch :checked="sign_type" @on-change="changeSign">
                                                <span slot="open">开</span>
                                                <span slot="close">关</span>
                                            </Switch>

                                        </div>

                                        <div class="form-group">
                                            <label class="control-label">会议标题</label>
                                            <input type="text" class="form-control"
                                                   v-model="item.title" placeholder="" autocomplete="off">
                                        </div>

                                        <div class="form-group">

                                            <label class="col-sm-3 control-label">
                                                开始时间:
                                            </label>
                                            <div class="col-sm-3">
                                                <input v-datepicker="item.start_at" data-enabletime=true
                                                       data-time_24hr=true
                                                       data-timeFormat="H:i" v-model="item.start_at">

                                            </div>
                                            <label class="col-sm-3 control-label">
                                                结束时间:
                                            </label>
                                            <div class="col-sm-3">
                                                <input v-datepicker="item.end_at" data-enabletime=true
                                                       data-time_24hr=true
                                                       data-timeFormat="H:i" v-model="item.end_at">

                                            </div>
                                        </div>

                                        <div class="form-group">
                                            <label class="control-label">微信设置</label>
                                            <div>
                                                <div class="radio-custom radio-default radio-inline">
                                                    <input type="radio" value=0 v-model="item.wxbound">
                                                    <label>微信网页版(不需要绑定)</label>
                                                </div>
                                                <div class="radio-custom radio-default radio-inline">
                                                    <input type="radio" value=1 v-model="item.wxbound">

                                                    <label>绑定版(需要公众号)</label>
                                                </div>
                                            </div>
                                        </div>
                                        <template v-if="item.wxbound==1">
                                            <div>

                                                <Row>
                                                    <i-col span="4">上墙关键字</i-col>
                                                    <i-col span="6"><input type="text" class="form-control"
                                                                            v-model="item.wxword" placeholder="我要上墙"></i-col>

                                                    <i-col span="6">关注后自动回复上墙消息</i-col>
                                                    <i-col span="6"> <Switch :checked="item.wechat_auto_reply" @on-change="changeReply">
                                                        <span slot="open">开</span>
                                                        <span slot="close">关</span>
                                                    </Switch></i-col>
                                                </Row>
                                                <BR>

                                                <Row>
                                                    <i-col span="4">使用公众号</i-col>
                                                    <i-col span="20">
                                                        <Card>
                                                            <p slot="title">
                                                                <Icon type="ios-film-outline"></Icon>
                                                                选择已授权公众号
                                                            </p>
                                                            <a href="#" slot="extra"
                                                               @click.prevent="getUserInfo">
                                                                <Icon type="ios-loop-strong"></Icon>
                                                                刷新
                                                            </a>
                                                            <a href="#" slot="extra"
                                                               @click.prevent="gowechat">
                                                                <Icon type="plus-circled"></Icon>
                                                                添加新公众号

                                                            </a>
                                                            <ul>


                                                                <li v-for="(index,u) in userinfo.wxoas_config"
                                                                    style='margin:1px'
                                                                    v-bind:class='{"liactiv":item.wxoas_key==u.key}'>
                                                 <span @click="selectwechat(u)">
                                                               {{{getAvatar(u)}}} - {{ u.name }}
                                                </span>
                                                                </li>

                                                            </ul>
                                                        </Card>


                                                    </i-col>
                                                </Row>
                                                <br>
                                            </div>


                                        </template>


                                        <div class="row">
                                            <div class="col-md-6 col-xs-12 masonry-item">
                                                <div class="form-group">
                                                    <label class="control-label">背景图片</label>


                                                    <!--<div id="image-upload" class="styleguide-section">-->
                                                    <!--<header class="styleguide-header">-->
                                                    <!--<h1>Image Upload Preview (Drag &amp; Drop)</h1>-->
                                                    <!--</header>-->
                                                    <!--<upload-image info="Minimum width 700px, will be cropped to 16:9"></upload-image>-->
                                                    <!--</div>-->
                                                    <div class="dropzone   vip_uppic"
                                                         id="dropzone_0"
                                                         style="margin:10px;"

                                                         data-title="上传图片" data-url="bgImage">
                                                        <template v-if="item.bg_image">
                                                            <img dz-clickable
                                                                 class="image  " style="z-index:-10"

                                                                 v-lazy="app.img+item.bg_image.url" height="120"
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

                                        <div class="row">
                                            <div class="col-md-6 col-xs-12 masonry-item">
                                                <div class="form-group">
                                                    <label class="control-label"> 上传logo</label>


                                                    <!--<div id="image-upload" class="styleguide-section">-->
                                                    <!--<header class="styleguide-header">-->
                                                    <!--<h1>Image Upload Preview (Drag &amp; Drop)</h1>-->
                                                    <!--</header>-->
                                                    <!--<upload-image info="Minimum width 700px, will be cropped to 16:9"></upload-image>-->
                                                    <!--</div>-->
                                                    <div class="dropzone   vip_uppic"
                                                         id="dropzone_2"
                                                         style="margin:10px;"

                                                         data-title="上传logo" data-url="logo">
                                                        <template v-if="item.logo">
                                                            <img dz-clickable
                                                                 class="image  " style="z-index:-10"

                                                                 v-lazy="app.img+item.logo.url" height="120"
                                                                 alt="...">

                                                            <span class="addMember-remove"
                                                                  @click="reset('dropzone_2')"><i
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
                                                    <label class="control-label">上传侧边二维码</label>


                                                    <div class="dropzone   vip_uppic"
                                                         id="dropzone_3"
                                                         style="margin:10px;"

                                                         data-title="上传侧边二维码" data-url="qrcode">
                                                        <template v-if="item.qrcode">
                                                            <img dz-clickable
                                                                 class="image  " style="z-index:-10"

                                                                 v-lazy="app.img+item.qrcode.url" height="120"
                                                                 alt="...">

                                                            <span class="addMember-remove"
                                                                  @click="reset('dropzone_3')"><i
                                                                    class="wb-minus-circle"></i></span>
                                                        </template>

                                                        <input type="hidden" name="context" value="qrcode">

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
.liactiv{
  background-color:#ebf7ff;
}
</style>
<script>

    var infiniteScroll = require('vue-infinite-scroll').infiniteScroll;


    import {aside,upload} from '../../lib/vue-strap'
    require('../../lib/flatpickr')
    //    import flatpickr from "flatpickr";


    require("flatpickr/dist/flatpickr.material_blue.min.css")
    //    require("../../global/vendor/plyr/plyr.min.css")
    //    require("../../global/vendor/plyr/plyr")
    var plyr = require("plyr/dist/plyr")
    require("plyr/dist/plyr.css")

    var uuid = require('node-uuid');
    var Dropzone = require("dropzone/dist/min/dropzone-amd-module.min")
    Dropzone.autoDiscover = false;
    import {whatever, api} from "../../utils/leven"

    export default{
        directives: {infiniteScroll},
        components: {
            'aside':aside,
            'upload-image': upload
        },
        data(){
            return {
                userinfo:{},
                app: {},
                index: 0,
                showLeft: false,
                showRight: false,
                add: true,
                context: "awards",

                count: 0,
                skip: 0,
                busy: false,
                sign_type:false,
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
                    _vm.setup("#dropzone_2");
                    _vm.setup("#dropzone_3");

                });
//                flatpickr.init.prototype.l10n.weekdays.longhand = ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'];
//                flatpickr('.flatpickr')
                this.getUserInfo();
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
            changeSign:function(status){
                this.sign_type=status
            },
             changeReply:function(status){
                this.item.wechat_auto_reply=status
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
                }else if(a=="dropzone_2"){
                _vm.item.logo=null;

                }else if(a=="dropzone_3"){
                _vm.item.qrcode=null;

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
                api(_vm).post(_vm.app.api + '/vipwall/vip/delete/' + _vm.item.id).then(function () {


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


                if(!_vm.item.name||_vm.item.name==""){
                    toastr.warning("会议名称不能为空！");
                    return false;
                }


                if(!_vm.item.start_at||!_vm.item.end_at){
                    toastr.warning("会议时间不能为空！");
                    return false;
                }

                console.log(_vm.item.start_at)
                if(_vm.item.start_at=="undefined"||_vm.item.end_at=="undefined"){
                    toastr.warning("会议时间不能为空！");
                    return false;
                }
                var d1 = new Date(_vm.item.start_at.replace(/\-/g, "\/"));
                var d2 = new Date(_vm.item.end_at.replace(/\-/g, "\/"));
                if(d1 >=d2)
                {
                    toastr.warning("开始时间不能大于结束时间！");
                    return false;
                }
                this.item.sign_type=this.sign_type?1:0
                api(_vm).post(_vm.app.api + '/activity/' + act + '/' + id,  JSON.stringify(_vm.item)

                ).then(function (item) {
                    //_vm.add ? _vm.items.push(item.data) : ""

                    toastr.info('保存成功')

                });
            },
            getdata: function (callback) {
                var _vm = this;
                console.log(this.app)
                api(_vm).get(_vm.app.api + '/activity/' + _vm.app.aid).then(function (data) {

                    //console.log(items);
                    _vm.item = data.data;
                    _vm.sign_type=_vm.item.sign_type==1?true:false

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

            getUserInfo(){
                var _vm=this;
                _vm.getuserinfo(function(userinfo){
                    _vm.userinfo=userinfo

                })
            },

            getAvatar(n){
                var img=n.data.head_img?n.data.head_img:"http://getbootstrapadmin.com/remark/global/portraits/1.jpg"

                return "<img src='"+img+"' width='40' height='40'>"
            },
            selectwechat(u){

                this.item.wxoas_key=u.key
            },
            dateChanged: function (e) {
                console.log(e)
            },
            gowechat:function(e){

              window.open("/app/wall.html#!/wechat")
            },


            setup: function (that) {
                var _vm = this;
                var url = _vm.app.api + "/activity/" + $(that).data("url") + "/new";
                if(that=="#dropzone_2" ||that=='#dropzone_3'){
                    url=_vm.app.upload;
                }
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
                                //$('.dz-message').remove();

                                //_vm.$set(_vm.item,$(that).data("url"),response.data)

                                if ($(that).data("url") == "bgImage") {
                                    _vm.$set('item.bg_image', response.data)
                                    $(that).remove(".dz-message");

                                }
                                if ($(that).data("url") == "bgAudio") {
                                    _vm.$set('item.bg_audio', response.data)
                                    setTimeout(function(){
                                        plyr.setup();
                                    },100)
                                    $(that).remove(".dz-message");

                                }


                                if ($(that).data("url") == "logo") {
                                     _vm.$set('item.logo', response)
                                    $(that).remove(".dz-message");

                                }

                                 if ($(that).data("url") == "qrcode") {
                                    _vm.$set('item.qrcode', response)
                                    $(that).remove(".dz-message");

                                }

                                // _vm.item[$(that).data("url")] = response.data
                                // alert(_vm.item.pic)


                            });
                            this.on("addedfile", function (file) {


                            });

                            this.on("error", function (file) {
                                toastr.warning('上传失败请重试')

                            });
                            this.on("complete", function (file) {
                                this.removeFile(file);

                            });


                        }

                    });
                } catch (e) {
                    //alert(e)
                }
            }
        }

    }


</script>
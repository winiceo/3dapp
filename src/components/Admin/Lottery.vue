<template>

    <div class="page animsition award1">

        <Row class='pagehead'>
            <i-col span="11"><h3>奖品管理</h3></i-col>

            <i-col span="13" class='action'>
                <input type="checkbox" id="inputChecked"  v-model="config.repeat_awarded" @change='set_repeat'>
                <label for="inputChecked">是否允许重复中奖</label>
                <button type="button" class="btn btn-dark" @click="new_item" data-animation="scale-up"><i
                        class="icon wb-plus" aria-hidden="true"></i>添加
                </button>
            </i-col>

        </Row>


        <div class="page-content ">

            <ul class="blocks blocks-100 blocks-xlg-12" id="exampleList"
                data-filterable="true">
                <template v-for="(index,co) in items" track-by="$index">
                    <li data-type="animal">
                        <Card>
                            <Row class=''>
                                <i-col span="12" @click="selected(co)">
                                    <Card :bordered="false">
                                        <div style="text-align:center">
                                            <img :src="app.img+co.pic.url" class="cover-image" height=150 alt="">


                                            <ul>
                                                <li class="list-group-item">

                                                    <i class="icon wb-inbox" aria-hidden="true" draggable="true"></i>
                                                    奖项名称: {{co.award_name}}
                                                </li>
                                                <li class="list-group-item">

                                                    <i class="icon wb-user" aria-hidden="true" draggable="true"></i>
                                                    奖品名称:{{co.prize_name}}
                                                </li>
                                                <li class="list-group-item">
                                                    <i class="icon wb-bell" aria-hidden="true" draggable="true"></i>
                                                    奖品数量:{{co.prize_num}}
                                                </li>
                                                <li class="list-group-item">
                                                    <i class="icon wb-info-circle" aria-hidden="true"
                                                       draggable="true"></i>
                                                    每次抽取数:{{co.single_num}}
                                                </li>

                                            </ul>

                                        </div>

                                    </Card>

                                </i-col>
                                <i-col span="12"  >
                                    <Card :bordered="false">
                                        <p slot="title">

                                            <a href="#" slot="title" @click.prevent="vipShow(co)">
                                                <Icon type="person-add"></Icon>
                                                vip管理,点此选择用户
                                            </a>


                                        </p>

                                        <ul class='viplist'>
                                            <li v-for="(index,u) in co.vips" style='margin:1px' v-on:remove="co.vips.splice(index, 1)">
                                                 <span>
                                                    {{{getAvatar(u)}}} - {{ u.nickname }}-{{ u.mobile }}<Icon
                                                         type="close"  @click='removeVip(co,index)' ></Icon>
                                                </span>
                                            </li>
                                        </ul>
                                    </Card>


                                </i-col>
                            </Row>
                        </Card>


                    </li>
                </template>

            </ul>
        </div>

    </div>


    <div class="modal fade modal-fade-in-scale-up" id="exampleNiftyFadeScale" aria-hidden="true"
         aria-labelledby="exampleModalTitle" role="dialog" tabindex="-1">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">×</span>
                    </button>
                    <h4 class="modal-title">上传</h4>
                </div>
                <div class="modal-body">

                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-default margin-0" data-dismiss="modal">取消
                    </button>

                </div>
            </div>
        </div>
    </div>
    <aside :show.sync="showRight" placement="right" header="编辑信息" :width="450" style="top:70px;">
        <form class="form_valid">
            <div class="task-main-editor1">

                <div class="form-group">


                    <div class="dropzone   award_uppic"
                         id="dropzone_0"
                         style="margin:10px;"

                         data-title="上传图片">
                        <template v-if="item.pic">
                            <img dz-clickable
                                 class="image  " style="z-index:-10"

                                 :src="app.img+item.pic.url" height="120"
                                 alt="...">
                            <span class="addMember-remove"
                                  @click="reset()"><i
                                    class="wb-minus-circle"></i></span>
                        </template>

                        <input type="hidden" name="context" value="{{context}}">

                        <div class="fallback">

                        </div>
                    </div>

                </div>


                <div class="form-group">
                    <label class="control-label">奖项名称</label>
                    <input type="text" class="form-control" name="award_name" v-model="item.award_name"
                           placeholder="" autocomplete="off">
                </div>
                <div class="form-group">
                    <label class="control-label">奖品名称</label>
                    <input type="text" class="form-control" name="prize_name" v-model="item.prize_name"
                           placeholder="" autocomplete="off"  >
                </div>
                <div class="form-group">
                    <label class="control-label">奖品数量</label>
                    <input type="number" min=1  class="form-control" name="prize_num" v-model="item.prize_num"   />

                </div>
                <div class="form-group">
                    <label class="control-label">每次抽取数量</label>
                     <input type="number"   class="form-control" name="single_num" v-model="item.single_num" min="1" max="200" />


                </div>


                <div class="form-group">
                    <button class="btn btn-primary task-main-editor-save" type="submit">保存</button>
                    <button class="btn btn-primary task-main-editor-save" type="button" @click="remove">删除</button>
                </div>

            </div>
        </form>
    </aside>
    <aside :show.sync="showVip" placement="right" header="vip名单" :width="450" style="top:70px;">
        <div style="padding-right:10px" class=" ">
            <div class="ivu-select ivu-select-single">
                <div class="ivu-select-selection">
                    <!--v-for-start--><!--v-for-end-->
                    <span class="ivu-select-placeholder" style="display: none;">请选择</span>
                    <span class="ivu-select-selected-value" style="display: none;"></span>
                    <input type="text" class="ivu-select-input" v-model="vipselect"
                           placeholder="请选择"><!--v-if-->
                    <i class="ivu-select-arrow ivu-icon ivu-icon-ios-close" style="display: none;"></i>
                    <!--v-component-->
                    <i class="ivu-select-arrow ivu-icon ivu-icon-arrow-down-b"></i><!--v-component-->
                </div>

                <div class="ivu-select-dropdown1 slide-up-transition" style="transform-origin: center top 0px;  ">
                    <ul class="ivu-select-not-found" style="display: none;">
                        <li>无匹配数据</li>
                    </ul>
                    <ul class="ivu-select-dropdown-list">

                        <li class="ivu-select-item" v-for="item in vipUsers" @click.stop="selectVip(item)"
                            v-show="gethide(item)">
                            {{ item.nickname }} -- {{ item.mobile }}
                        </li>
                    </ul>
                </div>
            </div>
        </div>


    </aside>


</template>
<style>
    .award1 .page-content {
        margin-right: 450px;
    }

    .award .avatar img {
        height: 100px;
    }

    .award .thumbnail > img {
        display: block;
        max-width: 100%;
        height: 150px;
    }

    .award figure {
        margin: 10px;
        background: #ffffff;
        overflow: hidden;
        padding-bottom: 10px;

    }

    .award figure img {

        object-fit: cover;

    }

    .app-media .slidePanel-header {
        height: 10px;
        width: 100%;
    }

    .award_uppic {
        min-height: 100px;

        height: 120px;
        padding: 0;
        border: 1px dashed #dddddd;

    }

    .poll .dz-preview .dz-image {
        border-radius: 10px;
        overflow: hidden;
        width: 180px;
        height: 180px;
        position: relative;
        display: block;
        z-index: 10;
    }
    .ivu-select-dropdown1{
        width: inherit;

        overflow: auto;
        margin: 5px 0;
        padding: 5px 0;
        background-color: #fff;
        border:1px solid gray;
        box-sizing: border-box;
        position: absolute;
        z-index: 900;
        min-height:500px;

        width:100%;
    }
    .irow{
     margin:5px;
     padding:5px;
     border:1px solid #f3f7f9;

    }
    .viplist{
        overflow:auto;
        height:270px;
    }
    .task-main-editor1 .from-control{

     width:200px;
    }




</style>

<script>


    var infiniteScroll = require('vue-infinite-scroll').infiniteScroll;

    import {whatever, api} from "../../utils/leven"
    import {aside} from '../../lib/vue-strap'

    var uuid = require('node-uuid');
    var Dropzone = require("dropzone/dist/min/dropzone-amd-module.min")
    Dropzone.autoDiscover = false;

    export default{
        directives: {infiniteScroll},
        components: {
            aside,

        },
        data(){
            return {
                index: 0,
                showLeft: false,
                showRight: false,
                showVip:false,
                add: true,
                context: "awards",
                hidden: false,
                count: 0,
                skip: 0,
                busy: false,
                items: [],
                item: {},
                choice: {

                    id: "",
                    award: "",
                    name: ""
                },
                vipUsers:[],
                vipselect:'',

                tempitem:{},
                model1: '',
                  config:{}

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
            getAvatar(n){
                var img=n.avatar.dealAvatar()

                return "<img src='"+img+"' width='40' height='40'>"
            },

            get_repeat:function(){
             var _vm = this;

                api(_vm).get(_vm.app.api + '/awardwall/configs/' + _vm.app.aid).then(function (data) {

                    _vm.config = data.data;
                    //callback()


                }).catch(function(ex) {
                    console.log('parsing failed', ex)
                    //callback()
                });

            },

            set_repeat:function(){

                var _vm = this;

                //_vm.item.style=parseInt(_vm.item.style);

                api(_vm).post(_vm.app.api + '/awardwall/configs/update/' + _vm.app.aid,

                      JSON.stringify(_vm.config)

                 ).then(function (item) {

                    console.log(item);
                    toastr.info('保存成功')

                });

            },
            gethide (item) {

                return  new RegExp(this.vipselect, 'i').test(item.nickname+item.mobile);
            },
            selectVip(item){
                var isExist= _.findIndex(this.item.vips, function(chr) {

                  return chr.id == item.id;
                });
                var _vm=this;
                isExist==-1?this.item.vips.push(item):""
                this.add=false;
                this.tempitem=this.item;
                isExist==-1?this.save(function(){
                     console.log(_vm.tempitem)
                    _vm.item=_vm.tempitem
                }):""
            },
            removeVip(co,index){
                this.item=co;
                this.item.vips.splice(index,1)
                this.add=false;
                this.save()
            },
            init: function () {
                 ///this.searchLabel = $(".ivu-select-dropdown-list").html()//.innerHTML;
                // this.uploadUrl = "htt.p://localhost:9999/upload",
                var _vm = this;
                this.getdata(function () {


                });
                 this.get_repeat();
                _vm.getvips()

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

                this.formValid()
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
            reset: function () {
                var _vm = this;
                _vm.item.pic = null;
                _vm.setup(".dropzone");
            },
            selected: function (item) {
                this.item = item;
                this.add = false;
                this.showRight = true;
                this.setup(".dropzone");

            },
            vipShow: function (item) {
                this.item = item;
                this.add=false;

                this.showVip = true;


            },
            remove: function () {

                //this.item.delete(index)
                var _vm = this;
                //this.items.splice(_vm.index, 1)
                api(_vm).post(_vm.app.api + '/awardwall/award/delete/' + _vm.item.id).then(function (item) {

                    console.log(item);
                    _vm.items = _.filter(_vm.items, function (o) {
                        return o.id != _vm.item.id;
                    });
                    _vm.new_item()
                    toastr.info('删除成功')

                });
            },
            formValid: function () {

                var _vm = this;

                $(".form_valid").formValidation({
                    framework: "bootstrap",
                    button: {selector: '[type="submit"]:not([formnovalidate])', disabled: "disabled"},
                    icon: null,
                    fields: {
                        title: {validators: {notEmpty: {message: "题目不能为空"}}},
                        'award_name': {
                            validators: {
                                notEmpty: {
                                    message: '奖项名称不能为空'
                                },
                                stringLength: {
                                    max: 100,
                                    message: '选项不能超过100个字'
                                }
                            }
                        },
                        'prize_name': {
                            validators: {
                                notEmpty: {
                                    message: '奖品名称不能为空'
                                },
                                stringLength: {
                                    max: 100,
                                    message: '选项不能超过100个字'
                                }
                            }
                        },
                        'prize_num': {
                            validators: {
                                notEmpty: {
                                    message: '奖品数量不能为空'
                                },
                                stringLength: {
                                    max: 100,
                                    message: '选项不能超过100个字'
                                }
                            }
                        }

                    }
                }).on('success.form.fv', function (e) {

                    _vm.save();
                    return false;
                })

            },
            save: function (callback) {
                var _vm = this;
                //_vm.item.style=parseInt(_vm.item.style);

                var act = this.add ? "new" : "update"
                var id = this.add ? _vm.app.aid : _vm.item.id;
                api(_vm).post(_vm.app.api + '/awardwall/award/' + act + '/' + id, JSON.stringify(_vm.item))
                 .then(function (item) {
                    _vm.add ? _vm.items.push(item.data) : ""

                    _vm.item = {}

                    _vm.showRight = false;
                     $('.form_valid').data('formValidation').resetForm();

                     toastr.info('保存成功')

                     whatever(callback)

                });
            },
            getdata: function (callback) {
                var _vm = this;
                console.log(this.app)
                api(_vm).get(_vm.app.api + '/awardwall/' + _vm.app.aid)
                .then(function (data) {
                    var items=data.data

                    _vm.items = items;
                    whatever(callback)


                }).catch(function (ex) {
                    console.log('parsing failed', ex)
                    whatever(callback)

                });

            },
            getvips: function (callback) {
                var _vm = this;
                console.log(this.app)
                api(_vm).get(_vm.app.api + '/signinwall/' + _vm.app.aid)
                .then(function (data) {
                   _.each(data.data,function(n){

                         _vm.vipUsers.push(n)

                   })

                    _vm.$parent.hideLoading();
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


                try {
                    $(that).dropzone({

                        dictDefaultMessage: $(that).data("title"),
                        maxFiles: 1,
                        paramName: "file",
                        url: _vm.app.upload,
                        headers: {
                            'Accept': 'application/json',

                            'Authorization': _vm.app.token
                        },
                        init: function () {

                            this.on("success", function (file, response) {
                                $('.dz-progress').hide();
                                $('.dz-size').hide();
                                $('.dz-error-mark').hide();


                                _vm.item.pic = response
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
                    // alert(e)
                }
            }
        },
        ready: function () {

        }

    }




</script>
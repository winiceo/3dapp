<template>

    <div class="page animsition award">
        <div class="page-header page-header-bordered page-header-tabs">
            <h3>奖品管理</h3>
            <div class="page-header-actions">
                <button type="button" class="btn btn-dark" @click="new_item" data-animation="scale-up"><i
                        class="icon wb-plus" aria-hidden="true"></i>添加
                </button>
            </div>


        </div>

        <div class="page-content ">
            <div class="panel">
                <ul class="blocks blocks-100 blocks-xlg-4 blocks-md-3 blocks-sm-2" id="exampleList"
                    data-filterable="true">
                    <template v-for="(index,co) in items" track-by="$index">
                        <li data-type="animal" @click="selected(co)">


                            <figure class="widget widget-article widget-shadow">
                                <div class="widget-header cover">
                                    <img :src="app.img+co.pic.url" class="cover-image" height=150 alt="">

                                </div>
                                <div class="widget-content">
                                    <ul class="list-group list-group-bordered">
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
                                            <i class="icon wb-info-circle" aria-hidden="true" draggable="true"></i>
                                            每次抽取数:{{co.single_num}}
                                        </li>
                                    </ul>
                                </div>

                            </figure>


                        </li>
                    </template>

                </ul>
            </div>
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

    <aside :show.sync="showRight" placement="right" header="编辑信息" :width="250" style="top:70px;">
        <form class="form_valid">
            <div class="task-main-editor">

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
                           placeholder="" autocomplete="off">
                </div>
                <div class="form-group">
                    <label class="control-label">奖品数量</label>
                    <input type="number" min=1 class="form-control" name="prize_num" v-model="item.prize_num"
                           placeholder="" autocomplete="off">
                </div>
                <div class="form-group">
                    <label class="control-label">每次抽取数量</label>
                    <input type="number" min=1 class="form-control" v-model="item.single_num"
                           placeholder="" autocomplete="off">
                </div>


                <div class="form-group">
                    <button class="btn btn-primary task-main-editor-save" type="submit">保存</button>
                    <button class="btn btn-primary task-main-editor-save" type="button" @click="remove">删除</button>
                </div>

            </div>
        </form>
    </aside>


</template>
<style>
    .award .page-content {
        margin-right: 250px;
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
        components: {aside},
        data(){
            return {
                index: 0,
                showLeft: false,
                showRight: false,
                add: true,
                context: "awards",

                count: 0,
                skip: 0,
                busy: false,
                items: [],
                item: {},
                choice: {

                    id: "",
                    award: "",
                    name: ""
                }
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


                });

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
            save: function () {
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

                });
            },
            getdata: function (callback) {
                var _vm = this;
                console.log(this.app)
                api(_vm).get(_vm.app.api + '/awardwall/' + _vm.app.aid)
                .then(function (data) {
                    var items=data.data
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
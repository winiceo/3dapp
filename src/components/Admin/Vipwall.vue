<template>

    <div class="page animsition vip">

        <Row class='pagehead'>
            <i-col span="12"> <h3>嘉宾墙</h3></i-col>
            <i-col span="12" class='action'>  <button type="button" class="btn btn-dark" @click="new_item" data-animation="scale-up"><i
                    class="icon wb-plus" aria-hidden="true"></i>添加
            </button></i-col>

        </Row>


        <div class="page-content ">

                <ul class="blocks blocks-100 blocks-xlg-4 blocks-md-2 blocks-sm-2" id="exampleList"
                    data-filterable="true">
                    <template v-for="(index,co) in items" track-by="$index">
                        <li data-type="animal" @click="selected(co);">

                            <Card  style='margin:5px;height:250px'>
                                <p slot="title">
                                    <Icon type="ios-navigate-outline"></Icon>
                                    {{co.name}}
                                </p>

                                <p>
                                    <figure class="widget-header bg-white-600 padding-10 overlay-hover  ">
                                        <a v-if="co.pic!=null"
                                           class="avatar   img-bordered bg-white pull-left margin-right-20"
                                           href="javascript:void(0)">
                                            <img :src="app.img+co.pic.url" class="avatar_img" width=100 height=100 alt="">
                                        </a>
                                        <div class="vertical-align height-100 text-truncate">
                                            <div class="vertical-align-middle">
                                                <div class="font-size-20 margin-bottom-5 text-truncate">{{co.title}}</div>
                                                <div class="font-size-14 text-truncate">{{co.name}}</div>
                                            </div>
                                        </div>
                                        <figcaption class="overlay-panel overlay-background overlay-fade  ">
                                            简介: {{co.description}}

                                        </figcaption>
                                    </figure>
                                </p>


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

    <aside :show.sync="showRight" placement="right" header="编辑信息" :width="550" style="top:70px;">
        <form class="form_valid">
            <div class="task-main-editor ">

                <div class="form-group">


                    <div class="dropzone   vip_uppic"
                         id="dropzone_0"
                         style="margin:10px;"

                         data-title="上传图片">
                        <template v-if="item.pic!=null">
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
                    <label class="control-label">
                        嘉宾姓名</label>
                    <input type="text" class="form-control" name='name' v-model="item.name"
                           placeholder="" autocomplete="off">
                </div>
                <div class="form-group">
                    <label class="control-label">嘉宾职位</label>
                    <input type="text" class="form-control" name="title" v-model="item.title"
                           placeholder="" autocomplete="off">
                </div>
                <div class="form-group">
                    <label class="control-label">嘉宾介绍</label>
                    <textarea class="maxlength-textarea form-control" data-plugin="maxlength"
                              data-placement="bottom-right-inside" rows="3"
                              placeholder="" v-model="item.description"></textarea>

                </div>


                <div class="form-group">
                    <button class="btn btn-primary  " type="submit">保存</button>
                    <button class="btn btn-primary  " type="button" @click="remove">删除</button>
                </div>

            </div>
        </form>
    </aside>


</template>
<style>
    .vip .page-content {
        margin-right: 250px;
    }

    .vip .avatar {

        width: 150px

    }

    .vip .avatar_img {

        object-fit: cover;
        height: 150px;
        width: 150px

    }

    .vip figure {
        margin: 0;
        padding: 0;
        background: #e4eaec;
        overflow: hidden;
    }

    .app-media .slidePanel-header {
        height: 10px;
        width: 100%;
    }

    .vip_uppic {
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

                this.formValid();

                window.Site.cc();
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
                this.showRight = true


                this.setup(".dropzone");


            },
            formValid: function () {

                var _vm = this;

                $(".form_valid").formValidation({
                    framework: "bootstrap",
                    button: {selector: '[type="submit"]:not([formnovalidate])', disabled: "disabled"},
                    icon: null,
                    fields: {

                        'name': {
                            validators: {
                                notEmpty: {
                                    message: '姓名不能为空'
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
            remove: function () {

                //this.item.delete(index)
                var _vm = this;
                //this.items.splice(_vm.index, 1)
                api(_vm).post(_vm.app.api + '/vipwall/vip/delete/' + _vm.item.id
                ).then(function () {


                    _vm.items = _.filter(_vm.items, function (o) {
                        return o.id != _vm.item.id;
                    });
                    _vm.showRight = false;
                    toastr.info('删除成功')

                });
            },
            save: function () {
                var _vm = this;
                //_vm.item.style=parseInt(_vm.item.style);

                var act = this.add ? "new" : "update"
                var id = this.add ? _vm.app.aid : _vm.item.id;
                api(_vm).post(_vm.app.api + '/vipwall/vip/' + act + '/' + id, JSON.stringify(_vm.item))
                .then(function (item) {
                    _vm.add ? _vm.items.push(item.data) : ""
                    _vm.item = {}
                    toastr.info('保存成功')
                    _vm.showRight = false

                    $('.form_valid').data('formValidation').resetForm();


                });
            },
            getdata: function (callback) {
                var _vm = this;
                console.log(this.app)
                api(_vm).get(_vm.app.api + '/vipwall/' + _vm.app.aid).then(function (data) {
                    var items=data.data

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
        },
        ready: function () {

        }

    }
</script>
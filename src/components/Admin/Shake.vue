<template>

    <div class="page animsition award">
        <Row class='pagehead'>
            <i-col span="11"><h3>摇一摇</h3></i-col>

            <i-col span="13" class='action'>

                <button type="button" class="btn btn-dark" @click="new_item" data-animation="scale-up"><i
                        class="icon wb-plus" aria-hidden="true"></i>添加
                </button>
            </i-col>

        </Row>
        <Row style="padding:15px;height:50px">
            <i-col span="24">
                <div class="ivu-card">

                    <div class="ivu-card-body">
                        <Row style="padding:15px;height:50px">
                            <i-col span="24">

                                <Switch @on-change="changeState" size="large" :checked="shakeset.filtered">
                                    <span slot="open">限制</span>
                                    <span slot="close">不限</span>
                                </Switch>

                                <span v-show="shakeset.filtered">
                               比赛结果的前
                                        <Input-number   :min="1" :value="shakeset.filtered_num"></Input-number>

                                      名
                ，不能参与之后
                                                                        <Input-number   :min="1" :value="shakeset.filtered_round"></Input-number>
 轮摇一摇

                                    </span>
                                <button class="btn btn-primary " @click="shake_save">保存</button>

                            </i-col>
                        </Row>


                    </div>
                </div>
            </i-col>

        </Row>


        <div class="page-content ">

            <ul class="blocks blocks-100 blocks-xlg-4 blocks-md-3 blocks-sm-2" id="exampleList"
                data-filterable="true">
                <template v-for="(index,co) in items" track-by="$index">
                    <li data-type="animal" @click="showRight = true ,item=co,index=index,add=false">
                        <Card style='margin:5px;'>
                            <p slot="title">
                                <Icon type="ios-navigate-outline"></Icon>
                                {{co.title}}
                            </p>


                            <p>摇一摇时间:{{co.duration}}秒</p>
                            <p> 最终显示前几名:{{co.number}}</p>
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
            <div class="task-main-editor">


                <div class="form-group">
                    <label class="control-label">摇一摇标题</label>
                    <input type="text" name='title' class="form-control" v-model="item.title"
                           placeholder="" autocomplete="off">
                </div>
                <div class="form-group">
                    <label class="control-label">摇一摇时间(秒)</label>
                    <input type="number" min=1 class="form-control" v-model="item.duration"
                           placeholder="" autocomplete="off">
                </div>
                <div class="form-group">
                    <label class="control-label">最终显示前几名</label>
                    <input type="number" min=1 class="form-control" v-model="item.number"
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
        padding:5px;
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
    .mypanel1 {
        border-radius: 3px;
        padding: 2px;
        margin: 5px;
        background: white;
        height:40px;

    }
    .mypanel1 .form-control{

    width:100px;
    }

    .mypanel1 .tt{

    width:50px;
    }












</style>

<script>


    var infiniteScroll = require('vue-infinite-scroll').infiniteScroll;

    import {whatever,api} from "../../utils/leven"
    import {aside} from '../../lib/vue-strap'

    var uuid = require('node-uuid');
    var Dropzone = require("dropzone/dist/min/dropzone-amd-module.min")
    Dropzone.autoDiscover = false;
    require("switchery/dist/switchery.css")
    var Switchery = require("switchery")



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
                },
                shakeset:{}
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
            changeState:function(a){
                console.log(a)
                this.shakeset.filtered=a
            },
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

            },

            new_item: function () {
                this.showRight = true
                this.item = {duration: 30,number:1}
                this.add = true;
                var _vm = this;




            },
            reset: function () {
                var _vm = this;
                _vm.item.pic = null;
                // _vm.setup(".dropzone");
            },
            selected: function (item) {
                this.item = item;
                this.add = false;
                //_vm.setup(".dropzone");

            },
            remove: function ( ) {

                //this.item.delete(index)
                var _vm = this;
                //this.items.splice(_vm.index, 1)
                api(_vm).post(_vm.app.api + '/shakewall/shake/delete/' + _vm.item.id).then(function (item) {

                    console.log(item);
                    _vm.items = _.filter(_vm.items, function (o) {
                        return o.id != _vm.item.id;
                    });

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
                        'title': {
                            validators: {
                                notEmpty: {
                                    message: '选项不能为空'
                                },
                                stringLength: {
                                    max: 50,
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
                api(_vm).post(_vm.app.api + '/shakewall/shake/' + act + '/' + id,JSON.stringify(_vm.item)

               ).then(function (item) {
                    _vm.add ? _vm.items.push(item.data) : ""
                    _vm.item = {}
                    _vm.showRight = false;
                    toastr.info('保存成功')
                    $('.form_valid').data('formValidation').resetForm();

                });
            },

            shake_save: function () {
                var _vm = this;
                //_vm.item.style=parseInt(_vm.item.style);


                var id =   _vm.app.aid
                _vm.shakeset.id= parseInt(id);
                api(_vm).post(_vm.app.api + '/shakewall/update/' + id,JSON.stringify(_vm.shakeset)

               ).then(function (item) {

                    toastr.info('设置成功')


                });
            },
            getdata: function (callback) {
                var _vm = this;
                console.log(this.app)
                api(_vm).get(_vm.app.api + '/shakewall/' + _vm.app.aid).then(function (data) {

                    var sset=data.data
                    _vm.shakeset={
                        id: sset.id,
                        filtered: sset.filtered,
                        filtered_num: sset.filtered_num,
                        filtered_round: sset.filtered_round
                    }


                    _vm.items = data.data.shakes;
                    whatever(callback)

                    _vm.switchery();
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
                            this.on("complete", function (file) {
                                this.removeFile(file);

                            });


                        }

                    });
                } catch (e) {
                    // alert(e)
                }
            }
            ,switchery: function () {
                var _vm = this;


                var elems = (document.querySelectorAll('.js-switch'));

                _.each(elems, function (n, i) {
                    var switchery = new Switchery(n);
                    $(switchery.switcher).click(function () {
                        _vm.shakeset.filtered = $(n).prop("checked") ? 1 : 0
                    })
                    switchery.setPosition(_vm.shakeset.filtered)

                })
            }
        },
        ready: function () {

        }

    }








</script>
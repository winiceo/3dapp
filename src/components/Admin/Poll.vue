<template>
    <div class="page animsition">
        <!-- Notebook Sidebar -->
        <div class="page-aside">
            <div class="page-aside-switch">
                <i class="icon wb-chevron-left" aria-hidden="true"></i>
                <i class="icon wb-chevron-right" aria-hidden="true"></i>
            </div>
            <div class="page-aside-inner">
                <div class="well">投票列表</div>

                <div class="app-notebook-list " data-plugin="pageAsideScroll">
                    <div data-role="container">
                        <div data-role="content">
                            <ul class="list-group" v-infinite-scroll="loadMore()" infinite-scroll-disabled="busy"
                                infinite-scroll-distance="100">
                                <template v-for="(index,item) in items" track-by="$index">

                                    <li class="list-group-item    " @click="selected(item)">
                                        <h4 class="list-group-item-heading">{{item.title}}</h4>

                                        <div class="info">
                                            <span class="icon wb-trash " @click="removeItem=item;removeIndex=$index"
                                                  data-animation="scale-up" data-target="#exampleNiftyFadeScale"
                                                  data-toggle="modal"></span>
                                            <span class="time"></span>


                                        </div>


                                    </li>
                                </template>

                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="page-main">
            <div class="page-content">

                <div class="row row-lg ">
                <form class="form_valid">
                    <div class="col-sm-6">

                        <div class="panel panel-bordered panel-dark"
                             style="animation-fill-mode: backwards; animation-duration: 250ms; animation-delay: 0ms;">
                            <div class="panel-heading">
                                <h3 class="panel-title">投票设置</h3>

                            </div>

                            <div class="panel-body">


                                <div class="form-group">
                                    <label class="control-label">题目</label>
                                    <input type="text" name="title" id="title" class="form-control" v-model="item.title">


                                </div>
                                <div class="form-group">
                                    <label class="control-label">是否多选</label>
                                    <div>
                                        <div class="radio-custom radio-default radio-inline">
                                            <input type="radio" value=0 v-model="item.multiple">
                                            <label>单选</label>
                                        </div>
                                        <div class="radio-custom radio-default radio-inline">
                                            <input type="radio" value=1 v-model="item.multiple">

                                            <label>多选</label>
                                        </div>
                                    </div>
                                </div>
                                <template v-if="item.multiple==1">
                                    <div class="row row-lg">

                                        <div class="form-group col-sm-4">
                                            最多选
                                        </div>
                                        <div class="form-group col-sm-4">
                                            <input type="number" min=1 class="form-control"
                                                   v-model="item.max_choices" placeholder="最多选">
                                        </div>
                                        <div class="form-group col-sm-4">
                                            (0表示不限)
                                        </div>

                                    </div>
                                    <div class="row row-lg">
                                        <div class="form-group col-sm-4">
                                            最少选
                                        </div>
                                        <div class="form-group col-sm-4">
                                            <input type="number" min=1 class="form-control"
                                                   v-model="item.min_choices" placeholder="最少选">
                                        </div>
                                        <div class="form-group col-sm-4">
                                            (0表示不限)
                                        </div>
                                    </div>


                                </template>




                                <div class="form-group">
                                    <div class="col-sm-9 col-sm-offset-3">
                                        <button type="submit"
                                                class="btn btn-primary save_poll">保存
                                        </button>

                                    </div>
                                </div>


                            </div>

                        </div>


                    </div>

                    <div class="col-sm-6">
                        <div class="panel panel-bordered panel-dark"
                             style="animation-fill-mode: backwards; animation-duration: 250ms; animation-delay: 0ms;">
                            <div class="panel-heading">
                                <h3 class="panel-title">添加选项</h3>
                                <div class="panel-actions">

                                    <a class="  icon wb-plus" @click="add_choice"></a>
                                </div>
                            </div>
                            <div class="panel-body" style="padding-top: 0px; ">


                                <ul class="list-group list-group-dividered list-group-full">

                                    <template v-for="(index,co) in item.choices" track-by="$index"
                                              class="validate-field">

                                        <li class="list-group-item" id="li_{{$index}}">
                                            <div class="media">
                                                <div class="media-left">

                                                    <div class="dropzone thumbnail poll"
                                                          id="dropzone_{{$index}}"
                                                          style="margin:10px;"
                                                            data-index="{{$index}}"
                                                          data-title="上传图片">
                                                        <template v-if="co.pic">
                                                            <img dz-clickable
                                                                 class="image img-rounded overlay-figure overlay-scale"
                                                                 style="height:75px;width:75px;"
                                                                 :src="app.img+co.pic.url"
                                                                 alt="...">
                                                            <span class="addMember-remove"
                                                                  @click="reset_dropzone($index)"><i
                                                                    class="wb-minus-circle"></i></span>
                                                        </template>

                                                        <input type="hidden" name="context" value="{{context}}">

                                                        <div class="fallback">

                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="media-body" style=" vertical-align: middle;">
                                                    <div class="pull-right timeline-icon" v-if="$index>=2">
                                                        <i class="icon wb-close"
                                                           @click="item.choices.splice($index,1)"></i>
                                                    </div>

                                                    <div>
                                                        <div class="form-group">
                                                             <input type="hidden" name="id[]" v-model="co.id">
                                                            <input type="text" class="oo_name" name="name[]" placeholder="选项内容" v-model="co.name">


                                                        </div>


                                                    </div>
                                                </div>
                                            </div>
                                        </li>
                                    </template>

                                </ul>

                            </div>
                        </div>


                        <!-- End Example Basic Form Without Label -->
                    </div>


                </form>
                </div>


            </div>

        </div>


        <!-- Site Action -->
        <div class="site-action">
            <button type="button" @click="new_poll"
                    class="site-action-toggle btn-raised btn btn-success btn-floating ">
                <i class="front-icon wb-plus animation-scale-up" aria-hidden="true"></i>
                <i class="back-icon wb-close animation-scale-up" aria-hidden="true"></i>
            </button>

        </div>
        <!-- End Site Action -->


        <!-- End Create New Notes Modal -->


        <!--contextMenu END-->

    </div>

    <div class="modal fade modal-fade-in-scale-up" id="exampleNiftyFadeScale" aria-hidden="true"
         aria-labelledby="exampleModalTitle" role="dialog" tabindex="-1">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">×</span>
                    </button>
                    <h4 class="modal-title">确认要删除吗</h4>
                </div>
                <div class="modal-body">
                    <p>{{removeItem.title}}</p>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-default margin-0" data-dismiss="modal" @click="remove">确定
                    </button>
                    <button type="button" class="btn btn-primary" data-dismiss="modal">取消</button>
                </div>
            </div>
        </div>
    </div>

</template>
<style>
    .errors p {
        color: red
    }

    .page-aside + .page-main {
        margin-left: 270px;
    }
    .site-menubar-unfold .page, .site-menubar-unfold .site-footer {
        margin-left: 200px;
    }
    .page-aside {
        width: 250px;
    }

    .poll {
        min-height: 80px;
        width: 80px;
        height: 80px;
        padding: 0;
        border: 2px solid #edefef;

    }

    .poll .dz-preview .dz-image {
        border-radius: 10px;
        overflow: hidden;
        width: 100px;
        height: 100px;
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

    .addMember-remove {
        position: absolute;
        top: -2px;
        right: -2px;

        font-size: 25px;
        line-height: 1;
        color: #e8313b;
        cursor: pointer;
        background-color: #fff;
        border-radius: 50%;
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
    import {whatever, api} from "../../utils/leven"


    var uuid = require('node-uuid');

    export default{
        directives: {infiniteScroll},

        data(){
            return {

                add: true,
                context: "choices",

                count: 0,
                skip: 0,
                busy: false,
                items: [],
                removeItem: {},
                removeIndex: 0,
                tempPic: '',
                item: {},


                choice: {

                    id: "",
                    pic: "",
                    name: ""
                }
            }
        },

        methods: {
            init: function () {
                this.uploadUrl = this.app.api + "/common/image/new",
                        // this.uploadUrl = "http://localhost:9999/upload",

                        this.getdata();
                window.Site.cc();
                window.AppNoteBook = Site.extend({
                    handleHeight: function () {
                        var height = $(document).height()
                        console.log(height)


                        $(".page-main").css("height", (height - 70) + "px")
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

               // Dropzone.autoDiscover = false;
                this.new_poll()
                this.formValid()


            },
            setNames:function(){
                var _vm=this;
                setTimeout(function () {
                    var i=-1;
                    _.forEach(_vm.item.choices, function (n, key) {
                        var that = "#li_" + (++i);
                        var $option   = $(that).find('[name="name[]"]');
                        $('.form_valid').formValidation('addField', $option);

                    });

                }, 500)
            },
            formValid: function () {

                var _vm = this;

                $(".form_valid").formValidation({
                    framework: "bootstrap",
                    button: {selector: '[type="submit"]:not([formnovalidate])', disabled: "disabled"},
                    icon: null,
                    fields: {
                        title: {validators: {notEmpty: {message: "题目不能为空"}}},
                        'name[]': {
                            validators: {
                                notEmpty: {
                                    message: '选项不能为空'
                                },
                                stringLength: {
                                    max: 100,
                                    message: '选项不能超过100个字'
                                }
                            }
                        }

                    }
                }).on('success.form.fv', function (e) {

                    _vm.save_poll();
                    return false;
                })

            },
            selected: function (item) {
                var _vm = this;
                this.item = item;
                this.add = false;
                this.dropzone();
            },
            remove: function (index, item) {
                var index = this.removeIndex, item = this.removeItem;
                console.log(index, item)
                //this.item.delete(index)
                var _vm = this;
                 api(_vm).post(_vm.app.api + '/pollwall/question/delete/' + item.id).then(function (item) {
                    _vm.items = _.filter(_vm.items, function (o) {
                        return o.id != _vm.item.id;
                    });
                     _vm.new_poll();
                    console.log(item);
                    toastr.info('删除成功')

                });
            },
            add_choice: function () {
                var choice = _.clone(this.choice);
                this.item.choices.push(choice)
                var _vm = this;
                this.dropzone()
            },
            reset_dropzone: function (index) {
                var _vm = this;
                var that = "#dropzone_" + index;
                _vm.setup(that);
                console.log(that)
                _vm.tempPic = _vm.item.choices[index].pic = null
                // $(that).find("img").click(function (e) {


                setTimeout(function () {
                    if ($(that).find("a")[0]) {
                        $(that).find("a")[0].click();
                    }
                    // $(that).click();
                }, 100)


                //})
            },
            dropzone: function () {
                var _vm = this;
                setTimeout(function () {
                    var i = -1;
                    _.forEach(_vm.item.choices, function (n, key) {
                        var that = "#dropzone_" + (++i);
                        _vm.setup(that);
                        console.log(that)

                        $(that).find("img").click(function (e) {
                            ///$(this).hide();
                            //_vm.tempPic= _vm.item.choices[$(that).data("index")].pic = null
                            setTimeout(function () {
                                if ($(that).find("a")[0]) {
                                    $(that).find("a")[0].click();
                                }
                                $(that).click();
                            }, 100)

                        })
                    });
                    _vm.setNames()
                    //_vm.setup("#dropzone_" + (_vm.item.choices.length - 1));
                }, 100)

            },
            new_poll: function () {
                var _vm = this;

                this.item = {
                    choices: [],
                    max_choices: 3,
                    min_choices: 2,
                    multiple: 0
                };
                this.item.choices=[]

                this.add = true;
                this.dropzone();

                $(".dz-preview").remove();


                setTimeout(function(){
                    _vm.add_choice();
                    _vm.add_choice();
                },300)

            },
            save_poll: function () {
                var _vm = this;
                //_vm.item.style=parseInt(_vm.item.style);
                //alert('form is '+(this.$valid() ? 'VALID' : 'INVALID'));


                var act = this.add ? "new" : "update"
                var id = this.add ? _vm.app.aid : _vm.item.id;
                api(_vm).post(_vm.app.api + '/pollwall/question/' + act + '/' + id, JSON.stringify(_vm.item)

                ).then(function (o) {
                    if (_vm.add) {
                        _vm.items.unshift(o.data)
                    }
                    _vm.item = {};

                    _vm.new_poll()
                    $('.form_valid').data('formValidation').resetForm();


                    console.log(_vm.item);
                    toastr.info('保存成功')

                });
            },
            getdata: function (callback) {
                var _vm = this;
                console.log(this.app)
                api(_vm).get(_vm.app.api + '/pollwall/' + _vm.app.aid).then(function (data) {


                    _vm.items = data.data;
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
                try {
                    var _vm = this;


                    $(that).dropzone({

                        dictDefaultMessage: $(that).data("title"),
                        maxFiles: 1,
                        paramName: "file",
                        url:_vm.app.upload,

                        // previewTemplate:"",
                        headers: {
                            'Accept': 'application/json',

                            'Authorization': _vm.app.token
                        },
                        init: function () {

                            //alert($(that).data("field"))
                            // this.on("addedfile", function(file) { alert("Added file."); });
                            this.on("success", function (file, response) {
                                var _this = this;
                                $('.dz-progress').hide();
                                $('.dz-size').hide();
                                $('.dz-error-mark').hide();
                                console.log(response);
                                console.log(file);
                                $(".dz-image-preview").hide();
                                _vm.item.choices[$(that).data("index")].pic = response
                                setTimeout(function () {
                                    $(that).find("img").click(function (e) {

                                        // _vm.item.choices[$(that).data("index")].pic = null
                                        setTimeout(function () {
                                            if ($(that).find(".drop_delete")[0]) {
                                                $(that).find(".drop_delete")[0].click();

                                            }
                                            $(that).click();
                                        }, 100)
                                    })

                                }, 100)


                                //$(".dz-message").show("slow")

                            });

                            this.on("error", function (file) {

                                toastr.warning('上传失败请重试')
                            });

                            this.on("addedfile", function (file) {
                                var removeButton = Dropzone.createElement("<a href=\"#\" class='drop_delete'>删除</a>");
                                var _this = this;
                                $(".dz-image-preview").hide();
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

                } catch (e) {
                    console.log(e)
                }
            }
        }
    }
</script>
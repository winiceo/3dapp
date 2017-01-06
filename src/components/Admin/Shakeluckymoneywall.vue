<template>

    <div class="page animsition redpack">


        <Row class='pagehead'>
            <i-col span="11"><h3>摇红包</h3></i-col>

            <i-col span="13" class='action'>
                <input type="checkbox" id="inputChecked" v-model="config.repeat_awarded" @change='set_repeat'>
                <label for="inputChecked">是否允许重复中奖</label>
                <button type="button" class="btn btn-dark" @click="new_item" data-animation="scale-up"><i
                        class="icon wb-plus" aria-hidden="true"></i>添加
                </button>
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
                                {{co.title}}(<span v-if='co.type==1'>随机金额红包</span><span v-if='co.type==2'>固定金额红包</span>)
                            </p>


                            <p>摇红包时间:{{co.duration}}秒</p>
                            <p>总金额:{{co.total_amount}}</p>
                            <p>红包个数:{{co.total_num}}</p>
                        </Card>
                    </li>
                </template>

            </ul>
        </div>

    </div>


    <aside :show.sync="showRight" placement="right" header="编辑信息" :width="450" style="top:70px;">
        <form class="form_valid">
            <div class="task-main-editor">


                <div class="form-group">
                    <label class="control-label">摇红包标题</label>
                    <input type="text" name='title' class="form-control" v-model="item.title"
                           placeholder="" autocomplete="off">
                </div>
                <div class="form-group">
                    <label class="control-label">摇红包时间(秒)</label>
                    <input type="number" min=1 class="form-control" v-model="item.duration"
                           placeholder="" autocomplete="off">
                </div>

                <div class="form-group">
                    <label class="control-label">红包类型</label>
                    <Radio-group :model.sync="item.type" class="form-control">
                        <Radio value="1">
                            <Icon type="social-apple"></Icon>
                            <span>随机金额红包</span>
                        </Radio>
                        <Radio value="2">
                            <Icon type="social-android"></Icon>
                            <span>固定金额红包</span>
                        </Radio>

                    </Radio-group>

                </div>
                <div class="form-group">
                    <label class="control-label">总金额</label>
                    <input type="number" min=1 class="form-control" v-model="item.total_amount"
                           placeholder="" autocomplete="off">
                </div>
                <div class="form-group">
                    <label class="control-label">红包个数</label>
                    <input type="number" min=1 class="form-control" v-model="item.total_num"
                           placeholder="" autocomplete="off">
                </div>
                <div class="form-group">
                    <label class="control-label">中奖祝福语</label>
                    <input type="text" class="form-control" v-model="item.wishing"
                           placeholder="恭喜你中了个红包" autocomplete="off">
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
    .redpack .page-content {
        margin-right: 0px;
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



    import {whatever, api} from "../../utils/leven"
    import {aside} from '../../lib/vue-strap'


    export default{

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
            changeState:function(a){
                console.log(a)
                this.shakeset.filtered=a
            },
            _onGroupChange:function(a){
               console.log(a)
                this.item.type=a.srcElement._value;
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
                api(_vm).post(_vm.app.api + '/shakeluckymoneywall/shake/delete/' + _vm.item.id).then(function (item) {

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
                api(_vm).post(_vm.app.api + '/shakeluckymoneywall/luckymoney/' + act + '/' + id,JSON.stringify(_vm.item)

               ).then(function (item) {
                    _vm.add ? _vm.items.push(item.data) : ""
                    _vm.item = {}
                    _vm.showRight = false;
                    _vm.$notification[type]({
                        message: "成功",
                        description: "保存成功"
                      });
                    $('.form_valid').data('formValidation').resetForm();

                });
            },

            shake_save: function () {
                var _vm = this;
                //_vm.item.style=parseInt(_vm.item.style);


                var id =   _vm.app.aid
                _vm.shakeset.id= parseInt(id);
                api(_vm).post(_vm.app.api + '/shakeluckymoneywall/update/' + id,JSON.stringify(_vm.shakeset)

               ).then(function (item) {

                    toastr.info('设置成功')


                });
            },
            getdata: function (callback) {
                var _vm = this;
                console.log(this.app)
                api(_vm).get(_vm.app.api + '/shakeluckymoneywall/' + _vm.app.aid).then(function (data) {

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



             switchery: function () {
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
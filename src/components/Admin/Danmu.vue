<template>
    <div class="page animsition">

        <Row class='pagehead'>
            <i-col span="24"> <h3>弹幕</h3></i-col>

        </Row>

        <div class="page-content">
            <div class="panel">
                <div class="panel-body container-fluid">
                    <div class="row row-lg">
                        <div class="col-sm-12 col-md-6">
                            <!-- Example Horizontal Form -->
                            <div class="example-wrap">


                                <div class="example">
                                    <form class="form-horizontal">


                                        <div class="form-group">
                                            <label class="col-sm-3 control-label"> 弹幕循环: </label>
                                            <div class="col-sm-9">


                                                <input type="checkbox" value=1 class="js-switch"
                                                       v-model="item.circulate"/>


                                            </div>
                                        </div>
                                        <div class="form-group">
                                            <label class="col-sm-3 control-label">弹幕样式: </label>
                                            <div class="col-sm-9">
                                                <div class="radio-custom radio-default radio-inline">
                                                    <input type="radio" id="style-0" name="radio[]" value=1
                                                           v-model="item.style">
                                                    <label for="style-0">婉约</label>
                                                </div>
                                                <div class="radio-custom radio-default radio-inline">
                                                    <input type="radio" id="style-1" name="radio[]"
                                                           value=2 v-model="item.style">
                                                    <label for="style-1">粗犷</label>
                                                </div>
                                            </div>
                                        </div>

                                        <div class="form-group">
                                            <label class="col-sm-3 control-label">显示位置: </label>
                                            <div class="col-sm-9">
                                                <div class="checkbox-custom checkbox-primary">
                                                    <input type="checkbox" value="top" id="position-1"
                                                           v-model="item.position">
                                                    <label for="position-1">头部</label>
                                                </div>
                                                <div class="checkbox-custom checkbox-primary">
                                                    <input type="checkbox" id="position-2" value="middle"
                                                           v-model="item.position">
                                                    <label for="position-2">中部</label>
                                                </div>
                                                <div class="checkbox-custom checkbox-primary">
                                                    <input type="checkbox" value="bottom" id="position-3"
                                                           v-model="item.position">
                                                    <label for="position-3">尾部</label>
                                                </div>

                                            </div>
                                        </div>

                                        <div class="form-group">
                                            <label class="col-sm-3 control-label">字体大小: </label>
                                            <div class="col-sm-9">
                                                <input id="fontsize" type="range" v-model="item.font_size" step="12"
                                                       min="24" max="48">
                                            </div>
                                        </div>


                                        <div class="form-group">
                                            <label class="col-sm-3 control-label">移动速度: </label>
                                            <div class="col-sm-9">
                                                <input id="speed" type="range" v-model="item.speed" step="0.1" min="0.2"
                                                       max="0.4">
                                            </div>
                                        </div>


                                        <div class="form-group">
                                            <div class="col-sm-9 col-sm-offset-3">
                                                <button type="button" class="btn btn-primary " @click="save()">保存
                                                </button>
                                                <!--<button type="reset" class="btn btn-default btn-outline">预览</button>-->
                                            </div>
                                        </div>


                                    </form>
                                </div>
                            </div>
                            <!-- End Example Horizontal Form -->
                        </div>


                    </div>
                </div>
            </div>


        </div>
    </div>

</template>
<style>


</style>
<script>
    require("switchery/dist/switchery.css")
    var Switchery = require("switchery")
    import {whatever, api} from "../../utils/leven"


    export default{

        data(){
            return {
                item: {
                    position: []
                }
            }
        },
        methods: {
            init: function () {
                window.Site.cc();
                var _vm=this;

                this.getdata(function(){
                    _vm.switchery();

                })

            },
            getdata:function(callback){
                var _vm = this;
                api(_vm).get(_vm.app.api + '/danmaku/' + _vm.app.aid).then(function (data) {
                    var item=data.data
                    item.position = $.parseJSON(item.position)
                    console.log(item);
                    _vm.item = item;
                    callback()


                }).catch(function(ex) {
                    console.log('parsing failed', ex)
                    callback()
                });

            },
            save: function () {
                var _vm = this;
                //_vm.item.style=parseInt(_vm.item.style);

                api(_vm).post(_vm.app.api + '/danmaku/update/' + _vm.app.aid,

                      JSON.stringify(_vm.item)

                 ).then(function (item) {

                    console.log(item);
                    toastr.info('保存成功')

                });
            },
            switchery: function () {
                var _vm = this;


                var elems = (document.querySelectorAll('.js-switch'));

                _.each(elems, function (n, i) {
                    var switchery = new Switchery(n);
                    $(switchery.switcher).click(function () {
                        _vm.item.circulate = $(n).prop("checked") ? 1 : 0
                    })
                    switchery.setPosition(_vm.item.circulate)

                })
            }
        }
    }
</script>
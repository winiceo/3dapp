<template>
    <div class="page animsition">
        <div class="page-header page-header-bordered page-header-tabs">
            <h3>签到配置</h3>


        </div>

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
                                            <label class="col-sm-3 control-label">3D文字: </label>
                                            <div class="col-sm-9">
                                                <input id="fontsize" type="text" v-model="item.text3d"  >
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


                })

            },
            getdata:function(callback){
                var _vm = this;
                api(_vm).get(_vm.app.api + '/signinwall/configs/' + _vm.app.aid).then(function (data) {
                    var item=data.data

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

                api(_vm).post(_vm.app.api + '/signinwall/configs/update/' + _vm.app.aid,

                      JSON.stringify(_vm.item)

                 ).then(function (item) {

                    console.log(item);
                    toastr.info('保存成功')

                });
            }
        }
    }
</script>
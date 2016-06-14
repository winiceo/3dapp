<template>

    <div class="page animsition" style="animation-duration: 800ms; opacity: 1;">
        <div class="page-header">
            <h1 class="page-title">基本信息</h1>


        </div>
        <div class="page-content">
            <div class="panel">
                <div class="panel-body container-fluid">
                    <div class="row row-lg">
                        <div class="col-sm-12 col-md-6">
                            <!-- Example Horizontal Form -->
                            <div class="example-wrap">
                                <h4 class="example-title">弹幕</h4>

                                <div class="example">
                                    <form class="form-horizontal">


                                        <div class="form-group">
                                            <label class="col-sm-3 control-label">弹幕循环 : </label>
                                            <div class="col-sm-9">

                                                <input type="checkbox" class="js-switch"/>


                                            </div>
                                        </div>
                                        <div class="form-group">
                                            <label class="col-sm-3 control-label">弹幕样式: </label>
                                            <div class="col-sm-9">
                                                <div class="radio-custom radio-default radio-inline">
                                                    <input type="radio" id="inputHorizontalMale"
                                                           name="inputRadiosMale2">
                                                    <label for="inputHorizontalMale">婉约</label>
                                                </div>
                                                <div class="radio-custom radio-default radio-inline">
                                                    <input type="radio" id="inputHorizontalFemale"
                                                           name="inputRadiosMale2" checked="">
                                                    <label for="inputHorizontalFemale">粗犷</label>
                                                </div>
                                            </div>
                                        </div>

                                        <div class="form-group">
                                            <label class="col-sm-3 control-label">显示位置: </label>
                                            <div class="col-sm-9">
                                                <div class="checkbox-custom checkbox-primary">
                                                    <input type="checkbox" id="inputUnchecked">
                                                    <label for="inputUnchecked">头部</label>
                                                </div>
                                                <div class="checkbox-custom checkbox-primary">
                                                    <input type="checkbox" id="inputUnchecked">
                                                    <label for="inputUnchecked">中部</label>
                                                </div>
                                                <div class="checkbox-custom checkbox-primary">
                                                    <input type="checkbox" id="inputUnchecked">
                                                    <label for="inputUnchecked">尾部</label>
                                                </div>

                                            </div>
                                        </div>

                                        <div class="form-group">
                                            <label class="col-sm-3 control-label">字体大小: </label>
                                            <div class="col-sm-9">
                                                <input id="fontsize" type="range" step="12" min="24" max="48">
                                            </div>
                                        </div>


                                        <div class="form-group">
                                            <label class="col-sm-3 control-label">移动速度: </label>
                                            <div class="col-sm-9">
                                                <input id="speed" type="range" step="0.1" min="0.2" max="0.4">
                                            </div>
                                        </div>


                                        <div class="form-group">
                                            <div class="col-sm-9 col-sm-offset-3">
                                                <button type="button" class="btn btn-primary">保存</button>
                                                <button type="reset" class="btn btn-default btn-outline">预览</button>
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
    export default{
        data(){
            return {
                item: {}
            }
        },
        methods: {
            init: function () {
                var _vm = this;
                fetch(_vm.api + '/danmuku/' + _vm.aid, {
                    method: 'GET',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                        'Authorization': _vm.user.token
                    }

                }).then(function (response) {
                    if (response.status >= 400) {
                        throw new Error("Bad response from server");
                    }

                    return response.json();
                }).then(function (item) {

                    console.log(item);
                    _vm.item = item;


                });


            },
        },
        ready(){
            this.init();
            //window.Site.cc();
            if (Array.prototype.forEach) {
                var elems = Array.prototype.slice.call(document.querySelectorAll('.js-switch'));

                elems.forEach(function (html) {
                    var switchery = new Switchery(html);
                });
            } else {
                var elems = document.querySelectorAll('.js-switch');

                for (var i = 0; i < elems.length; i++) {
                    var switchery = new Switchery(elems[i]);
                }
            }
            // var init = new Switchery($(".js-switch")[0]);
        }
    }
</script>
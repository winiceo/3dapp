<template>
    <div class="page animsition" style="animation-duration: 800ms; opacity: 1;">
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
                                <li role="presentation" class=""><a data-toggle="tab" href="#profile"
                                                                    aria-controls="profile" role="tab"
                                                                    aria-expanded="false">微信设置</a></li>
                            </ul>

                            <div class="tab-content">
                                <div class="tab-pane animation-slide-left active" id="activities" role="tabpanel">

                                    <div class="example">
                                        <!--<form autocomplete="off">-->


                                        <div class="form-group">
                                            <label class="control-label">会议名称</label>
                                            <input type="text" class="form-control"
                                                   v-model="item.title" placeholder="" autocomplete="off">
                                        </div>

                                        <div class="form-group">

                                            <label class="col-sm-3 control-label">
                                                Start Datetime:
                                            </label>
                                            <div class="col-sm-3">
                                                <input class=flatpickr data-enabletime=true data-time_24hr=true
                                                       data-timeFormat="H:i" v-model="item.startAt">
                                            </div>
                                            <label class="col-sm-3 control-label">
                                                End Datetime:
                                            </label>
                                            <div class="col-sm-3">
                                                <input class=flatpickr data-enabletime=true data-time_24hr=true
                                                       data-timeFormat="H:i" v-model="item.endAt">
                                            </div>
                                        </div>


                                        <div class="form-group">
                                            <button type="button" class="btn btn-primary " @click="save">保存</button>
                                        </div>
                                        <!--</form>-->
                                    </div>

                                </div>
                                <div class="tab-pane animation-slide-left" id="profile" role="tabpanel">
                                    <div class="example ">
                                        <form autocomplete="off">


                                            <div class="form-group">
                                                <label class="control-label">AppID(应用ID)</label>
                                                <input type="text" class="form-control" v-model="item.appid"
                                                       placeholder="" autocomplete="off">
                                            </div>
                                            <div class="form-group">
                                                <label class="control-label">AppSecret(应用密钥)</label>
                                                <input type="text" class="form-control" name="appsecret"
                                                       v-model="item.appsecret"
                                                       placeholder="" autocomplete="off">
                                            </div>

                                            <div class="form-group">
                                                <button type="button" class="btn btn-primary " @click="save">保存</button>
                                            </div>
                                        </form>
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

</style>
<script>
    require("../../bower_components/dropzone/dist/min/basic.min.css")
    require("../../bower_components/dropzone/dist/min/dropzone.min.css")
    var Dropzone = require("../../bower_components/dropzone/dist/min/dropzone-amd-module.min")
    require('../../global/js/components/toastr.min');

    import {API_ROOT, Token} from '../../config.js'
    import flatpickr from "flatpickr";
    require("../../../node_modules/flatpickr/dist/flatpickr.material_blue.min.css");
    export default{

        data(){
            return {

                baseUrl: API_ROOT,
                imgUrl: API_ROOT + "/upload/",
                item: {}
            }
        },
        methods: {

            init: function () {
                var _vm = this;
                fetch(API_ROOT + '/api/json', {
                    method: 'GET',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    }

                })
                        .then(function (response) {
                            if (response.status >= 400) {
                                throw new Error("Bad response from server");
                            }

                            return response.json();
                        })
                        .then(function (docs) {

                            console.log(docs[0]);

                            _vm.item = docs[0]

                            _vm.flag != 1 ? _vm.setup() : "";
                        });

            },
            save: function () {
                var _vm = this;
                console.log(_vm.item)
                fetch(API_ROOT + '/activities/news', {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                        'Authorization': Token
                    },
                    body: JSON.stringify(_vm.item)

                }).then(function (response) {
                    if (response.status >= 400) {
                        throw new Error("Bad response from server");
                    }

                    return response.json();
                }).then(function (docs) {
                    alert(docs)
                    console.log(docs);
                    toastr.info('保存成功')
                    window.router.go("/")
//                    setTimeout({
//                      window.rout
//
//                    },1000);




                });

            },
            setup(){

                this.flag = 1;

                var _vm = this;

                $(".dropzone").each(function () {
                    var that = this;

                    $(that).dropzone({
                        dictDefaultMessage: $(that).data("title"),
                        maxFiles: 1,
                        init: function () {
                            //alert($(that).data("field"))

                            this.on("success", function (file, response) {
                                $('.dz-progress').hide();
                                $('.dz-size').hide();
                                $('.dz-error-mark').hide();
                                console.log(response);
                                console.log(file);

                                _vm.item[$(that).data("field")] = response.name


                                //$(".dz-message").show("slow")

                            });
                            this.on("addedfile", function (file) {
                                var removeButton = Dropzone.createElement("<a href=\"#\">删除</a>");
                                var _this = this;
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
                })
                flatpickr.init.prototype.l10n.weekdays.longhand = ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'];
                flatpickr('.flatpickr')
                window.Site.cc();
            }
        },

        ready(){
            Dropzone.autoDiscover = false;
            flatpickr.init.prototype.l10n.weekdays.longhand = ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'];
            flatpickr('.flatpickr')
            // this.init();

        }
    }
</script>
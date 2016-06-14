<template>
    <Navbar></Navbar>
    <Sitebar></Sitebar>
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
    require("dropzone/dist/min/basic.min.css")
    require("dropzone/dist/min/dropzone.min.css")
    var Dropzone = require("dropzone/dist/min/dropzone-amd-module.min")
    require('../../global/js/components/toastr.min');

    import flatpickr from "flatpickr";
    require("flatpickr/dist/flatpickr.material_blue.min.css")

    import Navbar from './Navbar'
    import Sitebar from './Sitebar'
    export default{
        components: {Navbar, Sitebar},
        data(){
            return {
                token:"",

                item: {}
            }
        },
        methods: {

            init: function () {

                flatpickr.init.prototype.l10n.weekdays.longhand = ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'];
                flatpickr('.flatpickr')
                window.Site.cc();

            },

            save: function () {
                var _vm = this;
                console.log(_vm.item)
                fetch(_vm.app.api + '/activity/new', {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                        'Authorization': _vm.app.token
                    },
                    body: JSON.stringify(_vm.item)

                }).then(function (response) {
                    if (response.status >= 400) {
                        throw new Error("Bad response from server");
                    }

                    return response.json();
                }).then(function (docs) {

                    console.log(docs);
                    toastr.info('保存成功')
                    window.router.go("/")
//                    setTimeout({
//                      window.rout
//
//                    },1000);




                });

            }
        }
    }
</script>
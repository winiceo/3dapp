<template>
    <Navbar></Navbar>
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
                                                开始时间:
                                            </label>
                                            <div class="col-sm-3">
                                                <input v-datepicker="item.start_at" data-enabletime=true data-time_24hr=true
                                                       data-timeFormat="H:i">
                                            </div>
                                            <label class="col-sm-3 control-label">
                                                结束时间:
                                            </label>
                                            <div class="col-sm-3">
                                                <input v-datepicker="item.end_at" data-enabletime=true data-time_24hr=true
                                                       data-timeFormat="H:i">

                                            </div>
                                        </div>

                                        <div class="form-group">
                                            <label class="control-label">微信设置</label>
                                            <div>
                                                <div class="radio-custom radio-default radio-inline">
                                                    <input type="radio" value=0 v-model="item.wxbound">
                                                    <label>微信网页版(不需要绑定)</label>
                                                </div>
                                                <div class="radio-custom radio-default radio-inline">
                                                    <input type="radio" value=1 v-model="item.wxbound">

                                                    <label>绑定版(需要公众号)</label>
                                                </div>
                                            </div>
                                        </div>
                                        <template v-if="item.wxbound==1">
                                            <div class="row row-lg">

                                                <div class="form-group col-sm-4">
                                                    上墙关键字
                                                </div>
                                                <div class="form-group col-sm-8">
                                                    <input type="text" class="form-control"
                                                           v-model="item.wxword" placeholder="我要上墙">
                                                </div>


                                            </div>


                                        </template>


                                        <div class="form-group">
                                            <button type="button" class="btn btn-primary " @click="save">保存</button>
                                        </div>
                                        <!--</form>-->
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
    require('../../lib/flatpickr')
    //    import flatpickr from "flatpickr";
    require("flatpickr/dist/flatpickr.material_blue.min.css")

    import Navbar from './Navbar'
    import Sitebar from './Sitebar'
    export default{
        components: {Navbar, Sitebar},
        data(){
            return {
                token: "",

                item: {}
            }
        },
        methods: {

            init: function () {

//                flatpickr.init.prototype.l10n.weekdays.longhand = ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'];
//                var dateTime=flatpickr('.flatpickr',{
//                    minDate:"today",
//                    onChange:function(e){
//                       alert( e)
//                    }
//                })
//                _(dateTime).forEach(function(n,key){
//                   alert(key)
//                    n.set("onChange", function(d) {
//                        alert(22)
//                       // check_out.set("minDate", d.fp_incr(1)); //increment by one day
//                    });
//                })


                window.Site.cc();
                this.$parent.hideLoading();

            },
            dateChanged: function (e) {
                console.log(e)
            },

            save: function () {
                var _vm = this;

                if(!_vm.item.title||_vm.item.title==""){
                    toastr.warning("会议名称不能为空！");
                    return false;
                }


                if(!_vm.item.start_at||!_vm.item.end_at){
                    toastr.warning("会议时间不能为空！");
                    return false;
                }

                console.log(_vm.item.start_at)
                if(_vm.item.start_at=="undefined"||_vm.item.end_at=="undefined"){
                    toastr.warning("会议时间不能为空！");
                    return false;
                }
                var d1 = new Date(_vm.item.start_at.replace(/\-/g, "\/"));
                var d2 = new Date(_vm.item.end_at.replace(/\-/g, "\/"));
                if(d1 >=d2)
                {
                    toastr.warning("开始时间不能大于结束时间！");
                    return false;
                }
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
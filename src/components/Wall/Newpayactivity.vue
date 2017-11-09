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
                                            <label class="control-label">会议名称(必填)</label>
                                            <input type="text" class="form-control"
                                                   v-model="item.name" placeholder="" autocomplete="off">
                                        </div>
                                        <div class="form-group">
                                            <label class="control-label">会议标题</label>
                                            <input type="text" class="form-control"
                                                   v-model="item.title" placeholder="" autocomplete="off">
                                        </div>
                                        <div class="form-group">

                                            <Row>
                                                <i-col span="12">

                                                    开始时间:


                                                    <input v-datepicker="item.start_at" data-enabletime=true
                                                           data-time_24hr=true
                                                           data-timeFormat="H:i">

                                                </i-col>

                                                <i-col span="12">

                                                    结束时间:

                                                    <input v-datepicker="item.end_at" data-enabletime=true
                                                           data-time_24hr=true
                                                           data-timeFormat="H:i">




                                                </i-col>
                                            </Row>
                                            <br><br>

                                            <Row>
                                                <i-col span="5">
                                                    <div class="radio-custom radio-default radio-inline">
                                                        <input type="radio" value=0 v-model="item.wxbound">
                                                        <label>微信网页版(不需要绑定)</label>
                                                    </div>
                                                </i-col>
                                                <i-col span="5">
                                                    <div class="radio-custom radio-default radio-inline">
                                                        <input type="radio" value=1 v-model="item.wxbound">

                                                        <label>绑定版(需要公众号)</label>
                                                    </div>
                                                </i-col>
                                                <i-col span="14"></i-col>
                                            </Row>
                                            <br>
                                            <Row>
                                                <i-col span="24">
                                                    <div class="form-group">
                                                        <template v-if="item.wxbound==1">
                                                            <Row>
                                                                <i-col span="4">上墙关键字</i-col>
                                                                <i-col span="20"> <input type="text" class="form-control"
                                                                                         v-model="item.wxword" placeholder="我要上墙"></i-col>
                                                            </Row>
                                                            <br>

                                                            <Row>
                                                                <i-col span="4">使用公众号</i-col>
                                                                <i-col span="20">
                                                                    <Card>
                                                                        <p slot="title">
                                                                            <Icon type="ios-film-outline"></Icon>
                                                                            选择已授权公众号
                                                                        </p>
                                                                        <a href="#" slot="extra"
                                                                           @click.prevent="getUserInfo">
                                                                            <Icon type="ios-loop-strong"></Icon>
                                                                            刷新
                                                                        </a>
                                                                        <a href="#" slot="extra"
                                                                           @click.prevent="gowechat">
                                                                            <Icon type="plus-circled"></Icon>
                                                                            添加新公众号

                                                                        </a>
                                                                        <ul>


                                                                            <li v-for="(index,u) in userinfo.wxoas_config"
                                                                                style='margin:1px'
                                                                                v-bind:class='{"liactiv":item.wxoas_key==u.key}'>
                                                 <span @click="selectwechat(u)">
                                                               {{{getAvatar(u)}}} - {{ u.name }}
                                                </span>
                                                                            </li>

                                                                        </ul>
                                                                    </Card>


                                                                </i-col>
                                                            </Row>




                                                        </template>

                                                        <br><br>



                                                    </div>
                                                </i-col>
                                            </Row>



                                        </div>

                                        <div class="form-group">
                                            <button type="button" class="btn btn-primary "
                                                    @click="save">保存
                                            </button>
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
.liactiv{
  background-color:#ebf7ff;
}
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

                item: {
                    free:0,
                    wxbound:0,
                     wxoas_key:""
                }
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

                this.getUserInfo()
                window.Site.cc();
                this.$parent.hideLoading();

            },
             getUserInfo(){
                var _vm=this;
                _vm.getuserinfo(function(userinfo){
                    _vm.userinfo=userinfo

                })
            },

            getAvatar(n){
                var img=n.data.head_img?n.data.head_img:"http://getbootstrapadmin.com/remark/global/portraits/1.jpg"

                return "<img src='"+img+"' width='40' height='40'>"
            },
            selectwechat(u){

                this.item.wxoas_key=u.key

            },
            dateChanged: function (e) {
                console.log(e)
            },
            gowechat:function(e){

              window.open("/app/wall.html#!/wechat")
            },
            save: function () {
                var _vm = this;

                if(!_vm.item.name||_vm.item.name==""){
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
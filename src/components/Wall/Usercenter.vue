<template>

    <Navbar></Navbar>


    <div class="page animsition">

        <div class="row cc">
            <div class="col-xlg-12 col-md-12">
                <!-- Example Panel With Labels And Badges -->
                <div class="panel">
                    <div class="panel-heading">

                        <h3 class="panel-title">个人中心</h3>
                    </div>
                    <div class="panel-body">
                        <p>您好{{user.username}},你还可以创建<span class='aleft'>({{user.activity_left}})</span>场活动;<br>
                            红包余额为<span class='money'>{{user.money}}</span>元<a href="javascript:void(0)"
                                                                                  @click="pay_wechat"
                                                                                  data-animation="scale-up"
                                                                                  data-toggle="modal"
                                                                                  class='btn   btn-primary pay-btn'
                                                                                  role="menuitem"
                                                                                  role="menuitem">红包立即充值</a>
                        </p>

                        <hr>
                        <p style="text-align:center">
                            免费与付功能完全一样，只有人数的限制<br>
                            <button type="button" class="btn  btn-animate btn-animate-side btn-default"
                                    v-link="'new_activity'">
                                创建免费活动(仅限20人以内)
                            </button>
                            <button type="button" class="btn btn-animate btn-animate-side btn-success  "
                                    @click="new_pay_activity">
                                创建付费活动(无人数限制)
                            </button>
                        </p>
                    </div>
                </div>
                <!-- End Example Panel With Labels And Badges -->
            </div>
            <div class="col-lg-12 col-md-12">
                <div class="row">
                    <template v-for="(n,p) in products">


                        <a href="javascript:void(0)" @click="get_code(p)" data-animation="scale-up"
                           data-toggle="modal" role="menuitem" role="menuitem">

                            <div class="col-md-6">
                                <div class="widget">
                                    <div class="widget-content padding-25 bg-green-600" style="text-align:center" >

                                        <Tooltip placement="top" content="点击购买此产品"  >
                                            <div class="counter counter-lg">
                                                <span class="counter-number">{{p.price}}￥</span>
                                                <div class="counter-des">{{p.title}}</div>
                                            </div>
                                        </Tooltip>
                                    </div>
                                </div>
                            </div>
                        </a>


                    </template>


                </div>
            </div>


        </div>

        <div class="modal fade modal-super-scaled mybody" id="get_code" aria-hidden="true"
             aria-labelledby="exampleModalTitle" role="dialog" tabindex="-1">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">×</span>
                        </button>
                        <h4 class="modal-title">购买{{product.title}}</h4>
                    </div>
                    <div class="modal-body ">
                        <div class="" v-if="authorizer!=false">
                            <div class="widget widget-shadow">
                                <div class="widget-header bg-white-600 text-center  ">
                                    <div class="font-size-20 black">扫码支付({{product.price}}￥)</div>

                                    <div class="grey-300 font-size-14 margin-bottom-20">

                                        <img :src="items.pr_qrcode_url" width=150 height="150">

                                    </div>
                                    <span>离支付失效还有<p style='color:red;font-size:20'>{{time}}秒</p></span>
                                </div>
                            </div>

                        </div>


                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-default margin-0" data-dismiss="modal">确定
                        </button>
                        <button type="button" class="btn btn-primary" data-dismiss="modal">取消</button>

                    </div>
                </div>
            </div>
        </div>


        <div class="modal fade modal-super-scaled mybody" id="pay_code" aria-hidden="true"
             aria-labelledby="exampleModalTitle" role="dialog" tabindex="-1">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">×</span>
                        </button>
                        <h4 class="modal-title">红包充值</h4>
                    </div>
                    <div class="modal-body ">

                        <div class="widget widget-shadow">
                            <div class="widget-header bg-white-600 text-center  ">
                                <div class="font-size-20 black"><input type="number" class="  input-sm  "
                                                                       v-model="price"
                                                                       style='border: 1px solid #e4eaec;'
                                                                       placeholder="100" style='width:100px;' min="10"
                                                                       max="100000" step="1"
                                                                       @change="pay.pr_qrcode_url=false">元
                                </div>
                                <br>
                                <button type="button" class="btn btn-success" @click="get_pay_code"><i
                                        class="icon wb-check" aria-hidden="true"></i>充值
                                </button>

                            </div>
                        </div>

                        <div class="" v-if="pay.pr_qrcode_url">
                            <div class="widget widget-shadow">
                                <div class="widget-header bg-white-600 text-center  ">
                                    <div class="font-size-20 black">扫码支付({{price}}￥)</div>

                                    <div class="grey-300 font-size-14 margin-bottom-20">

                                        <img :src="pay.pr_qrcode_url" width=150 height="150">

                                    </div>
                                    <span>离支付失效还有<p style='color:red;font-size:20'>{{time}}秒</p></span>
                                </div>
                            </div>

                        </div>


                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-default margin-0" data-dismiss="modal">确定
                        </button>
                        <button type="button" class="btn btn-primary" data-dismiss="modal">取消</button>

                    </div>
                </div>
            </div>
        </div>


        <div class="modal fade modal-super-scaled mybody" id="no_pay" aria-hidden="true"
             aria-labelledby="exampleModalTitle" role="dialog" tabindex="-1">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">×</span>
                        </button>
                        <h4 class="modal-title">友情提示</h4>
                    </div>
                    <div class="modal-body " style="height:100px;">


                        <span style="padding:20px;font-size:18px;margin:10px">你当前不能创建付费活动，请购买</span>


                    </div>
                    <div class="modal-footer">

                        <button type="button" class="btn btn-primary" data-dismiss="modal">取消</button>

                    </div>
                </div>
            </div>
        </div>


</template>
<style>
.top{
text-align:center;
}
.mytable{

text-align:center;
}
    .mytable td{
    text-align:center;
    }

    .modal-super-scaled .modal-header {
        background-color: #f96868;
        border-radius: 4px 4px 0 0;
    }
    .timeline::before {

        height: 94%;

    }

    .dropzone {
        min-height: 120px;
        width: 150px;
        height: 150px;
        padding: 0;

    }

    .dropzone .dz-preview .dz-image {
        border-radius: 10px;
        overflow: hidden;
        width: 120px;
        height: 120px;
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

    .cc  .counter-number {
    color: red;
    font-size: 40px;
}
  .cc  .counter-des {
    color: black;
    font-size: 25px;
}

.pay_btn{
width:200px;

}
.money{
color:red;
font-size:19px;
}
.aleft{
color:red;
font-size:19px;

}
.ccc{
margin:5px;
padding-left:10px;
text-align:center;
}



</style>
<script>

    require('../../assets/examples/css/dashboard/team.min.css');


    var infiniteScroll = require('vue-infinite-scroll').infiniteScroll;
    require("dropzone/dist/min/dropzone.min.css")
    var Dropzone = require("dropzone/dist/min/dropzone-amd-module.min")
    import Navbar from './Navbar'
    import Sitebar from './Sitebar'
    import {whatever, api} from "../../utils/leven"
    import  vuestrapBase from  'vuestrap-base-components/dist/vuestrapBase.min'
    import lazyload from 'vue-lazyload'
    import {WallUrl} from '../../config.js'

    import Vue from "vue";
    Vue.use(lazyload)
    export default{

        components: {Navbar, Sitebar, 'vs-modal': vuestrapBase.modal},
        data(){
            return {
                products:{},
                product:{},
                items:{},
                getpr:false,
                time:60,
                user:{},
                price:1000,
                pay:{},
                getrp:false,
                time1:60,
                valert:false
            }

        },
         watch: {
            // 如果 question 发生改变，这个函数就会运行
            price: function (value) {
              var value=parseInt(value)+""
              this.pay.pr_qrcode_url=false
              this.price=value.replace(/[^\d]/g,'')
              //this.get_pay_code()
            }
          },
        methods: {
            start: function () {

                 this.get_userinfo();
                 //this.$parent.hideLoading();
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
            },

            new_pay_activity:function(){
                if(this.user.activity_left<=0){
                    $('#no_pay').modal()
                }else{

                window.location.href="/app/wall.html#!/new_pay_activity"
                }
            },

           get_userinfo: function () {


                var _vm = this;

                api(_vm).get(_vm.app.api + '/user/profile' ).then(function (res) {
                    var data=res.data
                    _vm.products=data.products;
                    _vm.user=data;
                    _vm.$parent.hideLoading();


                });
            },


            get_code:function(p){


                var _vm = this;
                _vm.product=p
                $('#get_code').modal()
                api(_vm).get(_vm.app.api + '/common/wechatpay/product/qrcode/'+p.uuid ).then(function (res) {
                    var data=res.data.items
                    console.log(data)
                   _vm.items=data;


                    _vm.get_pay_result();

                });
            },
            get_pay_result:function(){
            //获取订单状态
                var _vm = this;
                if(_vm.getpr){
                    window.clearInterval(_vm.getpr);
                }
                _vm.time=60;
               _vm.getpr=window.setInterval(function(){
                    _vm.time--;
                    var isHidden = $('#get_code').is(':hidden');
                    if(_vm.time<=0||isHidden){

                        $('#get_code').modal('hide')
                        window.clearInterval(_vm.getpr);
                         toastr.info('二维码失效，请重新获取支付二维码')
                    }
                    api(_vm).get(_vm.app.api + '/common/wechatpay/product/status/'+_vm.items.out_trade_no ).then(function (res) {
                        var data=res.data

                        if(data.status=='paid'){
                             $('#get_code').modal('hide')
                              window.clearInterval(_vm.getpr);
                              _vm.get_userinfo()
                              toastr.info('支付成功')
                        }
                    });


                },1000)
            },


            //红包充值

            pay_wechat:function(){


                var _vm = this;

                $('#pay_code').modal()

            },

            get_pay_code:function(p){


                var _vm = this;
                var price=_vm.price
                api(_vm).get(_vm.app.api + '/common/user/recharge/'+price ).then(function (res) {
                    var data=res.data.items
                    _vm.pay=data;
                    _vm.get_pay_redpackage();

                });
            },

            get_pay_redpackage:function(){
            //获取订单状态
                var _vm = this;
                if(_vm.getrp){
                    window.clearInterval(_vm.getrp);
                }


                _vm.time=60;
               _vm.getrp=window.setInterval(function(){
                    _vm.time--;
                    var isHidden = $('#pay_code').is(':hidden');
                    if(_vm.time<=0||isHidden){
                        $('#pay_code').modal('hide')
                        window.clearInterval(_vm.getrp);
                         toastr.info('二维码失效，请重新获取支付二维码')
                    }
                    api(_vm).get(_vm.app.api + '/common/wechatpay/product/status/'+_vm.pay.out_trade_no ).then(function (res) {
                        var data=res.data

                        if(data.status=='paid'){
                             $('#pay_code').modal('hide')
                             _vm.get_userinfo()
                              window.clearInterval(_vm.getrp);
                              toastr.info('支付成功')
                        }
                    });


                },1000)
            },




        }
        ,ready:function(){


                $("body").css({"padding-top":"110px"})
                if(this.$route.query.token){

                    this.gettoken(this.start);
                }else{
                    this._init(this.start);
                }


        }
    }





</script>
<template>
    <div class="top-box">

        <loading :show.sync="loading"></loading>
        <router-view></router-view>

    </div>
</template>

<script>


    import Vue from "vue"
    import {API_ROOT,User_Center,WallUrl} from '../../config.js'
    import {loading} from '../../lib/vue-strap'

    import {whatever, api} from "../../utils/leven"


    Vue.mixin({
        data:function(){
            return {
                loading:true,
                nodata:false,
            }
        },
        components: {loading},
        methods: {
            hideLoading:function(){
              this.loading=false
            },
            showLoading:function(){
                this.loading=true
            },
            init: function () {


            },
            gettoken: function (callback) {
                var _vm = this;
                console.log(_vm.item)
                var key=_vm.$route.query.token
                fetch(API_ROOT + '/api/v1/common/token/'+key, {
                    method: 'GET',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    }

                }).then(function (response) {
                    console.log(response.status)
                    if (response.status != 200) {
                        //throw new Error("Bad response from server");
                        toastr.info('用户名或密码不正确,请重新登录')
                        _vm.item={};
                        window.location.href = User_Center+"/login"
                        //throw new Error("Bad response from server");
                    }

                    return response.json();
                }).then(function (docs) {

                    var token="Bearer "+docs.data.token
                    //_vm.$set("app.token", token);
                    //alert(docs)
                   // console.log(docs)

                    _vm.$setItem('token', token,function () {
                         setTimeout(function() {
                             _vm._init(callback);
                         },300)

                    })

                });

            },
            getuserinfo:function(callback){


                var _vm = this;


                    fetch(_vm.app.api + '/user/profile', {
                        method: 'GET',
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json',
                            'Authorization': _vm.app.token
                        }
                    }).then(function (response) {
                        if (response.status >= 400) {
                            throw new Error("Bad response from server");
                        }
                        return response.json();
                    }).then(function (res) {
                        var data=res.data

                        _vm.$set("app.userinfo", data);
                        callback(data)
                        _vm.hideLoading();


                    });


            },
            _init: function (callback) {

                this.app = {
                    token: "",
                    api: "",
                    aid: 0,
                    img: ''
                }
                var _vm = this;
                var route=['/register','/login']
                _vm.$getItem("token").then(function (token) {


                    _vm.$set("app.api", API_ROOT + "/api/v1")
                    _vm.$set("app.wallurl", WallUrl)
                    _vm.$set("app.img", API_ROOT)
                    _vm.$set("app.upload", API_ROOT + "/common/image/new")

                     if (!token&&_.indexOf(route,_vm.$route.path)==-1) {

                         if(_vm.$route.query.token){

                             _vm.gettoken(callback);
                         }else{
                             window.location.href = User_Center+"/login"
                         }
                    }else{

                        _vm.$set("app.token", token);
                         //_vm.getuserinfo()
                    }





                    callback(_vm.app)
                })
            }

        },
        ready:function(){



            this._init(this.init);



        }


    })



</script>

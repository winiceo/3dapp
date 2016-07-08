<template>
    <div class="top-box">

        <loading :show.sync="loading"></loading>
        <router-view></router-view>

    </div>
</template>

<script>


    import Vue from "vue"
    import {API_ROOT} from '../../config.js'
    import {loading} from '../../lib/vue-strap'
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
                   alert(_vm.$route.query.md5)
                    if (!token&&_vm.$route.query.md5) {

                        _vm.$set("app.token", "Bearer "+_vm.$route.query.md5);
                    }else if (!token&&_.indexOf(route,_vm.$route.path)==-1) {
                        window.location.href = ("/app/wall.html#!/login")
                    }

                    _vm.$set("app.token", token);
                    _vm.$set("app.api", API_ROOT + "/api/v1")
                    _vm.$set("app.img", API_ROOT)
                    _vm.$set("app.upload", API_ROOT + "/common/image/new")
                    console.log(_vm.app)
                    callback(_vm.app)
                })
            }
        }, ready(){
            $("body").css({"padding-top":"110px"})
            this._init(this.init);
        }
    })



</script>

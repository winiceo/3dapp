<template>
    <div class="top-box">


        <router-view></router-view>

    </div>
</template>

<script>


    import Vue from "vue"
    import {API_ROOT} from '../../config.js'


    Vue.mixin({

        methods: {
            init: function () {
                var Parse = require("parse");
                Parse.initialize("71an.com", "71an.com");
                Parse.serverURL = ("http://baas.71an.com:8043/parse");

            },
            _init: function (callback) {
                this.app = {
                    token: "",
                    api: "",
                    aid: 0,
                    img: ''
                }
                var _vm = this;
                _vm.$getItem("token").then(function (token) {
                    if (!token) {
                        window.location.href = ("/app/wall.html#!/login")
                    }

                    _vm.$set("app.token", token);
                    _vm.$set("app.api", API_ROOT + "/api/v1")
                    _vm.$set("app.img", API_ROOT)
                    _vm.$set("app.aid",_vm.$route.query.id)
                   // _vm.$set("app.upload", API_ROOT + "/common/image/new")
                    _vm.$set("app.upload",_vm.app.api + "/common/image/new")

                    console.log(_vm.app)
                    callback(_vm.app)
                })
            }
        }, ready(){
            this._init(this.init);
        }
    })



</script>

<template>
    <div class="top-box">
        <Navbar></Navbar>
        <Sidebar></Sidebar>

        <router-view></router-view>

    </div>
</template>
<style>
    .dropzone img{
        float:left;
    }
    .dropzone .dz-message{
        position: relative;
    }
    .example table th{
        background-color: #263238;
        color:white;
    }

    .table>tfoot>tr>th, .table>thead>tr>th {
        font-weight: 400;
        color: white;
    }

</style>
<script>
    import Navbar from '../wall/Navbar'
    import Sidebar from './Sidebar'
    import {API_ROOT} from '../../config.js'
    import {req} from "../../utils/leven"
    import Vue from "vue"
    require("dropzone/dist/min/basic.min.css")
    require("dropzone/dist/min/dropzone.min.css")
    var Dropzone = require("dropzone/dist/min/dropzone-amd-module.min")

    Vue.mixin({
        methods: {
            init: function () {
                var Parse = require("parse");
                Parse.initialize("71an.com", "71an.com");
                Parse.serverURL = ("http://baas.71an.com:8043/parse");
                Dropzone.autoDiscover = false;
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
                    if (!/^[\d+]*$/.test(req("id"))) {
                        window.location.href = ("/app/wall.html#!/login")

                    }
                    _vm.$set("app.token", token);
                    _vm.$set("app.api", API_ROOT + "/api/v1")
                    _vm.$set("app.img", API_ROOT)

                    _vm.$set("app.aid", req("id"))
                    _vm.$set("app.upload", _vm.app.api + "/common/image/new")
                    console.log(_vm.app)
                    callback(_vm.app)
                })
            }
        }, ready(){
            window.Site.cc();
            this._init(this.init);
        }
    })


    //require("../helpers/external_links");
    export default {
        data(){
            return {}
        },
        components: {Navbar, Sidebar},
        ready(){


        }
    }
</script>

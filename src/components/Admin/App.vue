<template>

    <div class="top-box">
        <Navbar></Navbar>
        <Sidebar></Sidebar>

        <router-view></router-view>

    </div>
</template>
<style type="stylesheet">
html{
height:100%;
}
    body{
    background-color:#eceff1;
    height:100%;

    }
    .page{
        padding-top:80px;
        margin-bottom:10px;
    }
    .pagehead{
       padding-left:20px;

    }
    .pagehead .action{
       text-align:right;
       padding-right:20px;

    }
    .dropzone img{
        float:left;
    }
    .dropzone .dz-message{
        position: relative;
    }
    .modal-body p{
        text-align: center;
        font-size:20px;

    }
    .modal-header{
        background-color:#526069
    }

    .modal-title{
       
        font-style: 12px;
        color:white;

    }

</style>
<script>
    import Navbar from '../wall/Navbar'
    import Sidebar from './Sidebar'
    import {API_ROOT,User_Center} from '../../config.js'
    import {req} from "../../utils/leven"
    import Vue from "vue"
    //require("dropzone/dist/min/basic.min.css")
    //require("dropzone/dist/min/dropzone.min.css")
    var Dropzone = require("dropzone/dist/min/dropzone-amd-module.min")

    Vue.mixin({
        data:function(){
            return {
                loading:true,
                nodata:false,
            }
        },
        methods: {
         hideLoading:function(){
              this.loading=false
            },
            showLoading:function(){
                this.loading=true
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
            init: function () {
            this.$Notice.config({
                top: 100,
                duration: 3
            });
//                var Parse = require("parse");
//                Parse.initialize("71an.com", "71an.com");
//                Parse.serverURL = ("http://baas.71an.com:8043/parse");
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
                        window.location.href = User_Center+"/login"
                    }
                    if (!/^[\d+]*$/.test(req("id"))) {
                        window.location.href = User_Center+"/login"

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
            return {
                showScreen:true
            }
        },
        components: {Navbar, Sidebar},
        ready(){


        }
    }

</script>

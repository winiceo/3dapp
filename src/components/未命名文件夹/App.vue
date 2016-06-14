<template>
    <div class="top-box">
        <Navbar></Navbar>
        <Sidebar></Sidebar>

        <router-view></router-view>

    </div>
</template>

<script>
    import store from '../vuex/store'
    import Navbar from './Navbar'
    import Sidebar from './Sidebar'
    import {API_ROOT} from '../../config.js'
    import {req} from "../utils/leven"


    //require("../helpers/external_links");
    export default {
        data(){
            return {
                user:{
                    token:""
                },
                api:"",
                aid:0
            }
        },
        store,
        components: {Navbar, Sidebar},
        ready(){
            var _vm=this;
            _vm.$getItem("token").then(function (token) {
                if(!token){
                    window.router.go("/app/wall.html#!/login")
                }
                _vm.$set("user.token",token);
                _vm.$set("api",API_ROOT)
                _vm.$set("aid",req("id"))

            })

        }
    }
</script>

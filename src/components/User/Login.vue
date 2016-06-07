<template>
    <div class="page-login-v2 layout-full page-dark">
        <div class="page animsition" data-animsition-in="fade-in" data-animsition-out="fade-out">
            <div class="page-content">
                <div class="page-brand-info">
                    <div class="brand">
                        <img class="brand-img" src="../../assets/images/logo@2x.png" alt="...">
                        <h2 class="brand-text font-size-40">快屏互动</h2>
                    </div>
                    <p class="font-size-20">首家专注3D互动大屏应用解决方案提供商.</p>
                </div>

                <div class="page-login-main">
                    <div class="brand visible-xs">
                        <img class="brand-img" src="../../assets/images/logo-blue@2x.png" alt="...">
                        <h3 class="brand-text font-size-40">快屏互动</h3>
                    </div>
                    <h3 class="font-size-24">登录</h3>
                    <p>首家专注3D互动大屏应用解决方案提供商</p>

                         <div class="form-group">
                            <label class="sr-only" for="inputEmail">邮箱(用户名)</label>
                            <input type="text" v-model="item.username" class="form-control" id="inputEmail" name="email" placeholder="Email">
                        </div>
                        <div class="form-group">
                            <label class="sr-only" for="inputPassword">密码</label>
                            <input type="password" class="form-control" id="inputPassword" name="password"
                                   placeholder="Password" v-model="item.password">
                        </div>
                        <div class="form-group clearfix">
                            <!--<div class="checkbox-custom checkbox-inline checkbox-primary pull-left">-->
                                <!--<input type="checkbox" id="remember" name="checkbox">-->
                                <!--<label for="inputCheckbox">Remember me</label>-->
                            <!--</div>-->
                            <a class="pull-right" href="forgot-password.html">忘记密码</a>
                        </div>
                        <button type="submit" class="btn btn-primary btn-block" @click="login()">登录</button>

                    <p>No account? <a href="#" v-link="'/register'">注册</a></p>

                    <footer class="page-copyright">
                        <p>71an.com</p>
                        <p>© 2016. All RIGHT RESERVED.</p>
                        <div class="social">
                            <a class="btn btn-icon btn-round social-twitter" href="javascript:void(0)">
                                <i class="icon bd-twitter" aria-hidden="true"></i>
                            </a>
                            <a class="btn btn-icon btn-round social-facebook" href="javascript:void(0)">
                                <i class="icon bd-facebook" aria-hidden="true"></i>
                            </a>
                            <a class="btn btn-icon btn-round social-google-plus" href="javascript:void(0)">
                                <i class="icon bd-google-plus" aria-hidden="true"></i>
                            </a>
                        </div>
                    </footer>
                </div>

            </div>
        </div>
    </div>
</template>
<style>

</style>
<script>
    require("../../assets/examples/css/pages/login-v2.min.css")
    import {API_ROOT, Token} from '../../config.js'
    import db from "../../utils/db"
    export default{
        data(){
            return {
                item: {}
            }
        },
        methods:{
            login: function () {
                var _vm = this;
                console.log(_vm.item)
                fetch(API_ROOT + '/login_check', {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                        'Authorization': Token
                    },
                    body: JSON.stringify(_vm.item)

                }).then(function (response) {
                    if (response.status >= 400) {
                        throw new Error("Bad response from server");
                    }

                    return response.json();
                }).then(function (docs) {
                    var token="Bearer: "+docs.token
                    db.setItem('token', token).then(function () {
                        return db.getItem('key');
                    }).then(function (value) {
                        toastr.info('保存成功')
                        window.router.go("/")

                    }).catch(function (err) {

                    });

                });

            }
        },
        ready(){
            window.Site.cc();
        }
    }
</script>
<template>
    <div class="page animsition">
        <!-- Notebook Sidebar -->
        <div class="page-aside">
            <div class="page-aside-switch">
                <i class="icon wb-chevron-left" aria-hidden="true"></i>
                <i class="icon wb-chevron-right" aria-hidden="true"></i>
            </div>
            <div class="page-aside-inner">
                <div class="well">摇一摇</div>

                <div class="app-notebook-list " data-plugin="pageAsideScroll">
                    <div data-role="container">
                        <div data-role="content">
                            <ul class="list-group" v-infinite-scroll="loadMore()" infinite-scroll-disabled="busy"
                                infinite-scroll-distance="100">
                                <template v-for="(index,item) in items" track-by="$index">

                                    <li class="list-group-item    " @click="selected(item)">
                                        <h4 class="list-group-item-heading">{{item.title}}</h4>
                                        <p style='font-size:9px;color:gray'>({{item.number}}人参与)</p>


                                    </li>
                                </template>

                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="page-main">
            <div class="page-content">

                <div class="row row-lg ">

                    <template v-for="(index,xx) in item.data" track-by="$index">
                        第（{{index+1}}）轮
                        <form class="form_valid">
                            <div class="page-content ">
                                <div class="panel">
                                    <div class="example table-responsive">
                                        <table class="table table-bordered">
                                            <thead>

                                            <tr>
                                                <th>用户头像</th>
                                                <th>姓名</th>
                                            </tr>
                                            </thead>
                                            <tbody>
                                            <tr v-for="user in xx.wxusers ">

                                                <td><img :src="user.avatar.dealAvatar()" width=100 height=100></td>
                                                <td>
                                                    {{user.nickname}}

                                                </td>
                                            </tr>

                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>


                        </form>
                    </template>
                </div>


            </div>

        </div>


        <!-- End Site Action -->


        <!-- End Create New Notes Modal -->


        <!--contextMenu END-->

    </div>


</template>
<style>
    .errors p {
        color: red
    }

    .page-aside + .page-main {
        margin-left: 270px;
    }
    .site-menubar-unfold .page, .site-menubar-unfold .site-footer {
        margin-left: 200px;
    }
    .page-aside {
        width: 250px;
    }

    .poll {
        min-height: 80px;
        width: 80px;
        height: 80px;
        padding: 0;
        border: 2px solid #edefef;

    }

    .poll .dz-preview .dz-image {
        border-radius: 10px;
        overflow: hidden;
        width: 100px;
        height: 100px;
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

    .addMember-remove {
        position: absolute;
        top: -2px;
        right: -2px;

        font-size: 25px;
        line-height: 1;
        color: #e8313b;
        cursor: pointer;
        background-color: #fff;
        border-radius: 50%;
    }

</style>
<script>

    require('../../assets/examples/css/apps/notebook.min.css');
    require('../../global/vendor/slidepanel/slidePanel.min.css');
    require('../../global/vendor/slidepanel/jquery-slidePanel.min.js');
    require('../../global/vendor/bootstrap-contextmenu/bootstrap-contextmenu');


    var infiniteScroll = require('vue-infinite-scroll').infiniteScroll;
    require("dropzone/dist/min/dropzone.min.css")
    var Dropzone = require("dropzone/dist/min/dropzone-amd-module.min")
    import {whatever, checkStatus,api} from "../../utils/leven"


    var uuid = require('node-uuid');

    export default{
        directives: {infiniteScroll},

        data(){
            return {


                skip: 0,
                busy: false,
                items: [],


                item: {},
                columns:['name','poll']

            }
        },

        methods: {
            init: function () {
                this.uploadUrl = this.app.api + "/common/image/new",
                        // this.uploadUrl = "http://localhost:9999/upload",

                        this.getdata();
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

                // Dropzone.autoDiscover = false;
                //this.new_poll()
                //this.formValid()


            },


            selected: function (item) {
                var _vm = this;
                this.item = item;

            },

            getdata: function (callback) {
                var _vm = this;
                if(_vm.app.aid==0){
                    return ;
                  }
                 api(_vm).get(_vm.app.api + '/statics/activity/shakewall/' + _vm.app.aid).then(function (items) {
                   _vm.items = items.data;
                    _vm.item=items.data[0];
                    whatever(callback)


                }).catch(function(ex) {
                    console.log('parsing failed', ex)

                });





            },
            loadMore: function () {
                this.busy = true;
                this.skip += 10;
                console.log(this.skip)
                this.getdata();

            }
        }
    }

</script>
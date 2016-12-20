<template>

    <div class="page animsition  ">
        <div class="page-header page-header-bordered page-header-tabs">
            <h3>活动数据</h3>
            <p v-if="count">签到总人数({{count}})


        </div>

        <div class="page-content ">
            <div class="panel">
                <div class="example table-responsive">
                    <table class="table table-bordered">
                        <thead>
                        <tr>
                            <th>头像</th>
                            <th>昵称</th>
                            <th>openID</th>
                            <th>城市</th>
                            <th>性别</th>

                        </tr>
                        </thead>
                        <tbody>
                        <tr v-for="entry in item ">
                            <td v-for="key in columns">

                                {{{entry[key]}}}
                            </td>

                        </tr>

                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>


</template>
<style>
    .award .page-content {
        margin-right: 250px;
    }

    .award .avatar img {
        height: 100px;
    }

    .award .thumbnail > img {
        display: block;
        max-width: 100%;
        height: 150px;
    }

    .award figure {
        margin: 10px;
        background: #ffffff;
        overflow: hidden;
        padding-bottom: 10px;

    }

    .award figure img {

        object-fit: cover;

    }

    .app-media .slidePanel-header {
        height: 10px;
        width: 100%;
    }

    .award_uppic {
        min-height: 100px;

        height: 120px;
        padding: 0;
        border: 1px dashed #dddddd;

    }

    .poll .dz-preview .dz-image {
        border-radius: 10px;
        overflow: hidden;
        width: 180px;
        height: 180px;
        position: relative;
        display: block;
        z-index: 10;
    }

    table {
        border: 2px solid #42b983;
        border-radius: 3px;
        background-color: #fff;
    }

    th {
        background-color: #42b983;
        color: rgba(255, 255, 255, 0.66);
        cursor: pointer;
        -webkit-user-select: none;
        -moz-user-select: none;
        -user-select: none;
    }

    td {
        background-color: #f9f9f9;
    }

    th, td {
        min-width: 120px;
        padding: 10px 20px;
    }

    th.active {
        color: #fff;
    }

    th.active .arrow {
        opacity: 1;
    }

    .arrow {
        display: inline-block;
        vertical-align: middle;
        width: 0;
        height: 0;
        margin-left: 5px;
        opacity: 0.66;
    }

    .arrow.asc {
        border-left: 4px solid transparent;
        border-right: 4px solid transparent;
        border-bottom: 4px solid #fff;
    }

    .arrow.dsc {
        border-left: 4px solid transparent;
        border-right: 4px solid transparent;
        border-top: 4px solid #fff;
    }

    #search {
        margin-bottom: 10px;
    }
</style>

<script>


    var infiniteScroll = require('vue-infinite-scroll').infiniteScroll;

    import {whatever} from "../../utils/leven"
    import {aside} from '../../lib/vue-strap'

    var uuid = require('node-uuid');
    //    Vue.component('demo-grid', {
    //        template: '#grid-template',
    //        props: {
    //            data: Array,
    //            columns: Array,
    //            filterKey: String
    //        },
    //        data: function () {
    //            var sortOrders = {}
    //            this.columns.forEach(function (key) {
    //                sortOrders[key] = 1
    //            })
    //            return {
    //                sortKey: '',
    //                sortOrders: sortOrders
    //            }
    //        },
    //        methods: {
    //            sortBy: function (key) {
    //                this.sortKey = key
    //                this.sortOrders[key] = this.sortOrders[key] * -1
    //            }
    //        }
    //    })


    export default{
        directives: {infiniteScroll},
        components: {aside},
        data(){
            return {
                item: {},
                count:0,
                columns: ['avatar','nickname',  'openid','city','sex']

            }
        },
        watch: {

            'showRight': function (val, oldVal) {
                if (val) {

                    $('.aside-backdrop').css("z-index", 100000)
                }
            },
        },
        methods: {
            init: function () {
                // this.uploadUrl = "http://localhost:9999/upload",
                var _vm = this;
                this.getdata(function () {


                });

                window.Site.cc();
                window.AppNoteBook = Site.extend({
                    handleHeight: function () {
                        var height = $(document).height()
                        console.log(height)


                        $(".page-main").css("height", (height - 120) + "px")
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

            getdata: function (callback) {
                var _vm = this;
                console.log(this.app)
                fetch(_vm.app.api + '/statics/activity/signinwall/' + _vm.app.aid, {
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
                }).then(function (items) {

                    var data=_(items.data.wxusers).forEach(function(n){
                        n.avatar="<img src='"+n.avatar+"' width='100' height='100'>";
                        n.sex=n.sex==1?"男":'女';
                    })
                    console.log(data)
                    _vm.item = data;
                    _vm.count=items.data.total_signin
                    whatever(callback)


                }).catch(function (ex) {
                    console.log('parsing failed', ex)
                    whatever(callback)

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
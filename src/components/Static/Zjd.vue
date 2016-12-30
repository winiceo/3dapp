<template>

    <div class="page animsition  ">
        <div class="page-header page-header-bordered page-header-tabs">
            <h3>奖品管理</h3>



        </div>

        <div class="page-content ">
            <div class="panel">
                <div class="example table-responsive">
                    <table class="table table-bordered">
                        <thead>
                        <tr>
                            <th>图像</th>

                            <th>奖品名称</th>
                            <th>奖品数量</th>
                            <th>剩余数量</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr v-for="entry in items ">
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

    import {whatever,api} from "../../utils/leven"
    import {aside} from '../../lib/vue-strap'

    var uuid = require('node-uuid');



    export default{
        directives: {infiniteScroll},
        components: {aside},
        data(){
            return {
                items: [],
                item:{},

                columns: ['avatar','award_name',  'prize_num','prize_left'],

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
            cancelPrize:function(item){


                 var _vm = this;
                 var cc={
                     openid:item.openid,
                     issued:false,
                     id:item.pid

                 }



                api(_vm).post(_vm.app.api + '/awardwall/user/award/update/' + cc.id
                    ,JSON.stringify(cc)
                     ).then(function (dd) {
                    item.issued=false;
                    console.log(item);
                    toastr.info('保存成功')

                });


            },
            getPrize:function(item){


             var _vm = this;
             var cc={
             openid:item.openid,
             issued:true,
             id:item.pid

             }


                api(_vm).post(_vm.app.api + '/awardwall/user/award/update/' + cc.id
                    ,JSON.stringify(cc)
                     ).then(function (dd) {
                        item.issued=true;
                    console.log(item);
                    toastr.info('保存成功')

                });
            },

            getdata: function (callback) {
                var _vm = this;
                if(_vm.app.aid==0){
                    return ;
                  }



                api(_vm).get(_vm.app.api + '/statics/activity/sgewall/' + _vm.app.aid).then(function (items) {
                   var data=_(items.data).forEach(function(n){
                        if(n.pic){
                            n.avatar="<img src='"+_vm.app.img+n.pic.url_small+"' width='100' height='100'>";

                        }else{
                            n.avatar=""
                        }



                    })
                    _vm.items = data;
                    whatever(callback)


                }).catch(function(ex) {
                    console.log('parsing failed', ex)
                    callback()
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
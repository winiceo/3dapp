<template>
    <div class="page animsition">

        <Row class='pagehead'>
            <i-col span="12"> <h3>图片墙</h3></i-col>
            <i-col span="12" class='action'>
                <button type="button" class="btn btn-dark" data-animation="scale-up"
                        data-target="#exampleNiftyFadeScale"
                        data-toggle="modal"><i class="icon wb-upload" aria-hidden="true"></i>上传图片
                </button>
            </i-col>

        </Row>

        <div class="page-content" >
            <div v-infinite-scroll="loadMore()" infinite-scroll-disabled="busy"
                 infinite-scroll-distance="100"  >
            <ul class="blocks blocks-100 blocks-xlg-4 blocks-md-4 blocks-sm-2" id="exampleList"
                data-filterable="true">
                <template v-for="(index,co) in items" track-by="$index">
                    <li data-type="animal">
                        <Card  style='margin:5px;height:300px'>
                            <p slot="title">
                                <Icon type="ios-navigate-outline"></Icon>
                                {{co.created_at}}
                            </p>
                            <figure class="widget-header overlay-hover overlay">

                                <img :src="app.img+co.pic.url_small" height="200" class="overlay-figure overlay-scale" alt="">
                                <figcaption class="overlay-panel overlay-background overlay-fade overlay-icon">
                                    <a class="icon wb-close" @click="remove(co)"></a>
                                </figcaption>
                            </figure>
                            <h4 class="widget-title pic-title">{{co.pic.name}}</h4>
                        </Card>

                    </li>
                </template>

            </ul>
                </div>
        </div>
        <div class="page-content container-fluid lt-body bg-primary-100 text-center padding-20" v-show="nodata">

            <div class="widget">


                暂时没有更多数据


            </div>
        </div>
    </div>

    <div class="modal fade modal-fade-in-scale-up" id="exampleNiftyFadeScale" aria-hidden="true"
         aria-labelledby="exampleModalTitle" role="dialog" tabindex="-1">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">×</span>
                    </button>
                    <h4 class="modal-title">上传</h4>
                </div>
                <div class="modal-body">
                    <form class="dropzone thumbnail uppic"
                          style="margin:10px;"
                          id="picupload" enctype="multipart/form-data" data-title="拖动或点击上传图片">

                        <input type="hidden" name="context" value="{{context}}">

                    </form>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-default margin-0" data-dismiss="modal">取消
                    </button>

                </div>
            </div>
        </div>
    </div>
</template>
<style>
.uppic{
    border:1px  dashed #dddddd;
}
.pic-title{

    overflow:hidden;
    word-break:keep-all;
    white-space:nowrap;
    text-overflow:ellipsis;


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
    import {whatever,api} from "../../utils/leven"


    var uuid = require('node-uuid');

    export default{
        directives: {infiniteScroll},
        data(){
            return {
                add: true,
                context: "picwall",
                count: 0,
                next: 0,
                busy: false,
                nodata:false,
                items: [],
                item: {

                }

            }
        },
        methods: {
            init: function () {
                // this.uploadUrl = "http://localhost:9999/upload",

                if(this.app.api!=""){
                    this.calldata(-1);
                }
                window.Site.cc();
                window.AppNoteBook = Site.extend({
                    handleHeight: function () {
                        var height = $(document).height()
                        console.log(height)


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

                Dropzone.autoDiscover = false;
                this.setup(".uppic");


            },

             calldata: function (status) {
                this.status = status;
                this.next = 1;
                this.$set("nodata", false);
                this.items = [];
                this.getdata();
            },


            remove: function (item) {

                //this.item.delete(index)
                var _vm = this;

                api(_vm).post(_vm.app.api + '/picwall/pic/delete/' + item.id)
                 .then(function () {
                    _vm.items=_.filter(_vm.items, function(o) { return o.id !=item.id; });


                    toastr.info('删除成功')

                });
            },

            getdata: function (callback) {
                var _vm = this;


                var u="next="+this.next
                if(_vm.app.api==""||_vm.nomore){
                    return ;
                }


                api(_vm).get(_vm.app.api + '/picwall/' + _vm.app.aid+'?' + u)
                .then(function (docs) {

                 //_vm.$parent.hideLoading();

                    console.log(docs)
                    if(docs.data.length==0||!docs.data){
                        _vm.nomore=true;
                        console.log(3333)
                        return false;
                    }
                     var items=docs.data
                    console.log(items);

                     _.forEach(docs.data, function (o) {

                        _vm.items.push(o)

                    });
                    //_vm.items = items;
                    //whatever(callback)


                    _vm.busy = false;
                    if (_vm.items.length == 0) {
                        _vm.busy = true;
                        _vm.nomore=true;
                        _vm.$set("nodata", true);
                    } else {
                        _vm.$set("nodata", false);
                    }
                    //_vm.$parent.hideLoading();


                }).catch(function (ex) {
                    console.log('parsing failed', ex)
                    whatever(callback)

                });

            },
            loadMore: function () {

                this.busy = true;
                this.next += 1;
                console.log("leven"+this.next)
                this.getdata();

            },


            setup: function (that) {
                var _vm = this;
                try{
                    $(that).dropzone({

                        dictDefaultMessage: $(that).data("title"),
                        maxFiles: 5,
                        paramName: "file",
                        url:_vm.app.api+"/picwall/pic/new/"+_vm.app.aid,
                        headers: {
                            'Accept': 'application/json',

                            'Authorization': _vm.app.token
                        },
                        init: function () {

                            this.on("success", function (file, response) {
                                $('.dz-progress').hide();
                                $('.dz-size').hide();
                                $('.dz-error-mark').hide();

                                _vm.items.push(response.data);



                            });
                            this.on("addedfile", function (file) {



                            });
                            this.on("complete", function(file) {
                                this.removeFile(file);

                            });
                            this.on("queuecomplete", function(file) {
                                $('#exampleNiftyFadeScale').modal('toggle');

                            });


                        }

                    });
                }catch (e){

                }
            }
        }

    }




</script>
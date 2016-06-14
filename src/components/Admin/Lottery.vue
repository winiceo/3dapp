<template>

    <div class="page bg-white animsition" style="animation-duration: 800ms; opacity: 1;">


        <!-- Mailbox Content -->
        <div class="page-main">
            <button
                    class="btn btn-success btn-lg"
                    @click="showRight = true">添加
            </button>

            <!-- Mailbox Header -->
            <div class="page-header">
                <h1 class="page-title">抽奖信息</h1>
                <div class="page-header-actions">


                    <form lpformnum="2">
                        <div class="input-search input-search-dark">
                            <i class="input-search-icon wb-search" aria-hidden="true"></i>
                            <input type="text" class="form-control" name="" placeholder="Search...">
                        </div>
                    </form>
                </div>
            </div>

            <!-- Mailbox Content -->
            <div class="page-content page-content-table" data-selectable="selectable">

                <!-- Actions -->


                <!-- Mailbox -->
                <table id="mailboxTable" class="table" data-plugin="animateList" data-animate="fade" data-child="tr">
                    <tbody>

                    <template v-for="(index,co) in items">

                        <tr id="mid_1" data-mailbox="slidePanel" @click="showRight = true ,item=co,index=index,add=false">
                            <td class="cell-60"><span class="checkbox-custom checkbox-primary checkbox-lg"><input
                                    type="checkbox" class="mailbox-checkbox selectable-item" id="mail_mid_1"><label
                                    for="mail_mid_1"></label></span></td>
                            <td class="cell-30 responsive-hide"><span class="checkbox-important checkbox-default"><input
                                    type="checkbox" class="mailbox-checkbox mailbox-important"
                                    id="mail_mid_1_important"><label for="mail_mid_1_important"></label></span></td>
                            <td class="cell-60 responsive-hide"><a class="avatar" href="javascript:void(0)">
                                <img v-if="co.pic" :src="app.img+co.pic.url" class="img-responsive">


                            </a></td>
                            <td>
                                <div class="content">
                                    <div class="title">{{co.award_name}}</div>
                                    <div class="abstract">{{co.prize_name}}
                                    </div>
                                </div>
                            </td>
                            <td class="cell-30 responsive-hide"></td>
                            <td class="cell-130">
                                <div class="time">{{co.created_at}}</div>
                                <div class="identity"><i class="wb-medium-point red-600" aria-hidden="true"></i></div>
                            </td>
                        </tr>
                    </template>

                    </tbody>
                </table>

            </div>
        </div>
    </div>

    <aside :show.sync="showRight" placement="right" header="Title" :width="650" style="top:70px;">
        {{item|json}}
        <div class="task-main-editor">

            <div class="form-group">
                <label class="control-label">奖品图片</label>
                <form action="/" class="dropzone thumbnail"
                      style="margin:10px;"
                      id="awardupload" enctype="multipart/form-data" data-title="上传图片">

                    <input type="hidden" name="context" value="{{context}}">
                    <div class="fallback">

                    </div>
                </form>
            </div>

            <div class="form-group">
                <label class="control-label">奖项名称</label>
                <input type="text" class="form-control" v-model="item.award_name"
                       placeholder="" autocomplete="off">
            </div>
            <div class="form-group">
                <label class="control-label">奖品名称</label>
                <input type="text" class="form-control" v-model="item.prize_name"
                       placeholder="" autocomplete="off">
            </div>
            <div class="form-group">
                <label class="control-label">奖品数量</label>
                <input type="text" class="form-control" v-model="item.prize_num"
                       placeholder="" autocomplete="off">
            </div>
            <div class="form-group">
                <label class="control-label">每次抽取数量</label>
                <input type="text" class="form-control" v-model="item.single_num"
                       placeholder="" autocomplete="off">
            </div>


            <div class="form-group">
                <button class="btn btn-primary task-main-editor-save" type="button" @click="save">保存</button>
                <button class="btn btn-primary task-main-editor-save" type="button" @click="remove">删除</button>
                <a class="btn btn-sm btn-white task-main-editor-cancel" href="javascript:void(0)">重置</a>
            </div>

        </div>
    </aside>


</template>
<style>


    .dropzone {
        min-height: 120px;
        width: 150px;
        height: 150px;
        padding: 0;

    }

    .dropzone .dz-preview .dz-image {
        border-radius: 10px;
        overflow: hidden;
        width: 120px;
        height: 120px;
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
</style>

<script>

    require('../../assets/examples/css/apps/notebook.min.css');
    require('../../global/vendor/slidepanel/slidePanel.min.css');
    require('../../global/vendor/slidepanel/jquery-slidePanel.min.js');
    require('../../global/vendor/bootstrap-contextmenu/bootstrap-contextmenu');


    require('../../assets/examples/js/apps/mailbox.min');

    require("../../global/js/components/select2.min.js")
    require("../../global/js/components/aspaginator.min.js")
    require("../../global/js/components/animate-list.min.js")
    require("../../global/js/plugins/action-btn.min.js")
    require("../../global/js/plugins/selectable.min.js")
    require("../../global/js/components/selectable.min.js")
    require("../../global/js/components/material.min.js")
    require("../../global/js/components/bootbox.min.js")


    var infiniteScroll = require('vue-infinite-scroll').infiniteScroll;
    require("dropzone/dist/min/dropzone.min.css")
    var Dropzone = require("dropzone/dist/min/dropzone-amd-module.min")
    import {whatever} from "../../utils/leven"
    import {aside} from 'vue-strap'

    var uuid = require('node-uuid');

    export default{
        directives: {infiniteScroll},
        components: {aside},
        data(){
            return {
                index:0,
                showLeft: false,
                showRight: false,
                add: true,
                context: "awards",

                count: 0,
                skip: 0,
                busy: false,
                items: [],
                item: {},
                choice: {

                    id: "",
                    award: "",
                    name: ""
                }
            }
        },
        methods: {
            init: function () {
                // this.uploadUrl = "http://localhost:9999/upload",

                this.getdata();
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

                Dropzone.autoDiscover = false;
                this.new_award()


            },
            selected: function (item) {
                this.item = item;
                this.add = false;
            },
            remove: function () {

                //this.item.delete(index)
                var _vm = this;
                this.items.splice(_vm.index, 1)
                fetch(_vm.app.api + '/awardwall/award/delete/' + _vm.item.id, {
                    method: 'POST',
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
                }).then(function (item) {

                    console.log(item);
                    toastr.info('删除成功')

                });
            },

            new_award: function () {
                var _vm = this;


                this.add = true;

                setTimeout(function () {
                    _vm.setup("#upaward");

                }, 500)


            },
            save: function () {
                var _vm = this;
                //_vm.item.style=parseInt(_vm.item.style);

                var act = this.add ? "new" : "update"
                var id = this.add ? _vm.app.aid : _vm.item.id;
                fetch(_vm.app.api + '/awardwall/award/' + act + '/' + id, {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                        'Authorization': _vm.app.token
                    },
                    body: JSON.stringify(_vm.item)

                }).then(function (response) {
                    if (response.status >= 400) {
                        throw new Error("Bad response from server");
                    }

                    return response.json();
                }).then(function (item) {
                    _vm.add ? _vm.items.unshift(item) : ""
                    console.log(item);
                    toastr.info('保存成功')

                });
            },
            getdata: function (callback) {
                var _vm = this;
                console.log(this.app)
                fetch(_vm.app.api + '/awardwall/' + _vm.app.aid, {
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

                    console.log(items);
                    _vm.items = items;
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

            },


            setup: function (that) {
                var _vm = this;
//                // alert($(".imgUpload").size())
//                $(".dropzone").each(function () {
//                    var that = this;

                new Dropzone("#awardupload", {

                    dictDefaultMessage: $(that).data("title"),
                    maxFiles: 1,
                    paramName: "file",
                    url: _vm.app.upload,
                    headers: {
                        'Accept': 'application/json',

                        'Authorization': _vm.app.token
                    },
                    init: function () {
                        //alert($(that).data("field"))
                        // this.on("addedfile", function(file) { alert("Added file."); });
                        this.on("success", function (file, response) {
                            $('.dz-progress').hide();
                            $('.dz-size').hide();
                            $('.dz-error-mark').hide();
                            console.log(response);
                            console.log(file);

                            _vm.item.pic = response
                           //_vm.items.unshift(_vm.item);

                            //$(".dz-message").show("slow")

                        });
                        this.on("addedfile", function (file) {
                            console.log(file)
                            var removeButton = Dropzone.createElement("<a href=\"#\">删除</a>");
                            var _this = this;
                            removeButton.addEventListener("click", function (e) {
                                e.preventDefault();
                                e.stopPropagation();
                                _this.removeFile(file);
//                                var name = "largeFileName=" + cd.pi.largeawardPath + "&smallFileName=" + cd.pi.smallawardPath;
//                                $.ajax({type: 'POST', url: 'DeleteImage', data: name, dataType: 'json'});
                            });
                            file.previewElement.appendChild(removeButton);


                        });

                    }

                });

            }
        }
        , ready: function () {
            Dropzone.autoDiscover = false;
            !function (document, window, $) {
                "use strict";
                window.AppMailbox = Site.extend({
                    handleAction: function () {
                        var
                                actionBtn = $(".site-action").actionBtn().data("actionBtn"),
                                $selectable = $("[data-selectable]");
                        $(".site-action-toggle", ".site-action").on("click", function (e) {
                            var $selected = $selectable.asSelectable("getSelected");
                            0 === $selected.length && ($("#addMailForm").modal("show"), e.stopPropagation())
                        }), $('[data-action="trash"]', ".site-action").on("click", function () {
                        }), $('[data-action="inbox"]', ".site-action").on("click", function () {
                        }), $selectable.on("asSelectable::change", function (e, api, checked) {
                            checked ? actionBtn.show() : actionBtn.hide()
                        })
                    }, handleListItem: function () {
                        $("#addLabelToggle").on("click", function (e) {
                            $("#addLabelForm").modal("show"), e.stopPropagation()
                        }), $(document).on("click", "[data-tag=list-delete]", function (e) {
                            bootbox.dialog({
                                message: "Do you want to delete the label?",
                                buttons: {
                                    success: {
                                        label: "Delete", className: "btn-danger", callback: function () {
                                        }
                                    }
                                }
                            })
                        })
                    }, itemTpl: function (data) {
                        return '<tr id="' + data.id + '" data-mailbox="slidePanel" ' + ("true" === data.unread ? 'class="unread"' : "") + '><td class="cell-60"><span class="checkbox-custom checkbox-primary checkbox-lg"><input type="checkbox" class="mailbox-checkbox selectable-item" id="mail_' + data.id + '"/><label for="mail_' + data.id + '"></label></span></td><td class="cell-30 responsive-hide"><span class="checkbox-important checkbox-default"><input type="checkbox" class="mailbox-checkbox mailbox-important" ' + ("true" === data.starred ? 'checked="checked"' : "") + ' id="mail_' + data.id + '_important"/><label for="mail_' + data.id + '_important"></label></span></td><td class="cell-60 responsive-hide"><a class="avatar" href="javascript:void(0)"><img class="img-responsive" src="' + data.avatar + '" alt="..."></a></td><td><div class="content"><div class="title">' + data.name + '</div><div class="abstract">' + data.title + '</div></div></td><td class="cell-30 responsive-hide">' + (data.attachments.length > 0 ? '<i class="icon wb-paperclip" aria-hidden="true"></i>' : "") + '</td><td class="cell-130"><div class="time">' + data.time + "</div>" + (data.group.length > 0 ? '<div class="identity"><i class="wb-medium-point ' + data.color + '" aria-hidden="true"></i>' + data.group + "</div>" : "") + "</td></tr>"
                    }, attachmentsTpl: function (data) {
                        var self = this, html = "";
                        return html += '<div class="mail-attachments"><p><i Class="icon wb-paperclip"></i>Attachments | <a href="javascript:void(0)">Download All</a></p><ul class="list-group">', $.each(data, function (n, item) {
                            html += self.attachmentTpl(item)
                        }), html += "</ul></div>"
                    }, attachmentTpl: function (data) {
                        return '<li class="list-group-item"><span class="name">' + data.name + '</span><span class="size">' + data.size + '</span><button type="button" class="btn btn-icon btn-pure btn-default"><i class="icon wb-download" aria-hidden="true"></i></button></li>'
                    }, messagesTpl: function (data) {
                        var html = "";
                        return $.each(data.messages, function (n, item) {
                            html += '<section class="slidePanel-inner-section"><div class="mail-header"><div class="mail-header-main"><a class="avatar" href="javascript:void(0)"><img src="' + data.avatar + '" alt="..."></a><div><span class="name">' + data.name + '</span></div><div><a href="javascript:void(0)" class="mailbox-panel-email">' + data.email + '</a> to <a href="javascript:void(0)" class="margin-right-10">me</a><span class="identity"><i class="wb-medium-point red-600" aria-hidden="true"></i>' + data.group + '</span></div></div><div class="mail-header-right"><span class="time">' + item.time + '</span><div class="btn-group actions" role="group"><button type="button" class="btn btn-icon btn-pure btn-default"><i class="icon wb-star" aria-hidden="true"></i></button><button type="button" class="btn btn-icon btn-pure btn-default"><i class="icon wb-reply" aria-hidden="true"></i></button></div></div></div><div class="mail-content">' + item.content + "</div>", 0 === n && item.attachments && item.attachments.length > 0 && (html += this.attachmentsTpl(item.attachments)), html += "</section>"
                        }), html
                    }, initMail: function () {
                        var self = this;
                        $.getJSON("../../assets/data/appsMailbox.json", function (data) {
                            var $wrap = $("#mailboxTable");
                            self.buildMail($wrap, data), self.initMailData(data), self.handlSlidePanelPlugin()
                        })
                    }, initMailData: function (data) {
                        this.mailboxData = data
                    }, buildMail: function ($wrap, data) {
                        var self = this, $tbody = $("<tbody></tbody>");
                        $.each(data, function (i, item) {
                            self.buildItem($tbody, item)
                        }), $wrap.empty().append($tbody)
                    }, buildItem: function ($wrap, data) {
                        $wrap.append($(this.itemTpl(data)).data("mailInfo", data))
                    }, buildPanel: function () {
                    }, filter: function (flag, value) {
                    }, handlePanel: function () {
                        $(document).on("click", '[data-mailbox="slidePanel"]', function (e) {
                        })
                    }, handlSlidePanelPlugin: function () {
                        if ("undefined" != typeof $.slidePanel) {
                            var self = this, defaults = $.components.getDefaults("slidePanel"), options = $.extend({}, defaults, {
                                template: function (options) {
                                    return '<div class="' + options.classes.base + " " + options.classes.base + "-" + options.direction + '"><div class="' + options.classes.base + '-scrollable"><div><div class="' + options.classes.content + '"></div></div></div><div class="' + options.classes.base + '-handler"></div></div>'
                                }, afterLoad: function (object) {
                                    var $target = $(object.target);
                                    $target.data("taskInfo");
                                    this.$panel.find("." + this.options.classes.base + "-scrollable").asScrollable({
                                        namespace: "scrollable",
                                        contentSelector: ">",
                                        containerSelector: ">"
                                    })
                                }, contentFilter: function (data, object) {
                                    var $target = $(object.target), info = $target.data("mailInfo"), $panel = $(data);
                                    return $(".mailbox-panel-title", $panel).html(info.title), $(".slidePanel-messages", $panel).html(self.messagesTpl(info)), $panel
                                }
                            });
                            $(document).on("click", '[data-mailbox="slidePanel"]', function (e) {
                                $.slidePanel.show({url: "panel.tpl", target: $(this)}, options), e.stopPropagation()
                            })
                        }
                    }, run: function (next) {
                        this.handleAction(), this.handleListItem(), this.initMail(), $("#addlabelForm").modal({show: !1}), $("#addMailForm").modal({show: !1}), $(".checkbox-important").on("click", function (e) {
                            e.stopPropagation()
                        }), this.handleMultiSelect(), next()
                    }
                }), $(document).ready(function () {
                    AppMailbox.run()
                })
            }(document, window, jQuery);
        }
    }
</script>
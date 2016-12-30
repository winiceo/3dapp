<template>
    <div class="pane-content" style="padding-left:250px;padding-top:100px">
    <div style='width: 246px; height: 146px'>
       asdfasdf<Upload></Upload>
    </div>
        {{filelist}}
    </div>

</template>


<script>


    import {whatever, api} from "../../utils/leven"
    import {Upload} from "../../lib/vue-strap"



    export default{
        components: {
            Upload,

        },
        data(){
            return {
                filelist:[]

            }
        },

        methods: {
            onChange:function(obj){
             var _vm=this;
                    console.log('add', obj.file)
                    var  formData = new FormData()
                    formData.append('file', obj.file, obj.file.name)

              api(_vm).upload(_vm.app.upload, formData)
                 .then(function (data) {

                    var item=data.provider_metadata;
                    if(item){

                         var file={
                          status:'done',
                          name:item.name,
                          url:item.url_small,
                          uid:item.id
                         }
                         console.log(file)
                        _vm.filelist.push(file)
                    }

                });

            },
        },
        ready: function () {

        }

    }




</script>
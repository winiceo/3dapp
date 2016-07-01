<template>
    <div class="page ">
        <form   class="dropzone thumbnail vip_uppic"
             id="dropzone_0"
             style="margin:10px;"

             data-title="上传图片">

            <div class="fallback">

            </div>
        </form>

        adfadsf{{app|json}}
    </div>
</template>
<style>

</style>
<script>
    var Dropzone = require("dropzone/dist/min/dropzone-amd-module.min")
    Dropzone.autoDiscover = false;

    export default{
        data(){
            return {
                app:{},
                validator: {},
                form: {
                    name: '',
                    age: null


                }
            }
        } ,

        methods: {
            init:function(){
                alert(JSON.stringify(this.app))
              //this.setup1(".dropzone")
            }

         }

    }
</script>
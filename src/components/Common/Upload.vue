<template>
    <div class="upload-set">
        <form class="logo-form" action="/admin/common/callBackUpload.html" enctype="multipart/form-data" target="upload"
              method="post">
            <span class="removeimg" style="display: none;">×</span>
            <span class="note-txt" style="display: block;">上传<br>LOGO</span>
            <input class="upload-file" name="uploadFile" type="file" value="上传照片">
            <input type="hidden" name="callBack" value="backLogo">
        </form>
    </div>
</template>
<style>
    .upload-set {
        position: relative;
        z-index: 1;
        overflow: hidden;
        height: 100%;
    }

    .upload-file {
        position: absolute;
        right: 0;
        top: 0;
        opacity: 0;
        font-size: 78px;
    }

    .upload-set .note-txt {
        text-align: center;
        display: block;
        font-size: 18px;
        line-height: 25px;
        position: absolute;
        width: 100%;
        top: 50%;
        margin-top: -20px;
    }
</style>
<script>

    export default{
        data(){
            return {
                msg: 'hello vue'
            }
        }
    }
</script>
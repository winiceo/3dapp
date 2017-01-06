<template>

    <div class="dz dz-clickable dz-started">
        <div v-if="!image" style='height:100%'>
            <div @dragenter="hovering = true" @dragleave="hovering = false"
                 :class="{'dz-hover': hovering}">
                <div class="dz-text">
                    <span class="dz-title"><Icon type="plus" size=50></Icon></span>
                    <span class="dz-info" v-if="info">{{ info }}</span>
                </div>
                <input type="file" @change="onFileChange">
            </div>
        </div>
        <div class="dz-preview dz-processing dz-image-preview dz-success dz-complete" v-else>
            <div class="dz-image">
                <img :src="image" style="width:100%;height:100%"/>
            </div>
            <div class="dz-details">
                <div class="dz-size"><span data-dz-size="">{{ size }}</span></div>
                <div class="dz-filename"><span data-dz-name="">{{name}}</span></div>
            </div>


            <a class="dz-remove" @click="removeImage" data-dz-remove="">删除</a>
        </div>

    </div>
</template>
<style>



</style>
<script>




</script>
<template>
    <div class="site-menubar site-menubar-light">
        <div class="site-menubar-body">
            <div>
                <div>
                    <div class="nav-button example-buttons">
                        <button type="button" class="btn btn-outline btn-default">全部活动</button>
                        <button type="button" class="btn btn-outline btn-default">未开始</button>
                        <button type="button" class="btn btn-outline btn-default">进行中</button>
                        <button type="button" class="btn btn-outline btn-default">已结束</button>

                        <button type="button" class="btn btn-default btn-outline pull-right" v-link="'new_activity'">创建新活动</button>
                    </div>

                </div>
            </div>
        </div>
    </div>
</template>
<style>

    .nav-button{
        padding-left:5px;
        margin-top:5px;
        margin-bottom: 5px;
    }
</style>
<script>

    export default{
        data(){
            return{

            }
        }
    }
</script>
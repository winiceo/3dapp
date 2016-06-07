<template>
    
    <li class="site-menu-item">
                            <a class="animsition-link" v-link="{path:item.url}">
                                <i class="site-menu-icon {{ item.icon }}" aria-hidden="true"></i>
                                <span class="site-menu-title">{{ item.name }}</span>
                                <div class="site-menu-label">
                                    <span class="label label-danger label-round">new</span>
                                </div>
                            </a>
    </li>
</template>
<style>

</style>
<script>
    /**
     * 参数:
     *  [icon] String eg. 'fa fa-desktop'
     *  [name] String eg. '用户管理';
     *  [listAttay] Array eg. [{url:'/a/b',name:'用户列表'},{...},...]
     */
    export default{
        data() {
            return {
                
                listArray: []
            }
        },

        props: {
             
            listArray: Array
        }

    }
</script>
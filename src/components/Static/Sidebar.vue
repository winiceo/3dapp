<template>
    <div class="site-menubar">
        <div class="site-menubar-body">
            <div>
                <div>
                    <ul class="site-menu">
                        <li class="site-menu-category">数据统计</li>
                        <li class="site-menu-item">
                            <a class="animsition-link" v-link="{path:'/'}">
                                <i class="site-menu-icon wb-settings" aria-hidden="true"></i>
                                <span class="site-menu-title">活动</span>
                                <div class="site-menu-label">
                                </div>
                            </a>
                        </li>

 


                        <li class="site-menu-item">
                            <a class="animsition-link" v-link="'/lottery'">
                                <i class="site-menu-icon wb-gallery" aria-hidden="true"></i>
                                <span class="site-menu-title">抽奖</span>
                                <div class="site-menu-label">

                                </div>
                            </a>
                        </li>

                        <li class="site-menu-item">
                            <a class="animsition-link" v-link="'/poll'">
                                <i class="site-menu-icon wb-thumb-up" aria-hidden="true"></i>
                                <span class="site-menu-title">投票</span>
                                <div class="site-menu-label">

                                </div>
                            </a>
                        </li>

                        <li class="site-menu-item">
                            <a class="animsition-link" v-link="'/shakeprize'">
                                <i class="site-menu-icon wb-payment " aria-hidden="true"></i>
                                <span class="site-menu-title">摇奖品</span>
                                <div class="site-menu-label">

                                </div>
                            </a>
                        </li>
                        <li class="site-menu-item">
                            <a class="animsition-link" v-link="'/shake'">
                                <i class="site-menu-icon wb-random" aria-hidden="true"></i>
                                <span class="site-menu-title">摇一摇</span>
                                <div class="site-menu-label">

                                </div>
                            </a>
                        </li>

                        <!--<li class="site-menu-item">-->
                        <!--<a class="animsition-link" v-link="'/message'">-->
                        <!--<i class="site-menu-icon wb-grid-4" aria-hidden="true"></i>-->
                        <!--<span class="site-menu-title">消息</span>-->
                        <!--<div class="site-menu-label">-->

                        <!--</div>-->
                        <!--</a>-->
                        <!--</li>-->
                        <!---->

                    </ul>

                </div>
            </div>
        </div>
        <!--<div class="site-menubar-footer">-->
        <!--<a href="javascript: void(0);" class="fold-show" data-placement="top" data-toggle="tooltip" data-original-title="Settings">-->
        <!--<span class="icon wb-settings" aria-hidden="true"></span>-->
        <!--</a>-->
        <!--<a href="javascript: void(0);" data-placement="top" data-toggle="tooltip" data-original-title="Lock">-->
        <!--<span class="icon wb-eye-close" aria-hidden="true"></span>-->
        <!--</a>-->
        <!--<a href="javascript: void(0);" data-placement="top" data-toggle="tooltip" data-original-title="Logout">-->
        <!--<span class="icon wb-power" aria-hidden="true"></span>-->
        <!--</a>-->
        <!--</div>-->
    </div>
    <div class="site-gridmenu">
        <div>
            <div>
                <ul>
                    <li>
                        <a href="../apps/mailbox/mailbox.html">
                            <i class="icon wb-envelope"></i>
                            <span>Mailbox</span>
                        </a>
                    </li>
                    <li>
                        <a href="../apps/calendar/calendar.html">
                            <i class="icon wb-calendar"></i>
                            <span>Calendar</span>
                        </a>
                    </li>
                    <li>
                        <a href="../apps/contacts/contacts.html">
                            <i class="icon wb-user"></i>
                            <span>Contacts</span>
                        </a>
                    </li>
                    <li>
                        <a href="../apps/media/overview.html">
                            <i class="icon wb-camera"></i>
                            <span>Media</span>
                        </a>
                    </li>
                    <li>
                        <a href="../apps/documents/categories.html">
                            <i class="icon wb-order"></i>
                            <span>Documents</span>
                        </a>
                    </li>
                    <li>
                        <a href="../apps/projects/projects.html">
                            <i class="icon wb-image"></i>
                            <span>Project</span>
                        </a>
                    </li>
                    <li>
                        <a href="../apps/forum/forum.html">
                            <i class="icon wb-chat-group"></i>
                            <span>Forum</span>
                        </a>
                    </li>
                    <li>
                        <a href="../index.html">
                            <i class="icon wb-dashboard"></i>
                            <span>Dashboard</span>
                        </a>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>
<style>

</style>
<script>

    export default{
        data(){
            return {}
        }

    }
</script>
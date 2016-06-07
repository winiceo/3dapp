<template>
    <div class="top-box">


        <router-view></router-view>

    </div>
</template>

<script>

    import Navbar from './Navbar'
    import Sitebar from './Sitebar'

    //require("../helpers/external_links");
    export default {

        components: {Navbar, Sitebar},
        ready(){

            (function (document, $) {
                'use strict';


                //Site.run();

            })(document, jQuery);


        }
    }
</script>

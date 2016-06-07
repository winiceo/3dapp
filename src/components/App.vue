<template>
  <div class="top-box">
    <Navbar></Navbar>
       <Sidebar></Sidebar>

    <router-view></router-view>
     
  </div>
</template>

<script>
import store from '../vuex/store'
import Navbar from './Navbar'
import Sidebar from './Sidebar'

//require("../helpers/external_links");
export default {
  store,
  components: { Navbar,Sidebar },
  ready(){

          (function(document, $) {
            'use strict';




             //Site.run();

          })(document, jQuery);
            
               
 
        }
}
</script>

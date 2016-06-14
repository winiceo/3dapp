<template>
   <div class="page animsition">
    <div class="page-header page-header-bordered page-header-tabs">

      <h1 class="page-title">媒体</h1>

      <ul class="nav nav-tabs nav-tabs-line" role="tablist">

        <li class="active" role="presentation">
          <a href="#exampleList" aria-expanded="false" role="tab" data-filter="object">背景图片</a>
        </li>
        <li role="presentation">
          <a href="#exampleList" aria-expanded="false" role="tab" data-filter="city">背景音乐</a>
        </li>

      </ul>
    </div>
       <form action="http://localhost:5555/api/upload" class="dropzone">afsa</form>

    <div class="page-content">
      <ul class="blocks blocks-100 blocks-xlg-4 blocks-md-3 blocks-sm-2" id="exampleList"
      data-filterable="true">
        <li data-type="animal">
          <div class="widget widget-shadow">
            <figure class="widget-header overlay-hover overlay">
              <img class="overlay-figure overlay-scale" src="../global/photos/animal-5-720x480.jpg"
              alt="...">
              <figcaption class="overlay-panel overlay-background overlay-fade overlay-icon">
                <a class="icon wb-search" href="../global/photos/animal-5-720x480.jpg"></a>
              </figcaption>
            </figure>
            <h4 class="widget-title">Animal Horse</h4>
          </div>
        </li>
        <li data-type="object">
          <div class="widget widget-shadow">
            <figure class="widget-header overlay-hover overlay">
              <img class="overlay-figure overlay-scale" src="../global/photos/object-2-720x480.jpg"
              alt="...">
              <figcaption class="overlay-panel overlay-background overlay-fade overlay-icon">
                <a class="icon wb-search" href="../global/photos/object-2-720x480.jpg"></a>
              </figcaption>
            </figure>
            <h4 class="widget-title">Object Coffee</h4>
          </div>
        </li>
        <li data-type="object">
          <div class="widget widget-shadow">
            <figure class="widget-header overlay-hover overlay">
              <img class="overlay-figure overlay-scale" src="../global/photos/object-3-720x480.jpg"
              alt="...">
              <figcaption class="overlay-panel overlay-background overlay-fade overlay-icon">
                <a class="icon wb-search" href="../global/photos/object-3-720x480.jpg"></a>
              </figcaption>
            </figure>
            <h4 class="widget-title">Object Cup</h4>
          </div>
        </li>
        <li data-type="city">
          <div class="widget widget-shadow">
            <figure class="widget-header overlay-hover overlay">
              <img class="overlay-figure overlay-scale" src="../global/photos/city-1-720x480.jpg"
              alt="...">
              <figcaption class="overlay-panel overlay-background overlay-fade overlay-icon">
                <a class="icon wb-search" href="../global/photos/city-1-720x480.jpg"></a>
              </figcaption>
            </figure>
            <h4 class="widget-title">City Nature</h4>
          </div>
        </li>
        <li data-type="scenery">
          <div class="widget widget-shadow">
            <figure class="widget-header overlay-hover overlay">
              <img class="overlay-figure overlay-scale" src="../global/photos/city-2-720x480.jpg"
              alt="...">
              <figcaption class="overlay-panel overlay-background overlay-fade overlay-icon">
                <a class="icon wb-search" href="../global/photos/city-2-720x480.jpg"></a>
              </figcaption>
            </figure>
            <h4 class="widget-title">City Station</h4>
          </div>
        </li>
        <li data-type="city">
          <div class="widget widget-shadow">
            <figure class="widget-header overlay-hover overlay">
              <img class="overlay-figure overlay-scale" src="../global/photos/city-3-720x480.jpg"
              alt="...">
              <figcaption class="overlay-panel overlay-background overlay-fade overlay-icon">
                <a class="icon wb-search" href="../global/photos/city-3-720x480.jpg"></a>
              </figcaption>
            </figure>
            <h4 class="widget-title">City Leaf</h4>
          </div>
        </li>
        <li data-type="animal">
          <div class="widget widget-shadow">
            <figure class="widget-header overlay-hover overlay">
              <img class="overlay-figure overlay-scale" src="../global/photos/animal-3-720x480.jpg"
              alt="...">
              <figcaption class="overlay-panel overlay-background overlay-fade overlay-icon">
                <a class="icon wb-search" href="../global/photos/animal-3-720x480.jpg"></a>
              </figcaption>
            </figure>
            <h4 class="widget-title">Animal Bird</h4>
          </div>
        </li>
        <li data-type="city">
          <div class="widget widget-shadow">
            <figure class="widget-header overlay-hover overlay">
              <img class="overlay-figure overlay-scale" src="../global/photos/city-4-720x480.jpg"
              alt="...">
              <figcaption class="overlay-panel overlay-background overlay-fade overlay-icon">
                <a class="icon wb-search" href="../global/photos/city-4-720x480.jpg"></a>
              </figcaption>
            </figure>
            <h4 class="widget-title">City Street</h4>
          </div>
        </li>
        <li data-type="animal">
          <div class="widget widget-shadow">
            <figure class="widget-header overlay-hover overlay">
              <img class="overlay-figure overlay-scale" src="../global/photos/animal-1-720x480.jpg"
              alt="...">
              <figcaption class="overlay-panel overlay-background overlay-fade overlay-icon">
                <a class="icon wb-search" href="../global/photos/animal-1-720x480.jpg"></a>
              </figcaption>
            </figure>
            <h4 class="widget-title">Animal Nature</h4>
          </div>
        </li>
        <li data-type="city">
          <div class="widget widget-shadow">
            <figure class="widget-header overlay-hover overlay">
              <img class="overlay-figure overlay-scale" src="../global/photos/city-5-720x480.jpg"
              alt="...">
              <figcaption class="overlay-panel overlay-background overlay-fade overlay-icon">
                <a class="icon wb-search" href="../global/photos/city-5-720x480.jpg"></a>
              </figcaption>
            </figure>
            <h4 class="widget-title">City Night</h4>
          </div>
        </li>
        <li data-type="object">
          <div class="widget widget-shadow">
            <figure class="widget-header overlay-hover overlay">
              <img class="overlay-figure overlay-scale" src="../global/photos/object-1-720x480.jpg"
              alt="...">
              <figcaption class="overlay-panel overlay-background overlay-fade overlay-icon">
                <a class="icon wb-search" href="../global/photos/object-1-720x480.jpg"></a>
              </figcaption>
            </figure>
            <h4 class="widget-title">Object Book</h4>
          </div>
        </li>
        <li data-type="object">
          <div class="widget widget-shadow">
            <figure class="widget-header overlay-hover overlay">
              <img class="overlay-figure overlay-scale" src="../global/photos/object-4-720x480.jpg"
              alt="...">
              <figcaption class="overlay-panel overlay-background overlay-fade overlay-icon">
                <a class="icon wb-search" href="../global/photos/object-4-720x480.jpg"></a>
              </figcaption>
            </figure>
            <h4 class="widget-title">Object Grape</h4>
          </div>
        </li>
      </ul>
    </div>
  </div>
  <script src="../assets/examples/js/pages/gallery.min.js"></script>

</template>
<style>

</style>

<script>
   // import datepicker from '../components/datepicker.vue';
    import Vue from 'vue';
    import jQuery from 'jquery';

    import 'magnific-popup'
//    require("../bower_components/dropzone/dist/min/basic.min.css")
//    require("../bower_components/dropzone/dist/min/dropzone.min.css")
//    require("../bower_components/dropzone/dist/min/dropzone-amd-module.min")

    export default{
        data(){
            return {
                // bgimgs: [
                //     {name: "10.jpg", desc: "adfadf"},
                //     {name: "11.jpg", desc: "23423"},
                // ]
            };
        },
        methods: {
            setting(msg)  {
                var formData = {background: msg};

                $.ajax({
                    url : "/api/save",
                    type: "POST",
                    data : formData,
                    success: function(data, textStatus, jqXHR)
                    {
                        console.log(data)
                        alert("设置成功")
                    },
                    error: function (jqXHR, textStatus, errorThrown)
                    {
                 
                    }
                });
            }
        } ,
        ready(){

          (function(document, $) {
            'use strict';
              $.ajax({
                  url : "/api/images",
                  type: "get",

                  success: function(data, textStatus, jqXHR)
                  {
                      console.log(data)
                      alert("设置成功")
                  },
                  error: function (jqXHR, textStatus, errorThrown)
                  {

                  }
              });
          //  $(document).ready(function() {

            //$.components.init()
             // alert($(".animsition").html())
            //window.Site.cc();
            //require('../assets/js/site.min');

              window.Site.cc();

              $(".wb-search").magnificPopup({
                  type: "image",
                  closeOnContentClick: !0,
                  mainClass: "mfp-fade",
                  gallery: {
                      enabled: !0,
                      navigateByImgClick: !0,
                      preload: [0, 1]
                  }
              })
           // });

          })(document, jQuery);
            
               
 
        }

    };

   
    
</script>
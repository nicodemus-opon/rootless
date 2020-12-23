<template>
  <div id="app">
    <router-view />
  </div>
</template>

<style>
@import "./assets/css/icons/coolicons.css";
@import "./assets/tp/filepond.min.css";
@import "./assets/css/bootstrap.min.css";
@import "./assets/css/base.css";

@import "./assets/css/main2.css";
@import "https://cdn.quilljs.com/1.3.6/quill.snow.css";

@import "./assets/css/icons/coolicons.css";
@import "./assets/tp/filepond-plugin-image-preview.min.css";

</style>

<script>
//require("amd-loader");
require("quill");
require("bootstrap");
//require("./assets/js/jquery.min.js");
require("popper.js");
//require("./assets/js/bootstrap.min.js");
require("./assets/js/main.js");

/*
require("./assets/tp/filepond.min.js");
require("./assets/tp/filepond-plugin-image-preview.min.js");
require("./assets/tp/filepond-plugin-image-edit.min.js");
require("./assets/js/jquery-filepond.js");
*/
global.jQuery = require("jquery");
var $ = global.jQuery;
//var jQuery = global.jQuery;
window.$ = $;
</script>

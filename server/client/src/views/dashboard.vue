<template>
  <div class="container-fluidb full-height  ">
    <nav
      class="navbar navbar-expand-lg position-fixed "
      :class="{ 'full-height': navtoggled }"
    >
      <div class="container px-3">
        <button
          class="navbar-toggler navbar-toggler-right align-self-center my-2 fixed-topb"
          :class="{ 'fixed-top mx-3 my-4': navtoggled }"
          type="button"
          data-toggle="collapse"
          data-target="#navbarCollapse"
        >
          <span
            class="navbar-toggler-iconb toggler-icon text"
            v-on:click="navtoggled = !navtoggled"
          >
            <i class="ci-menu_duo" v-show="!navtoggled"></i>
            <i class="ci-close_big" v-show="navtoggled"></i>
          </span>
        </button>

        <div
          class="collapse navbar-collapse  flex-column ml-lg-0 ml-3"
          id="navbarCollapse"
        >
          <ul class="navbar-nav ml-auton pb-2" style="width:100%">
            <li class="nav-item pt-2 mr-auto text-right">
              <a class="nav-link logo-text text" href="#"
                ><img
                  src="rootless.svg"
                  class="prof-imgn rounded-circlen "
                  height="28px"
                />
                ROOTLESS <span class="text-muted">- Acme Corp</span></a
              >
            </li>
            <li class="nav-item pt-2 ">
              <a class="nav-link" href="#">
                <i class="ci-external_link"></i> Docs</a
              >
            </li>
            <li class="nav-item pt-2">
              <a class="nav-link" href="#"><i class="ci-log_out"></i>Log Out</a>
            </li>
            <li class="nav-item dropdown">
              <a
                class="nav-link dropdown-togglen"
                data-toggle="dropdown"
                href="#"
                role="button"
                aria-haspopup="true"
                aria-expanded="false"
                ><img
                  src="@/assets/img/profile.png"
                  class="prof-img rounded-circle "
              /></a>
              <div class="dropdown-menu dropdown-menu-right">
                <a class="dropdown-item" href="#">Action</a>
                <a class="dropdown-item" href="#">Another action</a>
                <a class="dropdown-item" href="#">Something else here</a>
                <div class="dropdown-divider"></div>
                <a class="dropdown-item" href="#">Separated link</a>
              </div>
            </li>
          </ul>
          <ul class="navbar-nav tabs mr-auto px-0 mx-0">
            <li
              class="nav-item mx-2"
              :class="{ active: $route.name === 'Overview' }"
            >
              <router-link class="nav-link " :to="'/app/overview/'">
                <i class="ci-dashboard_02 mr-1 align-middle "></i> Overview
              </router-link>
            </li>
            <li
              class="nav-item mx-2 "
              :class="{ active: $route.name === 'Collection' }"
            >
              <a
                class="nav-link"
                data-toggle="collapse"
                data-target="#collections-dropdown"
                ><i class="ci-layers_alt mr-1 align-middle "></i>Collections</a
              >
            </li>
            <li
              class="nav-item mx-2"
              :class="{ active: $route.name === 'Storage' }"
            >
              <router-link class="nav-link " :to="'/app/storage/'">
                <i class="ci-folder mr-1 align-middle "></i> Storage
              </router-link>
            </li>
            <li class="nav-item mx-2">
              <a class="nav-link" href="#"
                ><i class="ci-user mr-1 align-middle "></i>Users</a
              >
            </li>
            <li
              class="nav-item mx-2"
              :class="{ active: $route.name === 'Settings' }"
            >
              <router-link class="nav-link " :to="'/app/settings/'">
                <i class="ci-settings mr-1 align-middle "></i> Settings
              </router-link>
            </li>
            <li
              class="nav-item mx-2"
              :class="{ active: $route.name === 'Logs' }"
            >
              <router-link class="nav-link " :to="'/app/logs/'">
                <i class="ci-data mr-1 align-middle "></i> Logs
              </router-link>
            </li>

            <li
              class="nav-item mx-2"
              :class="{ active: $route.name === 'Playground' }"
            >
              <router-link class="nav-link " :to="'/app/logs/'">
                <i class="ci-color mr-1 align-middle "></i> Plugins
              </router-link>
            </li>
          </ul>
          <ul class="nav collapse mr-auto pt-3" id="collections-dropdown">
            <li class="nav-item" v-for="model in models" :key="model">
              <router-link
                class="nav-link ml-2 "
                :class="{ lactive: $route.params.slug === model }"
                :to="'/app/collection/' + model"
                v-show="model.substring(0, 1) != '_'"
              >
                <span v-html="emojize(model)"></span>

                {{ model }}
              </router-link>
            </li>
            <li class="nav-item">
              <a class="nav-link nav-dash ml-2" href="#/app/new/collection"
                ><i class="ci-plus mr-1 align-middle "></i> Add Collection</a
              >
            </li>
          </ul>
        </div>
      </div>
    </nav>
    <div class=" full-height pt-4 ">
      <div class="container pb-5 mt-5">
        <div class="row justify-content-center pt-5 px-3 ">
          <router-view :key="$route.fullPath"></router-view>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
//import vueFilePond from "vue-filepond";
//import "filepond/dist/filepond.min.css";

//import FilePondPluginImagePreview from "filepond-plugin-image-preview";
//import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.min.css";

import $ from "jquery";

const emojiFromText = require("emoji-from-text");

export default {
  name: "dsh",
  components: {
    //FilePond: vueFilePond(FilePondPluginImagePreview)
  },
  data() {
    return {
      models: [],
      navtoggled: false
    };
  },
  mounted() {
    const baseURI = "http://localhost:3000/collections";
    var config = { Authorization: this.$store.getters.getUser.apiKey };
    this.$http.get(baseURI, { headers: config }).then(result => {
      this.models = result.data;
      console.log(this.models);
    });
  },
  watch: {
    $route() {
      $(".collapse").collapse("hide");
      this.navtoggled = false;
    }
  },

  methods: {
    fetchUsers: function() {
      const baseURI = "localhost/model";
      this.$http.get(baseURI).then(result => {
        this.models = result.data;
        console.log(this.models);
      });
    },
    truncate(str, n) {
      return str.length > n ? str.substr(0, n - 1) + "..." : str;
    },
    emojize(str) {
      return emojiFromText(str, true).match.emoji.char;
    }
  }
};
</script>

<style></style>

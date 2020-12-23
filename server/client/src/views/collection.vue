<template>
  <div class="col-12 pt-1b">
    <div class="row py-4">
      <div class="col-12 ">
        <h2>{{ $route.params.slug }}</h2>
        <p>
          <i class="ci-layers mr-1 align-middle "></i>36 records
          <i class="ci-clock ml-1 align-middle "></i> Last Modified 12 october
          2020 15:30
        </p>
      </div>
    </div>
    <div class="row py-2">
      <div class="col-12">
        <div class="py-2 row">
          <div class="col-12 table-responsive">
            <table class="table datat pt-2  pr-2 " id="myTable">
              <thead>
                <tr>
                  <th v-for="k in keys" :key="k" scope="col">{{ k }}</th>
                  <th>
                    <i class="ci-more_vertical mr-1 align-middle btn-icon"></i>
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="r in res" :key="r._id">
                  <td v-for="x in r" :key="x + Math.random()">
                    <router-link
                      class="text-accent-6"
                      :to="
                        '/app/collection/edit/' +
                          $route.params.slug +
                          '/' +
                          r._id
                      "
                    >
                      {{ truncate(x.toString(), 24) }}
                    </router-link>
                  </td>
                  <td>
                    <i class="ci-more_vertical mr-1 align-middle btn-icon"></i>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Nprogress from "nprogress";
Nprogress.start();
var pluralize = require("pluralize");

import $ from "jquery";
import dt from "datatables.net-dt";
global.jQuery = require("jquery");
//var jQuery = global.jQuery;

require("@/assets/tp/dtb.js");
require("@/assets/tp/dtr.js");

console.log(dt.version);
export default {
  data() {
    return {
      keys: [],
      res: []
    };
  },
  created() {
    //Nprogress.start();
  },
  mounted() {
    var slug = this.$route.params.slug;
    var baseURI = "http://localhost:3000/api/" + slug;
    var config = { Authorization: this.$store.getters.getUser.apiKey };
    this.$http.get(baseURI, { headers: config }).then(result => {
      this.res = result.data;
      this.keys = Object.keys(this.res[0]);
      console.log(this.res);

      setTimeout(function() {
        $(".datat").DataTable();
        Nprogress.done();
      }, 500);
    });
  },
  methods: {
    truncate(str, n) {
      return str.length > n ? str.substr(0, n - 1) + "..." : str;
    },
    singular(str) {
      return pluralize.singular(str);
    }
  }
};
</script>

<style></style>

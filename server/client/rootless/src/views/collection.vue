<template>
  <div class="col-12 pt-5">
    <div class=" p-2">
      <div class="py-2 row">
        <div class="col">
          <div class="btn-group" role="group" aria-label="Basic example">
            <button type="button" class="btn btn-secondary">
              <i class="ci-plus_circle mr-1 align-middle "></i>Add
              {{ singular(this.$route.params.slug) }}
            </button>
            <button type="button" class="btn btn-secondary">
              <i class="ci-edit mr-1 align-middle "></i>Edit Collection
            </button>
            <button type="button" class="btn btn-secondary">
              <i class="ci-trash_full mr-1 align-middle"></i>Delete Collection
            </button>
          </div>
           
        </div>
        <div class="col">
          <input placeholder="search..." type="text" class="form-control" />
        </div>
      </div>
      <div class="py-2">
        <table class="table datat pt-2  pr-2 " id="myTable">
          <thead>
            <tr>
              <th v-for="k in keys" :key="k" scope="col">{{ k }}</th>
              <th><i class="ci-more_vertical mr-1 align-middle btn-icon"></i></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="r in res" :key="r._id">
              <td v-for="x in r" :key="x + Math.random()">
                <router-link
                  class="text-accent-6"
                  :to="
                    '/app/collection/edit/' + $route.params.slug + '/' + r._id
                  "
                >
                  {{ truncate(x.toString(), 24) }}
                </router-link>
              </td>
              <td><i class="ci-more_vertical mr-1 align-middle btn-icon"></i></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
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
  mounted() {
    var slug = this.$route.params.slug;
    var baseURI = "http://localhost:3000/api/" + slug + "?_auth=69420";
    this.$http.get(baseURI).then(result => {
      this.res = result.data;
      this.keys = Object.keys(this.res[0]);
      console.log(this.res);

      setTimeout(function() {
        $(".datatn").DataTable();
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

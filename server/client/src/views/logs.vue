<template>
  <div class="col-12">
    <div class="row py-4">
      <div class="col-12 ">
        <h2>Logs</h2>
        <p>Requests & Server Activity</p>
      </div>
    </div>
    <div class="row">
      <div class="col-12 d-flex-inline  justify-content-center ">
        <template v-for="log in logs">
          <div class="card-bordered p-3 my-4n " :key="log._id">
            <div class="row">
              <div class="col-lg-6">
                <h5>
                  {{ Date(log._timestamp) }}
                  <br />
                  <span class="text-muted"> {{ log.method }}</span>
                </h5>
                <p>{{ log.url }}</p>
              </div>
              <div class="col-lg-6">
                <h5 class="text-muted">{{ log.ip }}</h5>
                <p>{{ log.comment }}</p>
              </div>
            </div>
          </div>
          <div class="vl text-center mx-auto" :key="log._id + 1"></div>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      logs: []
    };
  },
  mounted() {
    const baseURI = "http://localhost:3000/logs";
    var config = { Authorization: this.$store.getters.getUser.apiKey };
    this.$http.get(baseURI, { headers: config }).then(result => {
      //console.log(result.data, this.$store.getters.getUser.apiKey)
      this.logs = result.data;
    });
  }
};
</script>

<style></style>

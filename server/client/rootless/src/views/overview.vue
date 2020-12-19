<template>
  <div class="col-12">
    <div class="row py-4">
      <div class="col-12 ">
        <h2>Logs</h2>
        <p>Requests & Server Activity</p>
      </div>
    </div>
    <div class="row">
        
        <div class="col-12">
            <div class="card-bordered p-4">
                <div class="row">
                    <div class="col-3">
                        <h5>Hostname</h5>
                        <p>{{ping.system.hostname}}</p>
                    </div>
                     <div class="col-3">
                        <h5>Uptime</h5>
                        <p>{{ping.uptime}}</p>
                    </div>
                     <div class="col-3">
                        <h5>Memory</h5>
                        <p>{{ping.system.memory}}</p>
                    </div>
                     <div class="col-3">
                        <h5>Cores</h5>
                        <p>{{ping.system.cores}}</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
  </div>
</template>

<script>
export default {
    data(){
        return{
            ping:[]
        }
    },
    mounted() {
    const baseURI = "http://localhost:3000/ping?_auth=69420";
    this.$http.get(baseURI).then(result => {
      this.ping = result.data;
      console.log(this.ping);
    });
  },
};
</script>

<style></style>

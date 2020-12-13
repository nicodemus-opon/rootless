<template>
   <div class="col-lg-12 col-sm-12 pt-5 ">
    <div class="row">
        <div class="col-lg-6">
            <div class="cardm ">
      <div class="form-group">
        <label>Public Key</label>
        <input type="text" class="form-control" />
      </div>
      <div class="form-group">
        <label>Private Key</label>
        <input type="text" class="form-control" />
      </div>
      <div class="form-group">
        <label>Server Port</label>
        
        <input type="number" class="form-control" id="inlineFormInputGroup" placeholder="3000">
      
      </div>
      <br>
      <div class="form-group">
        <label>Back Up Frequency</label>
        <select class="form-control">
          <option>Per Operation</option>
          <option>Daily</option>
          <option>Weekly</option>
          <option>Monthly</option>
          <option>Never</option>
        </select>
      </div>
      <div class="form-group">
        <label>Number of Backup's to keep</label>
        <select class="form-control">
          <option>1</option>
          <option>3</option>
          <option>5</option>
          <option>10</option>
          <option>15</option>
        </select>
      </div>
      <br>
      <div class="form-group">
        <label>Log All Requests and Resonses</label>
        <div class="switch_box box_1n">
          <input type="checkbox" class="switch_1" checked />
        </div>
      </div>
      <div class="form-group">
        <label>Cross-origin resource sharing</label>
        <div class="switch_box box_1n">
          <input type="checkbox" class="switch_1" checked />
        </div>
      </div>
      <br>
      <div class="form-group">
        <label>Logs</label>
        <textarea class="form-control" rows="3"></textarea>
      </div>
      <div class="pt-2">
        <button class="btn btn-primary ">
          Save
        </button>
      </div>
    </div>
        </div>
        <div class="col-lg-6">

        </div>
    </div>

  </div>
</template>

<script>
export default {

}
</script>

<style>

</style>
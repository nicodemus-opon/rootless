<template>
  <div class="col-12">
    <div class="row py-4">
      <div class="col-12 ">
        <h2>Add collection</h2>
        <p>create a new table/collection</p>
      </div>
    </div>
    <div class="row">
      <div class="col-lg-6">
        <div class="row">
          <div class=" my-2 col-12">
            <label>Collection Name *</label>
            <input type="text" class="form-control" />
          </div>
        </div>

        <div class="row drag-contb px-2b py-4">
          <div class="col-12">
            <hr>
            <label class="mb-2" for="">fields</label>
          </div>

          <div class="col-12">
            <div class="card-bordered p-4">
              <i class="ci-menu_duo btn-icon align-middle"></i>
              <i class="ci-edit btn-icon align-middle text-right ml-auto"></i>
              <span> User</span>
            </div>
          </div>
          <div class="col-12 pt-5">
            <button class="btn btn-secondary mr-2">Add Field</button>
          </div>
        </div>
      </div>
      <div class="col-lg-6">
        <div class="form-group">
          <label> <i class="ci-layers"></i> Collection Name *</label>
          <input type="text" class="form-control" />
        </div>

        <div class="add-cont pt-4">
          <button class="btn btn-primary mr-2">Save Changes</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  }
};
</script>

<style>
.editor {
  width: 600px;
  height: 300px;
}
</style>

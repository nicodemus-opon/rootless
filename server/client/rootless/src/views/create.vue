<template>
  <div class="col-lg-10 col-sm-12 pt-5 ">
    <div class="cardm ">
      <div class="form-group">
        <label>Text</label>
        <input type="date" class="form-control" />
      </div>
      <div class="form-group">
        <label>Text Area</label>
        <textarea class="form-control" rows="3"></textarea>
      </div>
      <div class="form-group">
        <label>Select</label>
        <select class="form-control">
          <option>Default select</option>
          <option>Default select 2</option>
          <option>Default select 3</option>
        </select>
      </div>
      <div class="form-group">
        <label>Rich Text</label>

        <div id="editor"></div>
      </div>

      <div class="form-group">
        <label class="py-2">File Input</label>
        <FilePond
          allowMultiple="true"
          server="http://localhost:3000/_uploads/"
        />
      </div>
      <div class="form-group">
        <label>Slider</label>
        <div class="switch_box box_1n">
          <input type="checkbox" class="switch_1" checked />
        </div>
      </div>
      <div class="form-group form-check">
        <input type="checkbox" class="form-check-inputn" />

        <label class="form-check-label">Checkbox</label>
      </div>
      <div class="pt-2">
        <button class="btn btn-primary ">
          Save
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {};
</script>

<style></style>

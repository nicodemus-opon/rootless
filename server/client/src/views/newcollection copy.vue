<template>
  <div class="col-8 pt-5">
    <div class="form-group">
      <label> <i class="ci-layers"></i> Collection Name *</label>
      <input type="text" class="form-control" />
    </div>
    <div class="dynamict py-2">
      <div class="row">
        <div class="col-12">
          <div class="card-bordered p-4">
            <label> <i class="ci-code"></i> Schema.json</label>
            <MonacoEditor
              theme="vs-dark"
              class="editor"
              v-model="code"
              language="json"
            />
          </div>
        </div>
      </div>
    </div>
    <div class="add-cont pt-4">
      <button class="btn btn-primary mr-2">Create Collection</button>
    </div>
  </div>
</template>

<script>
import MonacoEditor from "vue-monaco";

export default {
  components: {
    MonacoEditor
  },

  data() {
    return {
      code: `{
            "field1": {
                "type": "text"
            },
            "field2": {
                "type": "text"
            }
}`
    };
  }
};
</script>

<style>
.editor {
  width: 600px;
  height: 300px;
}
</style>

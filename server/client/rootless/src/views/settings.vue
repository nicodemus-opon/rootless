<template>
  <div class="col-lg-12 col-sm-12 ">
    <div class="row py-4">
      <div class="col-12 ">
        <h2>Settings</h2>
        <p>Configure server & Admin settings</p>
      </div>
    </div>
    <div class="row">
      <div class="col-12">
        <div class="row">
          <div class="col-lg-2">
            <div
              class="nav flex-column nav-pills"
              id="v-pills-tab"
              role="tablist"
              aria-orientation="vertical"
            >
              <a
                class="nav-link active"
                id="v-pills-home-tab"
                data-toggle="pill"
                href="#v-pills-home"
                role="tab"
                aria-controls="v-pills-home"
                aria-selected="true"
                >General</a
              >
              <a
                class="nav-link"
                id="v-pills-profile-tab"
                data-toggle="pill"
                href="#v-pills-profile"
                role="tab"
                aria-controls="v-pills-profile"
                aria-selected="false"
                >Auth Keys</a
              >
              <a
                class="nav-link"
                id="v-pills-messages-tab"
                data-toggle="pill"
                href="#v-pills-messages"
                role="tab"
                aria-controls="v-pills-messages"
                aria-selected="false"
                >Server</a
              >
              <a
                class="nav-link"
                id="v-pills-settings-tab"
                data-toggle="pill"
                href="#v-pills-settings"
                role="tab"
                aria-controls="v-pills-settings"
                aria-selected="false"
                >Backups</a
              >
            </div>
          </div>
          <div class="col-lg-10">
            <div class="tab-content" id="v-pills-tabContent">
          <div
            class="tab-pane fade show active"
            id="v-pills-home"
            role="tabpanel"
            aria-labelledby="v-pills-home-tab"
          >
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

            <input
              type="number"
              class="form-control"
              id="inlineFormInputGroup"
              placeholder="3000"
            />
          </div>
          <br />
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
          <br />
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
          <br />
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
          <div
            class="tab-pane fade"
            id="v-pills-profile"
            role="tabpanel"
            aria-labelledby="v-pills-profile-tab"
          >
            ..2.
          </div>
          <div
            class="tab-pane fade"
            id="v-pills-messages"
            role="tabpanel"
            aria-labelledby="v-pills-messages-tab"
          >
            .3..
          </div>
          <div
            class="tab-pane fade"
            id="v-pills-settings"
            role="tabpanel"
            aria-labelledby="v-pills-settings-tab"
          >
            .4..
          </div>
        </div>
          </div>
        </div>
      </div>
      <div class="col-lg-6">
        
      </div>
      <div class="col-lg-6"></div>
    </div>
  </div>
</template>

<script>
export default {};
</script>

<style></style>

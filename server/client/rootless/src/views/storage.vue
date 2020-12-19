<template>
  <div class="col-12 pt-5">
    <div class="row">
      <div class="col-12">
        <!--div class="form-group">
          <label class="py-2">Add File</label>
          <FilePond
            allowMultiple="true"
            server="http://localhost:3000/_uploads/"
          />
        </div-->
        <button
          class="btn btn-secondary"
          data-toggle="modal"
          data-target="#exampleModal"
        >
          <i class="ci-cloud_up"></i> Upload
        </button>
      </div>
    </div>

    <div class="row">
      <div class="col-12">
        <hr />
      </div>
      <div class="col-12">
        <p class="pt-4">Folders</p>
      </div>
      <div class="col-lg-3 col-sm-6 col-md-4 pr-0">
        <a href="" class="hh">
          <div class="card p-3 my-2">
            <label class="text ">
              <i class="ci-folder mr-1 icon-larger align-middle"></i>
              Uploads</label
            >
          </div>
        </a>
      </div>
    </div>
    <div class="row">
      <div class="col-12">
        <p class="pt-4">Files</p>
      </div>
      <div class="col-lg-4 pr-0" v-for="file in files" :key="file._id">
        <div class="card card-filepreview p-3 my-2">
          <div class="file-img-cont">
            <img
              class="file-img"
              v-if="file.mimetype.split('/')[0] === 'image'"
              :src="'http://' + file._url"
              alt=""
              srcset=""
            />
            <i
              class="mime text-center pt-5 mt-5"
              v-else
              :class="
                fileimg(
                  file.originalname.substr(
                    file.originalname.lastIndexOf('.') + 1
                  )
                )
              "
            ></i>
          </div>
          <div class="file-details">
            <span class="textb label">
              {{ truncate(file.originalname, 35) }}</span
            >
            <br />

            <span class="textb label">
              {{ (file.size / 1000000).toFixed(2) }}Mb</span
            >
            <br />
            <div class="controls pt-2">
              <i class="ci-copy mr-1 align-middle "></i>
              <i class="ci-download mr-1 align-middle "></i>
              <i class="ci-trash_empty mr-1 align-middle "></i>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- Modal -->
    <div
      class="modal fade pt-5 "
      id="exampleModal"
      tabindex="-1"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header text-center ">
            <h5 class="modal-title text-center" id="exampleModalLabel">
              Upload Files
            </h5>
            <i
              class="ci-close_big btn-close"
              data-dismiss="modal"
              aria-label="Close"
            ></i>
          </div>
          <div class="modal-body">
            <dashboard
              class="dash-b"
              :uppy="uppy"
              :plugins="['Webcam', 'Url', 'ImageEditor']"
            />
          </div>

          <!--div class="modal-footer pb-0 px-0 mx-0 ">
                                <div class="col-6 d-table btn-modal-left px-0 mx-0 my-0 " data-dismiss="modal">
                                    <span class="align-middle d-table-cell text-center">CANCEL</span>
                                </div>
                                <div class="col-6 d-table btn-modal-right mx-0 px-0 my-0 ">
                                    <span class="align-middle d-table-cell text-center"> <i class="ci-user"></i> SUBMIT</span>
                                </div>
                            </div-->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
//import vueFilePond from "vue-filepond";
import "filepond/dist/filepond.min.css";

//import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.min.css";

import { Dashboard } from "@uppy/vue";

import "@uppy/core/dist/style.css";
import "@uppy/dashboard/dist/style.css";

import Uppy from "@uppy/core";
import Webcam from "@uppy/webcam";
import XHRUpload from "@uppy/xhr-upload";
import Url from "@uppy/url";
const ImageEditor = require("@uppy/image-editor");

export default {
  components: {
    //FilePond: vueFilePond(FilePondPluginImagePreview),
    Dashboard
  },
  data() {
    return {
      keys: [],
      files: []
    };
  },
  mounted() {
    var baseURI = "http://localhost:3000/api/_uploads?_auth=69420";
    this.$http.get(baseURI).then(result => {
      this.files = result.data.reverse();
      //this.keys = Object.keys(this.res[0]);
      //console.log(this.files);
    });
  },
  methods: {
    truncate(str, n) {
      return str.length > n ? str.substr(0, n - 1) + "..." : str;
    },

    fileimg(mime) {
      if (mime == "pdf") {
        return "ci-file_pdf";
      } else if (mime == "zip" || mime == "rar" || mime == "tar") {
        return "ci-file_archive";
      } else {
        return "ci-file_blank_fill";
      }
    }
  },
  computed: {
    uppy: () =>
      new Uppy()
        .use(Webcam)
        .use(ImageEditor, {
          quality: 0.8
        })
        .use(Url, {
          companionUrl: "http://localhost:3000",
          locale: {}
        })
        .use(XHRUpload, {
          limit: 10,
          endpoint: "http://localhost:3000/_uploads",
          formData: true,
          fieldName: "file"
        })
  },
  beforeDestroy() {
    this.uppy.close();
  }
};
</script>

<style></style>

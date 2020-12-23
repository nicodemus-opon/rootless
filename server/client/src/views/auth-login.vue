<template>
  <div class="col-lg-5 pt-5g mt-5">
    <div class="row justify-content-center">
      <img
        class="text-center mx-auto my-5"
        src="@/assets/img/rootless.svg"
        height="82px"
      />
      
    </div>
    <ul
          class="errors px-0 text-left"
          v-for="error in validationErrors"
          :key="error.message"
        >
          <li class="d-block text-danger" data-aos="fade-in">
            <i class="ci-error"></i>
            <span class="ml-2 f-5 ls-default">{{ error.message }}</span>
          </li>
        </ul>
    <button class="btn btn-secondary btn-block btn-lg">
      <i class="ci-google align-middle mt-4 "></i> Login with Google
    </button>
    <div class="pt-5">
      <div class="form-group">
        <label>Email</label>
        <input
          type="email"
          @focus="resetError"
          class="form-control"
          placeholder="example@mail.com"
          v-model="email"
        />
        <small
          class="small-error text-danger form-text text-left"
          v-show="emailError != ''"
        >
          <i class="feather-info  align-middle"></i>
          {{ emailError }}</small
        >
      </div>
      <div class="form-group">
        <label>Password</label>
        <input
          v-model="password"
          @focus="resetError"
          type="password"
          class="form-control "
          placeholder="Password"
        />
        <small
          class="small-error text-danger form-text text-left"
          v-show="passwordError != ''"
        >
          <i class="feather-info  align-middle"></i>
          {{ passwordError }}</small
        >
      </div>
      <div class="py-2 d-flex">
        <a class="" href="">Create Acccount</a>
        <a class="text-right pull-right ml-auto" href="">Forgot Password</a>
      </div>
      <button
        class="btn btn-primary"
        @click.prevent="validate()"
        :disabled="loading"
      >
        Login
        <span
          v-show="loading"
          class="loading pl-1 my-auto pull-right text-right"
        >
        </span>
      </button>
    </div>
  </div>
</template>

<script>
import { mapActions } from "vuex";
import Nprogress from "nprogress";
Nprogress.done();
export default {
  data: function() {
    return {
      email: null,
      password: null,
      emailError: "",
      passwordError: "",
      validationErrors: [],
      loading: false
    };
  },
  methods: {
    ...mapActions(["setUpUserAction"]),
    resetError() {
      this.validationErrors = [];
      this.emailError = "";
      this.passwordError = "";
    },
    validate() {
      this.resetError();

      if (!this.email) {
        this.emailError = "E-mail cannot be empty";
      }
      if (/.+@.+/.test(this.email) != true && this.email) {
        this.emailError = "Invalid Email Address format";
      }
      if (!this.password) {
        this.passwordError = "Password cannot be empty";
      }
      if (/.{6,}/.test(this.password) != true && this.password) {
        this.passwordError = "Password should be at least 6 characters long";
      }
      if (
        this.validationErrors.length <= 0 &&
        this.emailError === "" &&
        this.passwordError === ""
      ) {
        this.login();
      }
    },
    login() {
      this.loading = true;
      var baseURI = "http://localhost:3000/auth/login";
      this.$http
        .post(baseURI, [
          {
            email: this.email,
            password: this.password
          }
        ])
        .then(response => {
          console.log(response.data);
          if (response.data.user) {
            this.setUpUserAction(response.data.user);
          }
          if (response.data.error) {
            this.validationErrors.push({
              message: response.data.error.message
            });
          }
          this.loading = false;
        });
      return 0;
    }
  }
};
</script>

<style></style>

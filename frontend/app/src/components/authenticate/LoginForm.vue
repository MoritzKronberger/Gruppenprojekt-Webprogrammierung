<template>
  <div>
    <h1>Login</h1>
    <div class="content auth">
      <Form auth_type="username_password" :auth="user" />
      <Validation
        :object="user"
        button_name="Login"
        @click="doLogin"
        btn_class="medium"
      />
      <p>No Account?</p>
      <router-link to="/register">
        <Button label="Register here" btn_class="medium" />
      </router-link>
    </div>
  </div>
</template>
<script>
import { mapFields } from "vuex-map-fields";
import { mapActions } from "vuex";
import router from "/router";
import Form from "./Form.vue";
import Button from "../Button.vue";
import Validation from "../validation/Form.vue";
export default {
  name: "LoginForm",
  components: { Button, Form, Validation },
  computed: {
    ...mapFields("auth", ["user", "report"]),
  },
  methods: {
    ...mapActions(["login"]),

    async doLogin() {
      const success = await this.login();
      if (success === 200) {
        console.log("success");
        router.push("/#/");
        this.report = null;
      } else if (success === 401) {
        this.report = "Invalid Username or Password";
      } else if (success > 401) {
        this.report = "Something went wrong";
      } else {
        this.report = null;
      }
    },
  },
};
</script>
<style lang="scss"></style>

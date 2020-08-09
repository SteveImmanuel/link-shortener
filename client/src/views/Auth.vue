<template>
  <div>
    <div>Auth</div>
    <AuthForm :btn_text="btn_text" />
    <button @click="Switch">Register</button>
  </div>
</template>

<script>
import AuthForm from "@/components/AuthForm";
import config from "@/config";

export default {
  name: "Auth",
  components: {
    AuthForm,
  },
  data() {
    return {
      is_registering: false,
      btn_text: "Login",
    };
  },
  methods: {
    Switch() {
      this.login({ alias: this.alias, password: this.password });
      this.is_registering = !this.is_registering;
      this.btn_text = this.is_registering ? "Register" : "Login";
    },
    async register() {
      const request = await fetch(`${config.api_url}/register`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ alias: this.alias, password: this.password }),
      });

      if (request.status === 200) {
        // success
      } else {
        //TODO: handle fail register
      }
    },
  },
};
</script>

<template>
  <div>
    <div>Auth</div>
    <AuthForm :btn_text="btn_text" />
    <button @click="Switch">Register</button>
  </div>
</template>

<script>
import AuthForm from "@/components/AuthForm";

export default {
  name: 'Auth',
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
      this.login({alias: this.alias, password: this.password})
      this.is_registering = !this.is_registering;
      this.btn_text = this.is_registering ? "Register" : "Login"
    },
  },
};
</script>

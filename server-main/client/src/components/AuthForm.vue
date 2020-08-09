<template>
  <div>
    <form @submit.prevent="handleSubmit">
      <input v-model="alias" type="text" placeholder="alias" />
      <input v-model="password" type="text" placeholder="password" />
      <button type="submit">{{ btn_text }}</button>
    </form>
    <button @click="refreshRoute">test refresh</button>
  </div>
</template>

<script>
import { mapActions } from "vuex";

export default {
  props: {
    btn_text: String,
  },
  data() {
    return {
      alias: null,
      password: null,
    };
  },
  methods: {
    ...mapActions(["login", "refreshRoute"]),
    handleSubmit() {
      this.login({ alias: this.alias, password: this.password });
    },
  },
};
</script>
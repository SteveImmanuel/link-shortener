<template>
  <div>
    <input type="text" v-model.trim="alias" />
    <input type="text" v-model.trim="password" />
    <button v-on:click="Submit()">Submit</button>
  </div>
</template>

<script>
export default {
  name: "Login",
  data() {
    return {
      alias: null,
      password: null,
    };
  },
  methods: {
    Submit: function(){
      console.log(this.alias);
      console.log(this.password);
    },
  },
};
</script>

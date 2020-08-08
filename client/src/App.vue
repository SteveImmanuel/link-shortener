<template>
  <div id="app">
    <Header />
    <Login />
  </div>
</template>

<script>
import Header from "./components/Header.vue";
import Login from "./components/Login.vue";

export default {
  name: "App",
  components: {
    Header,
    Login
  },
  data() {
    return {
      questions: []
    }
  },
  mounted: function() {
    this.questions = [1,1,1,1,1]
  }
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>

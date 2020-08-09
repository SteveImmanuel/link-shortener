<template>
  <ul>
    <li v-for="route in routes" :key="route._id">
      {{route.url}} | {{route.slug}}
    </li>
  </ul>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "ListRoutes",
  computed: {
    ...mapState(["routes"]),
  },
};
</script>
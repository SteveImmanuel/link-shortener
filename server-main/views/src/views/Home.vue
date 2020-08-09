<template>
  <div>
    <div>Home</div>
    <div>{{ alias }}</div>
    <LinkForm v-if="user_id" />
    <ListRoutes v-if="user_id" />
    <button v-if="user_id" @click="logOut">Log Out</button>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import LinkForm from "@/components/LinkForm";
import ListRoutes from "@/components/ListRoutes";

export default {
  name: "Home",
  components: {
    LinkForm,
    ListRoutes,
  },
  computed: {
    ...mapState(["user_id", "alias"]),
  },
  methods: {
    ...mapActions(["logOut"]),
  },
};
</script>

<template>
  <div>
    <div>Home</div>
    <div>{{ alias }}</div>
    <LinkForm v-if="user_id"/>
    <ListRoutes v-if="user_id"/>
  </div>
</template>

<script>
import { mapState } from "vuex";
import LinkForm from "@/components/LinkForm";
import ListRoutes from "@/components/ListRoutes";

export default {
  name: "Home",
  components: {
    LinkForm,
    ListRoutes
  },
  computed: {
    ...mapState(["user_id", "alias"]),
  },
};
</script>

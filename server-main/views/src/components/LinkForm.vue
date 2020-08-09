<template>
  <form @submit.prevent="addRoute">
    <input v-model="url" type="url" placeholder="url" />
    <input v-model="slug" type="text" placeholder="slug" />
    <button type="submit">Shorten</button>
  </form>
</template>

<script>
import { mapActions } from "vuex";

export default {
  data() {
    return {
      url: null,
      slug: null,
    };
  },
  methods: {
    ...mapActions(["refreshRoute"]),
    async addRoute() {
      const request = await fetch(`url`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url: this.url, slug: this.slug }),
        credentials: "include",
      });

      if (request.status === 200) {
        await this.refreshRoute();
      } else {
        //TODO: handle fail refresh
      }
    },
  },
};
</script>
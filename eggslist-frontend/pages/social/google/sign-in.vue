<template>
  <div />
</template>

<script>
import { localStorageKeyAuth } from "../../../utils/data";

export default {
  name: "GoogleSignIn",
  layout: "empty",
  async mounted() {
    try {
      const response = await this.$axios.$get(
        "/users/social/google/callback" + window.location.search
      );
      localStorage.setItem(localStorageKeyAuth, response.access);
      await this.$store.dispatch("auth/setToken", response.access);
      await this.$router.push("/");
      await this.$store.dispatch("nuxtClientInit", this);
    } catch (e) {
      throw e;
    }
  },
};
</script>

<style scoped></style>

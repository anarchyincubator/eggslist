<template>
  <div class="page">
    <div v-html="inner"></div>
  </div>
</template>

<script>
export default {
  name: "TermsPage",
  data() {
    return {
      inner: null,
    };
  },
  async mounted() {
    await this.$axios
      .get(`${window.location.origin}/user_terms.html`)
      .then((h) => {
        this.inner = h.data;
      });
  },
};
</script>

<style lang="scss" scoped>
.page {
  padding-top: 7rem;
  padding-bottom: 5rem;
}
</style>

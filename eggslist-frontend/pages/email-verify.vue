<template>
  <div />
</template>

<script>
export default {
  name: "EmailVerify",
  layout: "empty",
  async mounted() {
    try {
      await this.$store.dispatch(
        "auth/verifyEmailVerify",
        this.$route.query?.verification_code
      );
    } catch (e) {}
    await this.$router.push("/");
    await this.$store.dispatch("nuxtClientInit", this);
  },
};
</script>

<style scoped></style>

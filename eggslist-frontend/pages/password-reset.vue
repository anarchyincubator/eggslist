<template>
  <div class="page">
    <ForgetView v-if="!code"></ForgetView>
    <ResetView v-else :code="code"></ResetView>
  </div>
</template>

<script>
import ForgetView from "../components/Page/password/ForgetView";
import ResetView from "../components/Page/password/ResetView";
export default {
  name: "PasswordReset",
  components: { ResetView, ForgetView },
  data() {
    return {
      code: "",
    };
  },
  created() {
    this.code = this.$route.query?.reset_code;
  },
};
</script>

<style lang="scss" scoped>
.page {
  padding-top: vw(208px);
  max-width: vw(634px);
  align-self: center;
  padding-bottom: vw(144px);
  @include layout-mobile() {
    padding: mvw(110px) $padding-left-mobile mvw(60px) $padding-left-mobile;
    max-width: 100%;
    width: 100%;
  }
}
</style>

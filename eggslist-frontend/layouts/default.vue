<template>
  <div class="page-container" :class="{ 'page-container__index': isMainPage }">
    <client-only>
      <TheNavbar v-if="!isMobile" :is-static="!isMainPage && !isProfile" />
      <MobileNavbar v-else />
    </client-only>
    <transition name="fade">
      <AuthComponent v-if="isAuthComponent"></AuthComponent>
    </transition>
    <section class="default-layout-root">
      <nuxt> </nuxt>
      <TheFooter v-if="!isMainPage" class="page-container__footer" />
    </section>
    <AcceptCookies />
  </div>
</template>
<script>
import AcceptCookies from "../components/Common/AcceptCookies";
import TheNavbar from "~/components/Page/TheNavbar.vue";
import MobileNavbar from "~/components/Page/MobileNavbar.vue";
import TheFooter from "../components/Page/TheFooter";
import AuthComponent from "../components/Auth/AuthComponent";

export default {
  name: "DefaultLayout",
  components: {
    AuthComponent,
    TheFooter,
    TheNavbar,
    MobileNavbar,
    AcceptCookies,
  },
  transition: {
    mode: "fade-enter",
  },
  computed: {
    isMobile() {
      return this.$store.getters.isMobile;
    },
    isMainPage() {
      return this.$route.path === "/";
    },
    isProfile() {
      return this.$route.path === "/profile";
    },
    isAuthComponent() {
      return this.$store.state.authComponentShow;
    },
  },
};
</script>
<style lang="scss" scoped>
.page-container {
  min-height: 100%;
  display: flex;
  flex-direction: column;
  background-image: url("@/assets/images/noise.jpg");
  background-size: 80%;
  @include layout-mobile() {
    background-size: contain;
  }
  &__footer {
    margin-top: auto;
  }
}
.default-layout-root {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}
</style>

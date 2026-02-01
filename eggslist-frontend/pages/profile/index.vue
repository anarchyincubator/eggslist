<template>
  <div class="page">
    <div class="header-container">
      <PatternTop class="header-container__bottom" />
    </div>
    <AuthProfile v-if="isAuth && !loading"></AuthProfile>
    <GuestProfile v-if="!isAuth && !loading" :id="$route.query.id" />
  </div>
</template>

<script>
import AuthProfile from "../../components/Page/profile/AuthProfile";
import PatternTop from "../../components/Page/index/PatternTop";
import GuestProfile from "../../components/Page/profile/GuestProfile";
export default {
  name: "ProfilePage",
  components: {
    GuestProfile,
    AuthProfile,
    PatternTop,
  },
  data() {
    return {
      isAuth: true,
      loading: true,
    };
  },
  computed: {
    isAuthenticated() {
      return this.$store.getters["auth/isAuthenticated"];
    },
    user() {
      return this.$store.getters["user/user"];
    },
  },
  watch: {
    "$route.query": {
      async handler(val) {
        window.scrollTo(0, 0);
        const id = this.$route.query.id;
        this.isAuth = !id || id === this.user?.id.toString();
        this.loading = false;
      },
    },
  },
  async mounted() {
    const id = this.$route.query.id;

    this.isAuth = !id || id === this.user?.id.toString();

    if (this.isAuth) {
      await this.$store.dispatch("user/getUserFullData");
    }
    this.loading = false;
  },
};
</script>

<style lang="scss" scoped>
.page {
  .header-container {
    background-color: $primary-black;
    background-size: cover;
    padding-top: 9.375rem;
    padding-bottom: 5rem;
    width: 100vw;
    margin-left: calc(0rem - $padding-with-width);
    margin-bottom: 3.125rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;

    &__bottom {
      position: absolute;
      bottom: 0;
      width: 100%;
      height: 1.5rem;
      background-size: cover;
      @include layout-mobile() {
        height: mvw(60px);
        bottom: mvw(-42px);
        width: 101%;
        transform: scale(1);
      }
    }

    @include layout-mobile() {
      padding: mvw(70px) $padding-left-mobile 0 $padding-left-mobile;
      margin-left: -$padding-left-mobile;
      margin-bottom: 0;
      width: 100%;
      height: mvw(100px);
    }
  }
}
</style>

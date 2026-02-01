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
      <div class="error-container">
        <strong>404 error</strong>
        <h1>Oh no! We Can’t Seem To Find The Page You Are Looking For.</h1>
        <div class="error-container__buttons">
          <div class="button-1 error-container__button" @click="handleToMain">
            Go To Homepage
            <div class="error-container__button--icon">
              <img src="@/assets/images/icons/arrow-forward.svg" />
            </div>
          </div>
          <div class="button-1 error-container__button">
            Contact Us
            <div class="error-container__button--icon">
              <img src="@/assets/images/icons/arrow-forward.svg" />
            </div>
          </div>
        </div>
      </div>
      <TheFooter class="page-container__footer" />
    </section>
  </div>
</template>
<script>
import AuthComponent from "../components/Auth/AuthComponent";
import TheFooter from "../components/Page/TheFooter";
import TheNavbar from "../components/Page/TheNavbar";
import MobileNavbar from "../components/Page/MobileNavbar";

export default {
  name: "ErrorLayout",
  components: {
    AuthComponent,
    TheFooter,
    TheNavbar,
    MobileNavbar,
  },
  layout: "empty",
  transition: {
    mode: "fade-enter",
  },
  props: {
    error: {
      type: Object,
      default: () => {
        statusCode: 422;
      },
    },
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
  methods: {
    handleToMain() {
      this.$router.push("/");
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
.error-container {
  width: 53rem;
  align-self: center;
  margin: 18.75rem 0 14rem 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  @include layout-mobile() {
    width: 100%;
    margin: mvw(120px) 0;
  }
  h1 {
    text-align: center;
  }
  strong {
    letter-spacing: 1.2px;
    font-weight: 700;
    font-size: 0.75rem;
    line-height: 1rem;
    text-align: center;
    text-transform: uppercase;
    margin-bottom: 0.5rem;
    @include layout-mobile() {
      font-size: mvw(12px);
      line-height: mvw(16px);
      margin-bottom: mvw(8px);
    }
  }
  &__buttons {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 2.5rem;
    @include layout-mobile() {
      margin-top: mvw(20px);
      flex-direction: column;
    }
  }
  &__button {
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    margin-right: 1.5rem;
    @include layout-mobile() {
      margin: 0;
      margin-bottom: mvw(14px);
    }
    &:hover {
      opacity: 0.8;
    }
    &--icon {
      margin-left: 0.5rem;
      border: 1.5px solid $primary-marigold;
      border-radius: 50%;
      width: 2rem;
      height: 2rem;
      display: flex;
      align-items: center;
      justify-content: center;
      @include layout-mobile() {
        width: mvw(32px);
        height: mvw(32px);
      }
      img {
        width: 1rem;
        @include layout-mobile() {
          width: mvw(16px);
        }
      }
    }
  }
}
</style>

<template>
  <div v-scroll-lock="true" class="auth-container">
    <div class="auth-container__content" :style="styleScale">
      <LoginView
        v-if="isLogin"
        @regClick="handleRegClick"
        @forgetClick="handleForgetClick"
      ></LoginView>
      <RegView v-else-if="isReg" @loginClick="handleLoginClick"></RegView>
      <img
        :src="closePath"
        class="auth-container__close"
        @click="handleCloseAuth"
      />
    </div>
    <div class="auth-container__back" @click="handleCloseAuth"></div>
  </div>
</template>

<script>
import LoginView from "./LoginView";
import RegView from "./RegView";
import close from "@/assets/images/icons/close.svg";
import closeDark from "@/assets/images/icons/close_dark.svg";
export default {
  name: "AuthComponent",
  components: { RegView, LoginView },
  data() {
    return {
      stateAuth: "login",
    };
  },
  computed: {
    windowHeight() {
      return this.$store.state.windowHeight;
    },
    windowWidth() {
      return this.$store.state.windowWidth;
    },
    isMobile() {
      return this.$store.getters["isMobile"];
    },
    closePath() {
      return this.isMobile ? closeDark : close;
    },
    styleScale() {
      if (this.isMobile) return;

      return ` transform: translate(-50%, -50%) scale(${
        this.windowWidth < this.windowHeight
          ? this.windowWidth / this.windowHeight / 1.5
          : 1.5 / (this.windowWidth / this.windowHeight)
      });`;
    },
    isLogin() {
      return this.stateAuth === "login";
    },
    isReg() {
      return this.stateAuth === "reg";
    },
  },
  methods: {
    handleRegClick() {
      this.stateAuth = "reg";
    },
    handleForgetClick() {
      this.stateAuth = "forget";
    },
    handleLoginClick() {
      this.stateAuth = "login";
    },
    handleCloseAuth() {
      this.$store.commit("setAuthComponent", false);
    },
  },
};
</script>

<style lang="scss" scoped>
.auth-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 10000;
  &__content {
    position: absolute;
    transform: translate(-50%, -50%);
    left: 50%;
    top: 50%;
    z-index: 1000;
    width: 32.8125rem;
    padding: 3rem;
    box-sizing: border-box;
    border-radius: 0.75rem;
    background-color: $primary-white;
    @include layout-mobile() {
      width: 100%;
      padding: mvw(20px);
      border-radius: 0px;
      top: 0;
      left: 0;
      transform: none;
    }
  }
  &__close {
    position: absolute;
    width: 1.125rem;
    top: 1.125rem;
    cursor: pointer;
    right: -2.625rem;
    &:hover {
      opacity: 0.7;
    }
    @include layout-mobile() {
      width: mvw(18px);
      top: mvw(38px);
      right: mvw(26px);
    }
  }
  &__back {
    width: 100%;
    position: fixed;
    height: 100%;
    z-index: 500;
    background-color: rgba(0, 0, 0, 0.5);
  }
  @include layout-mobile() {
    height: 1px;
    min-height: 100%;
    overflow-y: scroll;
  }
}
</style>

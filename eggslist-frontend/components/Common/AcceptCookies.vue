<template>
  <transition name="fade">
    <div v-if="isShow" class="cookies">
      <div>
        <span
          >This website uses cookies to ensure you get the best
          experience.</span
        >
        <nuxt-link to="/privacy">Privacy Policy</nuxt-link>
      </div>
      <div class="cookies__buttons">
        <CustomButton
          class="cookies__buttons--button"
          theme="secondary"
          @click="handleAccept"
        >
          Accept Cookies
        </CustomButton>
        <div class="cookies__buttons--close" @click="handleClose">
          <img src="@/assets/images/icons/close.svg" />
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import CustomButton from "./CustomButton";
export default {
  name: "AcceptCookies",
  components: {
    CustomButton,
  },
  data() {
    return {
      isShow: false,
    };
  },
  computed: {
    acceptCookies() {
      return this.$store.getters["acceptCookies"];
    },
  },
  watch: {
    "$route.path": {
      handler(e) {
        if (this.acceptCookies) return;

        this.isShow = true;
      },
    },
  },
  mounted() {
    if (this.acceptCookies) return;

    this.isShow = true;
  },
  methods: {
    handleClose() {
      this.isShow = false;
    },
    handleAccept() {
      this.$store.dispatch("setAcceptCookies");
      this.isShow = false;
    },
  },
};
</script>

<style lang="scss" scoped>
.cookies {
  position: fixed;
  bottom: 0;
  display: flex;
  align-items: center;
  z-index: 800;
  left: 0;
  width: 100%;
  box-sizing: border-box;
  padding: 0.875rem $padding-with-width;
  background: $primary-white;
  justify-content: space-between;
  @include layout-mobile() {
    flex-direction: column;
    padding: mvw(16px) $padding-left-mobile;
  }
  a {
    cursor: pointer;
    text-decoration: underline;
  }
  span,
  a {
    font-size: 0.75rem;
    @include layout-mobile() {
      line-height: mvw(16px);
      font-size: mvw(12px);
    }
  }
  &__buttons {
    display: flex;
    align-items: center;
    @include layout-mobile() {
      width: 100%;
      margin-top: mvw(10px);
    }
    &--button {
      height: 2.25rem;
      margin-right: 1.25rem;
      @include layout-mobile() {
        padding: 0;
        width: 100%;
        height: mvw(36px);
      }
    }
    &--close {
      width: 1.25rem;
      height: 1.25rem;
      cursor: pointer;
      border-radius: 50%;
      background: #282220;
      display: flex;
      align-items: center;
      justify-content: center;
      img {
        height: 0.5625rem;
      }
      @include layout-mobile() {
        width: mvw(20px);
        height: mvw(20px);
        flex-shrink: 0;
        img {
          height: mvw(9px);
        }
      }
    }
  }
}
</style>

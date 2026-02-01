<template>
  <client-only>
    <footer class="footer">
      <img src="@/assets/images/footer_up.png" class="footer__additive--back" />
      <div v-if="isAdditive" class="footer__additive">
        <FooterQuotes v-if="isNonAuth" :quotes="quotes"></FooterQuotes>
        <div v-if="isNonAuth" class="footer__additive__join">
          <div>
            <h2>Join The Movement!</h2>
            <div class="body-1">
              Sign up start buying and selling local food with Egglist!
            </div>
          </div>
          <CustomButton
            class="footer__additive__join--button"
            theme="primary"
            @click="handleClickLogin"
          >
            Get Started
            <img slot="add" src="@/assets/images/icons/arrow-forward.svg" />
          </CustomButton>
        </div>
      </div>
      <div class="footer__top">
        <img class="footer__logo" src="@/assets/images/icons/logo.svg" />
        <div class="footer__top-center">
          <div class="footer__top-center--first">
            <nuxt-link to="/catalog">Market</nuxt-link>
            <nuxt-link to="/about">About</nuxt-link>
            <nuxt-link to="/blogs">Our stories</nuxt-link>
          </div>
          <div class="footer__top-center--second">
            <nuxt-link to="">Account</nuxt-link>
            <nuxt-link to="">Contact us</nuxt-link>
          </div>
        </div>
        <div class="footer__top-icons">
          <div class="footer__top--icon">
            <img
              src="@/assets/images/icons/social-fb.svg"
              @click="handleShareClick"
            />
          </div>
          <div class="footer__top--icon">
            <img
              src="@/assets/images/icons/social-tw.svg"
              @click="handleShareClick"
            />
          </div>
          <div class="footer__top--icon">
            <img
              src="@/assets/images/icons/social-inst.svg"
              @click="handleShareClick"
            />
          </div>
        </div>
      </div>
      <div class="footer__bottom">
        <span>© 2022 Eggslist. All rights reserved.</span>
        <div class="footer__bottom-right">
          <nuxt-link to="/terms">Terms of Service</nuxt-link>
          <nuxt-link to="/privacy">Privacy Policy</nuxt-link>
        </div>
      </div>
    </footer>
  </client-only>
</template>

<script>
import CustomButton from "../Common/CustomButton";
import FooterQuotes from "./index/FooterQuotes";
export default {
  name: "TheFooter",
  components: {
    CustomButton,
    FooterQuotes,
  },
  props: {
    isNonAuth: {
      type: Boolean,
      default: false,
    },
    isAdditive: {
      type: Boolean,
      default: false,
    },
    quotes: {
      type: Array,
      default: () => [],
    },
  },
  methods: {
    handleShareClick(type) {},
    handleClickLogin() {
      this.$store.commit("setAuthComponent", true);
    },
  },
};
</script>

<style lang="scss" scoped>
.footer {
  background: $primary-black;
  width: 100%;
  position: relative;
  margin-left: calc(0rem - $padding-with-width);
  padding: 3.25rem $padding-with-width 5rem $padding-with-width;
  color: $primary-cream;
  display: flex;
  z-index: 5;
  flex-direction: column;
  &__logo {
    width: 11.125rem;
    margin-right: 20rem;
    cursor: pointer;
    @include layout-mobile() {
      width: mvw(120px);
      margin: 0;
      margin-bottom: mvw(48px);
    }
  }
  &__additive {
    &--back {
      height: 7.8125rem;
      margin-left: calc(0rem - $padding-with-width);
      width: 100%;
      position: absolute;
      top: -7.1875rem;
      z-index: 5;
      @include layout-mobile() {
        height: mvw(70px);
        top: mvw(-65px);
        margin-left: -$padding-left-mobile;
      }
    }
    &__join {
      box-sizing: border-box;
      color: $primary-black;
      width: 100%;
      background-image: url("@/assets/images/pattern_white.png");
      background-size: cover;
      border-radius: 0.75rem;
      padding: 4.375rem;
      display: flex;
      align-items: center;
      margin-bottom: 12.5rem;
      .body-1 {
        width: 53.125rem;
        margin-top: 2rem;
        @include layout-mobile() {
          width: 100%;
          margin-top: mvw(16px);
        }
      }
      &--button {
        height: 3.5rem;
        display: flex;
        font-weight: 600;
        margin-left: auto;
        span {
          display: flex;
        }
        img {
          margin-left: 0.75rem;
          align-items: center;
          width: 1rem;
        }
        @include layout-mobile() {
          height: mvw(56px);
          width: 100%;
          font-size: mvw(16px);
          margin-top: mvw(24px);
          padding: 0;
          img {
            margin-left: mvw(12px);
            width: mvw(16px);
          }
        }
      }
      @include layout-mobile() {
        flex-direction: column;
        padding: mvw(30px) mvw(24px);
        text-align: center;
        border-radius: mvw(12px);
        margin-bottom: mvw(150px);
      }
    }
  }
  &__top {
    display: flex;
    align-items: flex-start;
    @include layout-mobile() {
      flex-direction: column;
    }
    &-center {
      display: flex;
      margin-right: auto;
      a {
        margin-bottom: 1.5rem;
        font-size: 0.875rem;
        line-height: 1rem;
        font-weight: 600;
        @include layout-mobile() {
          font-size: mvw(14px);
          line-height: mvw(16px);
          margin-bottom: mvw(24px);
        }
      }
      &--second {
        display: flex;
        flex-direction: column;
      }
      &--first {
        margin-right: vw(220px);
        display: flex;
        flex-direction: column;
        @include layout-mobile() {
          margin-right: mvw(50px);
        }
      }
    }
    &-icons {
      display: flex;
      @include layout-mobile() {
        margin-top: mvw(30px);
      }
    }
    &--icon {
      border: 1.5px solid $primary-marigold;
      width: 3rem;
      height: 3rem;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      cursor: pointer;
      margin-right: vw(16px);
      &:hover {
        opacity: 0.8;
      }
      img {
        height: 1.125rem;
        @include layout-mobile() {
          height: mvw(18px);
        }
      }
      @include layout-mobile() {
        width: mvw(48px);
        height: mvw(48px);
        margin-right: mvw(16px);
      }
    }
  }
  &__bottom {
    margin: 5rem auto 0 auto;
    display: flex;
    span,
    a {
      font-size: 0.75rem;
      line-height: 1rem;
      margin-right: 0.9375rem;
      @include layout-mobile() {
        font-size: mvw(12px);
        line-height: mvw(16px);
        margin-right: 0;
        margin-bottom: mvw(16px);
      }
    }
    &-right {
      display: flex;
      @include layout-mobile() {
        flex-direction: column;
      }
    }
    @include layout-mobile() {
      flex-direction: column-reverse;
      margin: mvw(50px) 0 0 0;
    }
  }
  @include layout-mobile() {
    margin-left: -$padding-left-mobile;
    padding: mvw(43px) $padding-left-mobile mvw(64px) $padding-left-mobile;
  }
}
</style>

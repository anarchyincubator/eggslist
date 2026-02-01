<template>
  <div class="login">
    <h2>Log In</h2>
    <div class="login__create">
      <span>Don’t have an account?</span>
      <a @click="handleCreateClick">Create An Account</a>
    </div>
    <h3 class="login__h3">Log in with email</h3>
    <div class="login__form">
      <custom-input
        v-model="email"
        name="email"
        :is-in-valid="Boolean(errorLogin)"
        :error-text="errorLogin"
        tabindex="0"
        @focus="handleFocusLogin"
      >
        <label slot="label">Email<strong>*</strong></label>
      </custom-input>
      <custom-input
        v-model="password"
        :type="isShowPass ? 'password' : 'text'"
        class="login__form--password"
        tabindex="1"
        :is-in-valid="Boolean(errorPassword)"
        :error-text="errorPassword"
        :icon="visibilityIcon"
        @focus="handleFocusPassword"
        @clickIcon="handleShowPassword"
      >
        <label slot="label">Password<strong>*</strong></label>
      </custom-input>
      <div class="login__form--forgot" @click="handleForgetClick">
        Forgot Password?
      </div>
      <custom-button
        class="login__form--button"
        tab-index="2"
        theme="primary"
        :is-loading="loadingLogin"
        @click="submitLogin"
        >Log In</custom-button
      >
    </div>
    <div class="login__border"></div>
    <h3 class="login__bottom--h3">Log in with social</h3>
    <CustomButton
      class="login__bottom--button"
      theme="secondary"
      :is-loading="loadingGoogle"
      @click="handleGoogle"
    >
      <img src="@/assets/images/icons/google.svg" /> Continue with Google
    </CustomButton>
    <CustomButton
      class="login__bottom--button"
      theme="secondary"
      :is-loading="loadingFacebook"
      @click="handleFacebook"
    >
      <img src="@/assets/images/icons/fb.svg" /> Continue with Facebook
    </CustomButton>
  </div>
</template>

<script>
import visibilityIcon from "@/assets/images/icons/visibility.svg";
import CustomInput from "../Common/CustomInput";
import CustomButton from "../Common/CustomButton";
export default {
  name: "LoginView",
  components: { CustomButton, CustomInput },
  emits: ["regClick", "forgetClick"],
  data() {
    return {
      email: "",
      password: "",
      isShowPass: true,
      errorLogin: null,
      errorPassword: null,
      loadingLogin: false,
      loadingGoogle: false,
      loadingFacebook: false,
      visibilityIcon,
    };
  },
  methods: {
    handleCreateClick() {
      this.$emit("regClick");
    },
    handleForgetClick() {
      this.$store.commit("setAuthComponent", false);
      window.open("/password-reset", "_blank");
    },
    validatePasswordField(password) {
      this.errorPassword = null;
      if (!password) {
        this.errorPassword = "The password is required";
        return false;
      }
      if (password.length <= 7) {
        this.errorPassword = "Password must be more than 7 symbols";
        return false;
      }

      this.errorPassword = null;
      return true;
    },
    validateLoginField(email) {
      this.errorLogin = null;

      let re = /\S+@\S+\.\S+/;
      if (!email) {
        this.errorLogin = "The login is required";
        return false;
      }
      if (!re.test(email)) {
        this.errorLogin = "Email is not valid";
        return false;
      }

      this.errorLogin = null;
      return true;
    },
    validateLogin() {
      let value = true;

      value &= this.validateLoginField(this.email);
      value &= this.validatePasswordField(this.password);

      return value;
    },
    handleFocusLogin() {
      this.errorLogin = null;
    },
    handleShowPassword() {
      this.isShowPass = !this.isShowPass;
    },
    handleFocusPassword() {
      this.errorPassword = null;
    },
    async handleGoogle() {
      this.loadingGoogle = true;
      try {
        const response = await this.$axios.$post(
          "/users/social/google/sign-in"
        );
        window.close();
        window.open(response.social_url);
      } catch (e) {}
      this.loadingGoogle = false;
    },
    async handleFacebook() {
      this.loadingFacebook = true;
      try {
        const response = await this.$axios.$post(
          "/users/social/facebook/sign-in"
        );
        window.close();
        window.open(response.social_url);
      } catch (e) {}
      this.loadingFacebook = false;
    },
    async submitLogin() {
      if (!this.validateLogin()) return;
      this.loadingLogin = true;
      try {
        await this.$store.dispatch("auth/login", {
          email: this.email,
          password: this.password,
        });
        this.$store.commit("setAuthComponent", false);
        this.loadingLogin = false;
      } catch (e) {
        this.loadingLogin = false;
        this.errorLogin = e.data?.detail;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.login {
  h2 {
    margin-bottom: 1rem;
    @include layout-mobile() {
      margin-bottom: mvw(16px);
    }
  }
  &__create {
    margin-bottom: 3rem;
    display: flex;
    align-items: center;
    cursor: pointer;
    span {
      font-size: 1rem;
      line-height: 1.5rem;
      margin-right: 0.5rem;
      @include layout-mobile() {
        font-size: mvw(16px);
        line-height: mvw(24px);
        margin: 0 0 mvw(4px);
      }
    }
    a {
      font-weight: 600;
      margin-bottom: 0.5rem;
      font-size: 1rem;
      line-height: 1.5rem;
      border-bottom: 2px solid $primary-marigold;
      @include layout-mobile() {
        margin-bottom: 0;
        font-size: mvw(14px);
        line-height: mvw(24px);
      }
    }
    @include layout-mobile() {
      flex-direction: column;
      align-items: baseline;
      margin-bottom: mvw(24px);
    }
  }
  &__h3 {
    margin-bottom: 1.5rem;
    @include layout-mobile() {
      font-size: mvw(18px);
      margin-bottom: mvw(16px);
    }
  }
  &__form {
    &--button {
      width: 100%;
      font-weight: bold;
      height: 3.5rem;
      @include layout-mobile() {
        height: mvw(48px);
      }
    }
    &--password {
      margin: 1.75rem 0 2rem 0;
      @include layout-mobile() {
        margin: mvw(20px) 0 mvw(20px) 0;
      }
    }
    &--forgot {
      border-bottom: 2px solid $primary-marigold;
      margin-bottom: 3rem;
      padding-bottom: 0.25rem;
      cursor: pointer;
      width: fit-content;
      font-size: 1rem;
      line-height: 1.5rem;
      font-weight: 600;

      @include layout-mobile() {
        margin-bottom: mvw(10px);
        padding-bottom: mvw(4px);
        font-size: mvw(14px);
        line-height: mvw(24px);
      }
    }
    strong {
      color: #b00020;
      font-weight: 400;
    }
  }
  &__border {
    height: 0.0625rem;
    background-color: $neutral-70;
    margin: 3rem 0;
    @include layout-mobile() {
      margin: mvw(32px) 0;
      height: mvw(1px);
    }
  }
  &__bottom {
    &--h3 {
      margin-bottom: 3rem;
      @include layout-mobile() {
        margin-bottom: mvw(30px);
      }
    }
    &--button {
      width: 100%;
      margin-bottom: 1rem;
      font-weight: 600;
      height: 3.5rem;
      display: flex;
      align-items: center;
      img {
        width: 1.125rem;
        margin-right: 0.6875rem;
        @include layout-mobile() {
          margin-right: mvw(11px);
          width: mvw(18px);
        }
      }
      @include layout-mobile() {
        margin-bottom: mvw(10px);
        height: mvw(48px);
        padding: mvw(10px);
      }
    }
  }
}
</style>

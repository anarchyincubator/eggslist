<template>
  <div class="forget">
    <h1>{{ !sent ? "Forgot Password" : "Confirmation Sent" }}</h1>
    <div v-if="sent" class="forget__sent body-1">
      If your account is associated with this email address you will receive an
      email to reset your password.
    </div>
    <div v-else class="forget__form">
      <custom-input
        v-model="login"
        :is-in-valid="Boolean(errorLogin)"
        :error-text="errorLogin"
        tabindex="0"
        @focus="handleFocusLogin"
      >
        <label slot="label">Email<strong>*</strong></label>
      </custom-input>
      <div class="forget__create body-1">
        Enter your email address and we'll send you a link to reset your
        password.
      </div>
      <custom-button
        class="forget__form--button"
        tab-index="2"
        theme="primary"
        :is-loading="loadingLogin"
        @click="submitLogin"
        >Reset My Password</custom-button
      >
    </div>
  </div>
</template>

<script>
import CustomInput from "../../Common/CustomInput";
import CustomButton from "../../Common/CustomButton";
export default {
  name: "ForgetView",
  components: {
    CustomInput,
    CustomButton,
  },
  data() {
    return {
      login: "",
      errorLogin: "",
      loadingLogin: false,
      sent: false,
    };
  },
  methods: {
    handleFocusLogin() {
      this.errorLogin = null;
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

      value &= this.validateLoginField(this.login);

      return value;
    },
    async submitLogin() {
      if (!this.validateLogin()) return;
      this.loadingLogin = true;
      try {
        await this.$store.dispatch("auth/requestPassword", this.login);
        this.loadingLogin = false;
        this.sent = true;
        setTimeout(() => {
          window.scrollTo(0, 0);
        }, 0);
      } catch (e) {
        this.loadingLogin = false;
        if (e.data?.email?.length > 0) {
          this.errorLogin = e.data?.email[0];
        } else {
          this.errorLogin = e.data?.email;
        }
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.forget {
  h1 {
    margin-bottom: 3rem;
    @include layout-mobile() {
      margin-bottom: mvw(16px);
    }
  }
  &__create {
    margin-bottom: 3rem;
    margin-top: 1.5rem;
    display: flex;
    align-items: center;
    @include layout-mobile() {
      flex-direction: column;
      align-items: baseline;
      margin-bottom: mvw(32px);
      margin-top: mvw(24px);
    }
  }
  &__sent {
    margin-top: 1.5rem;
    display: flex;
    align-items: center;
    @include layout-mobile() {
      flex-direction: column;
      align-items: baseline;
      margin-top: mvw(32px);
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
      width: 13.5rem;
      font-weight: bold;
      height: 3.5rem;
      margin-top: 3rem;
      @include layout-mobile() {
        height: mvw(48px);
        width: 100%;
        padding: mvw(16px) mvw(10px);
      }
    }
    strong {
      color: #b00020;
      font-weight: 400;
    }
  }
}
</style>

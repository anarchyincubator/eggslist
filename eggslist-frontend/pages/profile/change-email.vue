<template>
  <div class="page">
    <div class="forget">
      <h1>Change Your Email</h1>
      <div class="forget__form">
        <custom-input
          v-model="login"
          :is-in-valid="Boolean(errorLogin)"
          :error-text="errorLogin"
          tabindex="0"
          @focus="handleFocusLogin"
        >
          <label slot="label">New Email<strong>*</strong></label>
        </custom-input>
        <div class="forget__form--buttons">
          <CustomButton
            class="forget__form--buttons--verified"
            theme="primary"
            :is-loading="loadingLogin"
            @click="submitLogin"
            >Change My Email</CustomButton
          >
          <CustomButton
            class="forget__form--buttons--cancel"
            theme="secondary"
            @click="handleToProfile"
            >Cancel</CustomButton
          >
          <span
            class="forget__form--buttons--cancel--mobile button-1"
            @click="handleToProfile"
            >Cancel</span
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import CustomInput from "../../components/Common/CustomInput";
import CustomButton from "../../components/Common/CustomButton";
import user from "../../utils/adapters/User";
export default {
  name: "ChangeEmailPage",
  components: {
    CustomInput,
    CustomButton,
  },
  middleware: ["auth"],
  data() {
    return {
      login: "",
      errorLogin: "",
      loadingLogin: false,
    };
  },
  computed: {
    user() {
      return this.$store.getters["user/user"];
    },
  },
  mounted() {
    this.login = this.user.email;
  },
  methods: {
    handleFocusLogin() {
      this.errorLogin = null;
    },
    handleToProfile() {
      this.$router.push("/profile");
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
        await this.$store.dispatch("user/updateProfile", { email: this.login });
        await this.$store.dispatch("user/getUserData");
        this.loadingLogin = false;
        await this.$router.push("/profile");
      } catch (e) {
        this.loadingLogin = false;
        if (e?.email?.length > 0) {
          this.errorLogin = e.email[0];
        } else {
          this.errorLogin = e.email;
        }
      }
    },
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
    &--buttons {
      display: flex;
      margin-top: 3rem;
      @include layout-mobile() {
        flex-direction: column;
        align-items: center;
      }
      &--verified {
        margin-right: 1.5rem;
        width: 11.9375rem;
        @include layout-mobile() {
          width: 100%;
          padding: 0;
          margin: 0;
        }
      }
      &--cancel {
        display: flex;
        @include layout-mobile() {
          display: none;
        }
        &--mobile {
          border-bottom: 2px solid $primary-marigold;
          display: none;
          @include layout-mobile() {
            display: flex;
            width: mvw(58px);
            margin-top: mvw(24px);
          }
        }
      }
    }
    strong {
      color: #b00020;
      font-weight: 400;
    }
  }
}
</style>

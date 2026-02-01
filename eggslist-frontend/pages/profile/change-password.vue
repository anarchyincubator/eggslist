<template>
  <div class="page">
    <div class="reset">
      <h1>Change Your Password</h1>
      <div v-if="sent" class="reset__sent body-1">
        Your Eggslist Password has been changed.
        <a @click="handleProfile"> Go to Profile</a>
      </div>
      <div v-else class="reset__form">
        <custom-input
          v-model="password"
          type="password"
          class="reset__form--password"
          tabindex="1"
          :is-in-valid="Boolean(errorPassword)"
          :error-text="errorPassword"
          @focus="handleFocusPassword"
        >
          <label slot="label">New Password<strong>*</strong></label>
        </custom-input>
        <custom-input
          v-model="passwordRepeat"
          type="password"
          class="reset__form--password"
          tabindex="1"
          @focus="handleFocusPasswordRepeat"
        >
          <label slot="label">Confirm Password<strong>*</strong></label>
        </custom-input>
        <div class="reset__form--buttons">
          <CustomButton
            class="reset__form--buttons--verified"
            theme="primary"
            :is-loading="loading"
            @click="submitReset"
            >Change My Password</CustomButton
          >
          <CustomButton
            class="reset__form--buttons--cancel"
            theme="secondary"
            @click="handleProfile"
            >Cancel</CustomButton
          >
          <span
            class="reset__form--buttons--cancel--mobile button-1"
            @click="handleProfile"
            >Cancel</span
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import visibilityIcon from "@/assets/images/icons/visibility.svg";
import CustomInput from "../../components/Common/CustomInput";
import CustomButton from "../../components/Common/CustomButton";
export default {
  name: "ChangePasswordPage",
  components: {
    CustomInput,
    CustomButton,
  },
  middleware: ["auth"],
  data() {
    return {
      password: "",
      passwordRepeat: "",
      errorPassword: "",
      loading: false,
      sent: false,
      visibilityIcon,
    };
  },
  methods: {
    handleFocusPassword() {
      this.errorPassword = null;
    },
    handleFocusPasswordRepeat() {
      this.errorPassword = null;
    },
    handleProfile() {
      this.$router.push("/profile");
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
    validateRepeatPasswordField(password) {
      this.errorPassword = null;
      if (password !== this.password) {
        this.errorPassword = "Passwords must be same ";
        return false;
      }

      this.errorPassword = null;
      return true;
    },

    validateLogin() {
      let value = true;

      value &= this.validatePasswordField(this.password);
      value &= this.validateRepeatPasswordField(this.passwordRepeat);

      return value;
    },
    async submitReset() {
      if (!this.validateLogin()) return;
      this.loading = true;
      try {
        await this.$store.dispatch("user/changePassword", this.password);
        this.loading = false;
        this.sent = true;
        setTimeout(() => {
          window.scrollTo(0, 0);
        }, 0);
      } catch (e) {
        this.loading = false;
        this.errorPassword = e.data?.code;
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
.reset {
  h1 {
    margin-bottom: 3rem;
    @include layout-mobile() {
      margin-bottom: mvw(32px);
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
    a {
      font-size: 0.875rem;
      line-height: 1.5rem;
      cursor: pointer;
      font-weight: 600;
      margin-left: 0.25rem;
      border-bottom: 2px solid $primary-marigold;
      @include layout-mobile() {
        font-size: mvw(14px);
        line-height: mvw(24px);
        margin: 0;
        margin-top: mvw(12px);
      }
    }
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
        width: 13.9375rem;
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
    &--password {
      margin-bottom: 2rem;
      @include layout-mobile() {
        margin-bottom: mvw(32px);
      }
    }
    strong {
      color: #b00020;
      font-weight: 400;
    }
  }
}
</style>

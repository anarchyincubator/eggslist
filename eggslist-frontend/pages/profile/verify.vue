<template>
  <div class="page">
    <div class="page__header" @click="handleToProfile">
      <div class="page__header__button">
        <img src="@/assets/images/icons/arrow-forward.svg" />
      </div>
      <span>{{ send ? "Back to Profile" : "Profile" }}</span>
    </div>
    <transition name="fade">
      <div v-if="!send" class="page__content">
        <h1>Get verified</h1>
        <UploadPhoto
          v-model="file"
          title="Upload a farm photo."
          subtitle="Optimal size 1000x1000. Images will be cropped to a square"
        />
        <div class="page__content__subtitle">Tell us about your farm</div>
        <CustomTextarea v-model="description" />
        <div class="page__content__buttons">
          <CustomButton
            class="page__content__buttons--verified"
            :theme="theme"
            :is-loading="loading"
            @click="handleUpload"
            >Get verified</CustomButton
          >
          <CustomButton
            class="page__content__buttons--cancel"
            theme="secondary"
            @click="handleToProfile"
            >Cancel</CustomButton
          >
          <span
            class="page__content__buttons--cancel--mobile button-1"
            @click="handleToProfile"
            >Cancel</span
          >
        </div>
      </div>
      <div v-else class="page__content">
        <div class="page__content__thank">
          <h4>Thank you for submitting your information!</h4>
          <p class="body-2">
            We will review your information and will get back to you soon.
          </p>
          <CustomButton
            theme="primary"
            class="page__content__thank--button"
            @click="handleToProfile"
            >Got It!</CustomButton
          >
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import CustomTextarea from "../../components/Common/CustomTextarea";
import CustomButton from "../../components/Common/CustomButton";
import UploadPhoto from "../../components/Common/UploadPhoto";
export default {
  name: "VerifyPage",
  components: { UploadPhoto, CustomButton, CustomTextarea },
  middleware: ["auth"],
  data() {
    return {
      description: "",
      file: null,
      loading: false,
      send: false,
    };
  },
  computed: {
    theme() {
      return this.description ? "primary" : "disabled";
    },
  },
  methods: {
    handleToProfile() {
      this.$router.push("/profile");
    },
    async handleUpload() {
      this.loading = true;
      try {
        await this.$store.dispatch("auth/verifyUserVerify", {
          image: this.file,
          text: this.description,
        });
        window.scrollTo(0, 0);
        this.send = true;
        await this.$store.dispatch("user/getUserData");
      } catch (e) {}
      this.loading = false;
    },
  },
};
</script>

<style lang="scss" scoped>
.page {
  width: calc(100% + #{$padding-with-width} * 2);
  margin-left: calc(0rem - $padding-with-width);
  padding: 8rem $padding-with-width 8.6875rem $padding-with-width;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  flex-direction: column;
  background-color: $primary-white;
  @include layout-mobile() {
    width: calc(100% + #{$padding-left-mobile} * 2);
    margin-left: calc(0rem - $padding-left-mobile);
    padding: mvw(80px) $padding-left-mobile;
  }
  &__header {
    display: flex;
    margin-bottom: 3rem;
    align-items: center;
    margin-right: auto;
    cursor: pointer;
    &:hover {
      opacity: 0.8;
    }
    &__button {
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      width: 2rem;
      border: 1.5px solid $primary-marigold;
      border-radius: 50%;
      height: 2rem;
      img {
        width: 1rem;
        height: 1rem;
        transform: rotate(180deg);
        @include layout-mobile() {
          width: mvw(16px);
          height: mvw(16px);
        }
      }
      @include layout-mobile() {
        width: mvw(32px);
        height: mvw(32px);
      }
    }
    span {
      font-size: 1rem;
      line-height: 1.5rem;
      font-weight: 600;
      margin-left: 0.5rem;
      @include layout-mobile() {
        font-size: mvw(16px);
        line-height: mvw(24px);
        margin-left: mvw(8px);
      }
    }
    @include layout-mobile() {
      margin-bottom: mvw(38px);
    }
  }
  &__content {
    width: 39.375rem;
    @include layout-mobile() {
      width: 100%;
    }
    h1 {
      margin-bottom: 3rem;
      @include layout-mobile() {
        margin-bottom: mvw(32px);
      }
    }
    &__subtitle {
      font-size: 0.875rem;
      margin-top: 1.5rem;
      @include layout-mobile() {
        margin-top: mvw(48px);
        font-size: mvw(14px);
      }
    }
    &__buttons {
      display: flex;
      margin-top: 3rem;
      @include layout-mobile() {
        flex-direction: column;
        align-items: center;
      }
      &--verified {
        margin-right: 1.5rem;
        width: 9.75rem;
        @include layout-mobile() {
          width: 100%;
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
    &__thank {
      padding: 3rem 2rem;
      background: #f2e2ca;
      border-radius: 0.75rem;
      display: flex;
      flex-direction: column;
      align-items: center;
      .body-2 {
        margin: 1rem 0;
      }
      @include layout-mobile() {
        text-align: center;
      }
      &--button {
        @include layout-mobile() {
          padding: 0;
          padding: mvw(32px) mvw(20px);
          margin-top: mvw(16px);
        }
      }
    }
  }
}
</style>

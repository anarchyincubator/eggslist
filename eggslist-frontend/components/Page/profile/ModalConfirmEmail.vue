<template>
  <ModalSimple ref="modal">
    <div class="modal">
      <h2>Confirm your email</h2>
      <span class="body-1">
        Confirm your email to access full Eggslist functionality.
      </span>
      <CustomButton
        v-if="!sendVerify"
        class="modal__button"
        theme="primary"
        :is-loading="loadingButton"
        @click="handleResendEmail"
      >
        Resend email</CustomButton
      >
    </div>
  </ModalSimple>
</template>

<script>
import CustomButton from "../../Common/CustomButton";
import ModalSimple from "../../Common/ModalSimple";
export default {
  name: "ModalConfirmEmail",
  components: { ModalSimple, CustomButton },
  emits: ["send"],
  data() {
    return {
      loadingButton: false,
      sendVerify: false,
    };
  },
  methods: {
    show() {
      this.$refs.modal.show();
    },
    handleHide() {
      this.$refs.modal.hide();
    },
    async handleResendEmail() {
      this.loadingButton = true;
      try {
        await this.$store.dispatch("auth/sendEmailVerify");
        this.loadingButton = false;
        this.sendVerify = true;
      } catch (e) {
        this.loadingButton = false;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.modal {
  display: flex;
  color: $primary-black;
  flex-direction: column;
  justify-content: center;
  text-align: center;
  &__button {
    width: 100%;
    @include layout-mobile() {
      padding-left: 0;
      padding-right: 0;
    }
  }
  span {
    margin-top: 1rem;
    margin-bottom: 2rem;
  }
}
</style>

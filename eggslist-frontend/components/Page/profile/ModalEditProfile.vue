<template>
  <ModalSimple ref="modal">
    <div class="modal">
      <h2>Do you want to start selling?</h2>
      <span class="body-1"> Add your contact info and location! </span>
      <CustomButton
        class="modal__button"
        theme="primary"
        @click="handleGoToEdit"
      >
        Edit profile</CustomButton
      >
    </div>
  </ModalSimple>
</template>

<script>
import CustomButton from "../../Common/CustomButton";
import ModalSimple from "../../Common/ModalSimple";
export default {
  name: "ModalEditProfile",
  components: { ModalSimple, CustomButton },
  emits: ["send"],
  data() {
    return {};
  },
  methods: {
    show() {
      this.$refs.modal.show();
    },
    handleHide() {
      this.$refs.modal.hide();
    },
    handleGoToEdit() {
      this.$router.push("/profile/edit");
      this.handleHide();
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
  }
  span {
    margin-top: 1rem;
    margin-bottom: 2rem;
  }
}
</style>

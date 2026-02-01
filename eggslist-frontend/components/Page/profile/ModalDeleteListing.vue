<template>
  <ModalSimple ref="modal">
    <div class="modal">
      <h2>Delete This Product?</h2>
      <span> This action is irreversible. </span>
      <div class="modal__buttons">
        <CustomButton
          class="modal__buttons__cancel"
          theme="secondary"
          @click="handleHide"
        >
          Cancel</CustomButton
        >
        <CustomButton
          class="modal__buttons__delete"
          :is-loading="loading"
          theme="danger"
          @click="handleDelete"
        >
          Delete</CustomButton
        >
      </div>
    </div>
  </ModalSimple>
</template>

<script>
import CustomButton from "../../Common/CustomButton";
import ModalSimple from "../../Common/ModalSimple";
export default {
  name: "ModalDeleteListing",
  components: { ModalSimple, CustomButton },
  emits: ["delete"],
  data() {
    return {
      currentItem: {},
      loading: false,
    };
  },
  methods: {
    show(item) {
      this.$refs.modal.show();
      this.currentItem = item;
    },
    handleHide() {
      this.$refs.modal.hide();
    },
    async handleDelete() {
      this.loading = true;
      try {
        await this.$store.dispatch(
          "products/deleteProduct",
          this.currentItem.slug
        );
        this.handleHide();
        this.$emit("delete");
      } catch (e) {}
      this.loading = false;
    },
  },
};
</script>

<style lang="scss" scoped>
.modal {
  display: flex;
  flex-direction: column;
  justify-content: center;
  text-align: center;
  &__buttons {
    display: flex;
    &__cancel,
    &__delete {
      width: 12.5625rem;
      @include layout-mobile() {
        width: 100%;
      }
    }
    &__cancel {
      margin-right: auto;
      @include layout-mobile() {
        display: none;
      }
    }
  }
  span {
    margin-top: 1rem;
    margin-bottom: 2rem;
  }
}
</style>

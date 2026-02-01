<template>
  <ModalSimple
    ref="modal"
    :is-cancel="false"
    back-color="#FEF3E1"
    class="modal"
  >
    <div class="modal__container">
      <h2>Attempting Buying Your Own Product</h2>
      <div class="body-1">Sorry, you can't buy your Product.</div>
      <div class="modal__buttons">
        <CustomButton
          class="modal__button"
          theme="primary"
          :is-loading="loading"
          @click="handleHide"
        >
          Got it</CustomButton
        >
      </div>
    </div>
  </ModalSimple>
</template>

<script>
import CustomButton from "../../Common/CustomButton";
import ModalSimple from "../../Common/ModalSimple";

export default {
  name: "ModalSameId",
  components: { ModalSimple, CustomButton },
  props: {},
  data() {
    return {
      loading: false,
    };
  },
  methods: {
    show() {
      this.$refs.modal.show();
    },
    handleHide() {
      this.$refs.modal.hide();
    },
    async handleConfirm() {},
  },
};
</script>

<style lang="scss" scoped>
.modal {
  width: 100%;
  .body-1 {
    margin-top: 1rem;
    margin-bottom: 2rem;
  }
  &__container {
    width: 100%;
    display: flex;
    color: $primary-black;
    flex-direction: column;
    justify-content: center;
    text-align: center;
    @include layout-mobile() {
      margin-top: mvw(-32px);
    }
    h2 {
      text-align: center;
    }
  }
  &__button {
    width: 100%;
    padding-left: 0;
    padding-right: 0;
  }
  span {
    margin-top: 1rem;
    margin-bottom: 2rem;
  }
  &__buttons {
    display: flex;
    @include layout-mobile() {
      flex-direction: column-reverse;
    }
  }
}
.icon {
  position: absolute;
  left: 0.8125rem;
  width: 0.75rem;
  z-index: 5;
  top: 50%;
  transform: translateY(-50%);
  @include layout-mobile() {
    width: mvw(18px);
    left: mvw(18px);
  }
}
</style>

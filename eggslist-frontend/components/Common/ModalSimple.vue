<template>
  <transition name="fade">
    <div v-if="isShow" v-scroll-lock="isShow" class="modal">
      <div class="modal__background"></div>
      <div
        v-click-outside="handleClose"
        class="modal-profile"
        :style="{ 'background-color': backColor }"
      >
        <div class="modal-profile__close" @click="handleClose">
          <img :src="closeIcon" />
        </div>
        <div class="modal-profile__header">
          <slot></slot>
        </div>
        <span
          v-if="isCancel"
          class="modal-profile__cancel button-1"
          @click="handleClose"
          >Cancel</span
        >
      </div>
    </div>
  </transition>
</template>

<script>
import close from "@/assets/images/icons/close.svg";
import closeDark from "@/assets/images/icons/close_dark.svg";
export default {
  name: "ModalSimple",
  props: {
    backColor: {
      default: "#FBECD5",
      type: String,
    },
    isCancel: {
      default: true,
      type: Boolean,
    },
  },
  data() {
    return {
      isShow: false,
    };
  },
  computed: {
    isMobile() {
      return this.$store.getters["isMobile"];
    },
    closeIcon() {
      return this.isMobile ? closeDark : close;
    },
  },
  methods: {
    show() {
      this.isShow = true;
    },
    handleClose() {
      this.isShow = false;
    },
    hide() {
      this.handleClose();
    },
  },
};
</script>

<style lang="scss" scoped>
.modal {
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1000;
  &__background {
    position: absolute;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.8);
    @include layout-mobile() {
      background-image: url("@/assets/images/noise.jpg");
      background-size: 290%;
    }
  }
  &-profile {
    width: 32.8125rem;
    background-color: $primary-cream;
    border-radius: 0.75rem;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    padding: 3rem;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    align-items: center;
    @include layout-mobile() {
      border-radius: 0;
      width: 100%;
      justify-content: center;
      height: 100%;
      padding: mvw(32px) mvw(24px);
    }

    &__close {
      width: 2rem;
      height: 2rem;
      position: absolute;
      cursor: pointer;
      right: -5rem;
      top: 1rem;
      @include layout-mobile() {
        right: mvw(16px);
        top: mvw(24px);
        width: mvw(32px);
        height: mvw(32px);
      }

      img {
        width: 0.875rem;
        @include layout-mobile() {
          width: mvw(20px);
        }
      }
    }
    &__cancel {
      display: none;
      @include layout-mobile() {
        display: flex;
        border-bottom: 2px solid $primary-marigold;
      }
    }

    &__header {
      display: flex;
      width: 100%;
      align-items: center;
      flex-direction: column;
      @include layout-mobile() {
        margin-bottom: mvw(16px);
      }
    }
  }
}
</style>

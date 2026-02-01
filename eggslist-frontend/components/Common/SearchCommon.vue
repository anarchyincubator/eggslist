<template>
  <div class="input-container">
    <input
      ref="input"
      v-model="inputData"
      class="input-container__input subtitle-1"
      :placeholder="placeholder"
      @focusout="$emit('focusout')"
      @focus="handleEmit"
      @keyup.enter="$emit('enter')"
    />
    <div class="input-container__icon" @click="$emit('enter')">
      <img src="@/assets/images/icons/search.svg" />
    </div>
  </div>
</template>

<script>
export default {
  name: "SearchCommon",
  props: {
    value: {
      type: null,
      default: "",
    },
    placeholder: {
      type: String,
      default: "",
    },
  },
  computed: {
    inputData: {
      get() {
        return this.value;
      },
      set(value) {
        this.$emit("input", value);
      },
    },
  },
  methods: {
    handleEmit() {
      this.$emit("focus");
    },
  },
};
</script>

<style lang="scss" scoped>
.input-container {
  position: relative;
  width: 100%;
  &__label {
    font-size: 0.875rem;
    line-height: 1.5rem;
    color: $primary-black;

    @include layout-mobile() {
      font-size: mvw(14px);
      line-height: mvw(24px);
    }
  }
  &__main {
    position: relative;
  }
  &__input {
    width: 100%;
    border: 1.5px solid #d5bb91;
    border-radius: 0.75rem;
    opacity: 1;
    height: 3rem;
    padding: 0.625rem 3rem;
    background: $primary-white;
    color: $primary-black;
    box-sizing: border-box;
    @include layout-mobile() {
      border-radius: mvw(12px);
      padding: mvw(15px) 0 mvw(15px) mvw(30px);
      border: 1px solid #d5bb91;
      height: mvw(48px);
    }
    &--default {
      padding: 0.625rem;
      @include layout-mobile() {
        padding: mvw(10px) mvw(10px);
      }
    }
    &--error {
      border: 1.5px solid $error;
      @include layout-mobile() {
        border: 1px solid $error;
      }
    }
    &--lock {
      cursor: not-allowed;
      pointer-events: none;
      background-color: #faf2e6;
      border: 1.5px solid grey;
    }
    &::placeholder {
      color: #605139;
    }

    &:focus {
      outline: 0 !important;
      outline-offset: 0 !important;
      background: $primary-white;
      border: 1.5px solid $primary-marigold;
      @include layout-mobile() {
        border: 1px solid $primary-marigold;
      }
      & + label {
        opacity: 0;
      }
    }
  }
  &--small {
    .input-container__input {
      @include layout-mobile() {
        padding: mvw(12px) 0 mvw(12px) mvw(47px);
      }
    }
  }
  &__error {
    position: absolute;
    bottom: -1.5rem;
    left: 0.875rem;
    color: #b00020;
    font-size: 0.75rem;
    @include layout-mobile() {
      top: mvw(80px);
      left: mvw(14px);
      font-size: mvw(10px);
    }
  }
  &__icon {
    position: absolute;
    left: 1.25rem;
    top: 50%;
    transform: translateY(-50%);
    cursor: pointer;
    display: flex;
    &--error {
      cursor: default;
      animation: shake 0.82s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
    }
    img {
      width: 1.25rem;
      @include layout-mobile() {
        width: mvw(12px);
      }
    }
    @include layout-mobile() {
      left: mvw(10px);
    }
  }
}
</style>

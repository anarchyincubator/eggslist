<template>
  <div class="textarea-main">
    <div class="label">
      <slot name="label"> </slot>
    </div>
    <textarea
      v-model="inputData"
      :placeholder="placeholder"
      :class="[
        'textarea',
        {
          'textarea--error': isInValid,
        },
      ]"
      @focus="handle"
    ></textarea>
    <div v-if="isInValid" class="textarea-main__error">
      {{ errorText || "Field is required" }}
    </div>
  </div>
</template>

<script>
export default {
  name: "CustomTextarea",
  props: {
    value: {
      type: null,
      default: "",
    },
    placeholder: {
      type: String,
      default: "Lorem ipsum dolor sit amet.",
    },
    errorText: {
      type: String,
      default: "",
    },
    isInValid: {
      type: Boolean,
      default: false,
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
    handle() {
      this.$emit("focus");
    },
  },
};
</script>

<style lang="scss" scoped>
.textarea-main {
  width: 100%;
  position: relative;
  &__error {
    position: absolute;
    bottom: -1.5rem;
    left: 0.875rem;
    color: #b00020;
    font-size: 0.75rem;
    @include layout-mobile() {
      bottom: mvw(-20px);
      left: mvw(14px);
      font-size: mvw(10px);
    }
  }
}
.textarea {
  border: 1px solid $primary-white;
  border-radius: 0.75rem;
  padding: 0.75rem;
  width: 100% !important;
  height: 15rem;
  box-sizing: border-box;
  color: $primary-black;
  border: 1.5px solid $neutral-70;
  background-color: $primary-white;
  resize: none;
  @include layout-mobile() {
    font-size: mvw(16px);
    height: mvw(240px);
  }
  &:focus {
    outline: 0 !important;
    outline-offset: 0 !important;
    background: $primary-white;
    border: 1.5px solid $primary-marigold;
  }
  &--error {
    border: 1.5px solid $error;
  }

  &::placeholder {
    color: $neutral-45;
    @include layout-mobile() {
      font-size: mvw(14px);
    }
  }
}
.label {
  font-size: 0.875rem;
  line-height: 1.5rem;
  color: $primary-black;
  @include layout-mobile() {
    font-size: mvw(14px);
    line-height: mvw(24px);
  }
}
</style>

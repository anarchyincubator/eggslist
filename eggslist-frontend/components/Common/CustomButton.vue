<template>
  <component
    :is="type"
    :class="classes"
    :tabindex="tabIndex"
    @click="handleClick"
  >
    <span class="button__text">
      <span v-if="isLoading" class="button__loader" />
      <slot v-else />
    </span>
    <slot name="add"></slot>
  </component>
</template>

<script>
export default {
  name: "CustomButton",
  props: {
    isDisabled: {
      type: Boolean,
      default: false,
    },
    tabIndex: {
      type: String,
      default: "-1",
    },
    theme: {
      type: String,
      required: true,
      validator(value) {
        return [
          "primary",
          "secondary",
          "outlined",
          "danger",
          "disabled",
        ].includes(value);
      },
    },
    isLoading: {
      type: Boolean,
      default: false,
    },
    isLarge: {
      type: Boolean,
      default: true,
    },
  },
  emits: ["click"],
  computed: {
    type() {
      if (this.href) return "a";

      if (this.to) return "router-link";

      return "button";
    },
    classes() {
      return [
        "button",
        `button-${this.theme}`,
        {
          "button-small": !this.isLarge,
        },
        {
          "button-disabled": this.isDisabled || this.isLoading,
        },
      ];
    },
  },
  methods: {
    handleClick(event) {
      if (this.isDisabled) return;

      this.$emit("click", event);
    },
  },
};
</script>

<style lang="scss" scoped>
.button {
  cursor: pointer;
  background: none;
  border: none;
  padding: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: background 0.75s;

  &__loader {
    display: inline-block;
    width: 0.875rem;

    @include layout-mobile() {
      width: mvw(14px);
    }
  }

  &__loader:after {
    content: " ";
    display: block;
    width: 1.125rem;
    height: 1.125rem;
    border-radius: 50%;
    border: 0.1875rem solid #fff;
    border-color: #fff transparent #fff transparent;
    animation: loader-animation 1.2s linear infinite;

    @include layout-mobile() {
      width: mvw(18px);
      height: mvw(18px);
      border-width: mvw(3px);
    }
  }

  &-primary,
  &-secondary,
  &-outlined,
  &-danger,
  &-disabled {
    display: flex;
    justify-content: center;
    padding: 0.9375rem 1.25rem;
    background: $primary-marigold;
    border: 1.5px solid #282220;
    border-radius: 0.75rem;
    font-weight: 600;
    text-align: center;
    font-size: 1rem;

    @include layout-mobile() {
      font-size: mvw(16px);
      width: 100%;
      height: mvw(56px);
      border-radius: mvw(12px);
      padding: mvw(16px) mvw(90px);
    }

    &:hover {
      background: $secondary-marigold;
    }

    .button__text {
      text-align: center;
      display: flex;
      color: $primary-black;
    }
  }
  &-small {
    font-size: 0.875rem;
    line-height: 1rem;
    padding: 0.625rem 1.25rem;
    @include layout-mobile() {
      font-size: mvw(14px);
      line-height: mvw(16px);
    }
  }
  &-secondary {
    background: transparent;
    border: 1.5px solid $primary-marigold;
  }
  &-danger {
    background-color: #b00020;
    border: 1.5px solid $primary-black;
    &:hover {
      background: #b00020;
      opacity: 0.9;
    }
  }
  &-outlined {
    background: transparent;
    border: 0.0625rem solid #fef6f4;
  }
  &-disabled {
    pointer-events: none;
    cursor: not-allowed;
    background: $primary-marigold-dark;
  }
}
@keyframes loader-animation {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>

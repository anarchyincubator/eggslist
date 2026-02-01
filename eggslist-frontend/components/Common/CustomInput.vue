<template>
  <div :class="classes">
    <div class="input-container__label">
      <slot name="label"> </slot>
    </div>
    <slot></slot>
    <div class="input-container__main">
      <currency-input
        v-if="type === 'number'"
        v-model="inputData"
        :placeholder="placeholder"
        class="input-container__input subtitle-1"
        :class="{
          'input-container__input--default': paddingDefault,
          'input-container__input--error': isInValid,
        }"
        min="0"
        currency="USD"
        locale="en"
        @focusout="$emit('focusout')"
        @focus="handleEmit"
        @keyup.enter="$emit('enter')"
      />
      <input
        v-else-if="!mask"
        ref="input"
        :autocomplete="Boolean(name) ? 'on' : 'off'"
        :name="name"
        :type="type"
        min="0"
        class="input-container__input subtitle-1"
        :class="{
          'input-container__input--default': paddingDefault,
          'input-container__input--error': isInValid,
          'input-container__input--lock': isLock,
        }"
        :value="inputData"
        :disabled="isLock"
        :placeholder="placeholder"
        @input="inputData = $event.target.value"
        @focusout="$emit('focusout')"
        @focus="handleEmit"
        @keyup.enter="$emit('enter')"
      />
      <input
        v-else
        ref="input"
        v-model="inputData"
        v-mask="mask"
        type="tel"
        min="0"
        class="input-container__input subtitle-1"
        :class="{
          'input-container__input--default': paddingDefault,
          'input-container__input--error': isInValid,
          'input-container__input--lock': isLock,
        }"
        :disabled="isLock"
        :placeholder="placeholder"
        @focusout="$emit('focusout')"
        @focus="handleEmit"
        @keyup.enter="$emit('enter')"
      />
      <div
        v-if="icon || isInValid"
        class="input-container__icon"
        :style="styleIcon"
        :class="{ 'input-container__icon--error': isInValid }"
        @click="$emit('clickIcon')"
      >
        <img :src="additiveIcon" />
      </div>
    </div>
    <div v-if="isInValid" class="input-container__error">
      {{ errorText || "Field is required" }}
    </div>
  </div>
</template>

<script>
import errorIcon from "@/assets/images/icons/error.svg";
export default {
  name: "CustomInput",
  props: {
    value: {
      type: null,
      default: "",
    },
    paddingDefault: {
      type: Boolean,
      default: true,
    },
    placeholder: {
      type: String,
      default: "",
    },
    type: {
      type: String,
      default: "text",
    },
    icon: {
      type: String,
      default: "",
    },
    styleIcon: {
      type: Object,
      default: () => {
        return {};
      },
    },
    isInValid: {
      type: Boolean,
      default: false,
    },
    isLock: {
      type: Boolean,
      default: false,
    },
    mask: {
      type: String,
      default: "",
    },
    errorText: {
      type: String,
      default: "",
    },
    name: {
      type: String,
      default: "",
    },
    isSmall: {
      type: Boolean,
      default: false,
    },
  },
  emits: ["clickIcon", "enter", "focusout", "input"],
  computed: {
    inputData: {
      get() {
        return this.value;
      },
      set(value) {
        this.$emit("input", value);
      },
    },
    additiveIcon() {
      return this.isInValid ? errorIcon : this.icon;
    },
    classes() {
      return [
        "input-container",
        {
          "input-container--small": this.isSmall,
        },
      ];
    },
  },
  methods: {
    handleEmit() {
      setTimeout(() => {
        if (this.type === "number") return;

        this.$refs.input.selectionStart = 10000;
        this.$refs.input.selectionEnd = 10000;
      }, 0);
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
    padding: 0.625rem 2rem;
    background: $primary-white;
    color: $primary-black;
    box-sizing: border-box;
    @include layout-mobile() {
      border-radius: mvw(12px);
      padding: mvw(15px) 0 mvw(15px) mvw(47px);
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
    right: 1.25rem;
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
        width: mvw(20px);
      }
    }
    @include layout-mobile() {
      right: mvw(20px);
    }
  }
}
@keyframes shake {
  10%,
  90% {
    transform: translate(-1px, -50%);
  }

  20%,
  80% {
    transform: translate(2px, -50%);
  }

  30%,
  50%,
  70% {
    transform: translate(-2px, -50%);
  }

  40%,
  60% {
    transform: translate(2px, -50%);
  }
}
</style>

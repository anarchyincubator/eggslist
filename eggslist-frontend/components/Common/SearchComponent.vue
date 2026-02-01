<template>
  <div :class="classes">
    <div class="search-container__label">
      <slot name="label"> </slot>
    </div>
    <div v-click-outside="handleClose" class="search-container__div">
      <CustomInput
        v-model="inputData"
        :placeholder="placeholder"
        :padding-default="isPadding"
        :is-small="isSmall"
        :is-lock="isLock"
        :is-in-valid="Boolean(isInValid)"
        :error-text="errorText"
        @focus="handleFocus"
        @focusout="handleFocusOut"
      >
        <slot class="search-container__icon" name="icon"></slot>
      </CustomInput>

      <div
        v-if="isOpened && result && result.length !== 0"
        class="search-container__results"
      >
        <div
          v-for="(ceil, index) in result"
          :key="index"
          class="search-container__results--ceil subtitle-1"
          @click="handleClickCeil(ceil)"
        >
          {{ ceil.name }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import CustomInput from "@/components/Common/CustomInput.vue";
export default {
  name: "SearchComponent",
  components: {
    CustomInput,
  },
  props: {
    value: {
      type: String,
      required: true,
    },
    result: {
      type: Array,
      default: () => [],
    },
    placeholder: {
      type: String,
      default: "",
    },
    noText: {
      type: String,
      default: "",
    },
    isSmall: {
      type: Boolean,
      default: false,
    },
    errorText: {
      type: String,
      default: "",
    },
    isInValid: {
      type: Boolean,
      default: false,
    },
    isPadding: {
      type: Boolean,
      default: false,
    },
    isLock: {
      type: Boolean,
      default: false,
    },
  },
  emits: ["setupCity", "input", "changeInput", "focusout"],

  data() {
    return {
      isOpened: false,
      isFocus: false,
      inputData: "",
    };
  },
  computed: {
    searchValue: {
      get() {
        return this.value;
      },
      set(value) {
        this.$emit("input", value);
      },
    },
    classes() {
      return [
        "search-container",
        {
          "search-container--small": this.isSmall,
        },
      ];
    },
  },
  watch: {
    result: {
      handler(ne, ol) {
        if (this.isFocus) this.isOpened = true;
      },
      deep: true,
    },
    inputData(val) {
      if (this.searchValue === val) return;

      this.$emit("changeInput", val);
    },
    searchValue(val) {
      if (val === this.inputData) return;

      this.inputData = val;
    },
  },
  mounted() {
    this.inputData = this.searchValue;
  },
  methods: {
    handleFocus() {
      this.isFocus = true;

      if (this.result?.length > 0) this.isOpened = true;
    },
    handleFocusOut() {
      this.isFocus = false;
      this.$emit("focusout");
    },
    handleClose() {
      this.isOpened = false;
    },
    handleClickCeil(ceil) {
      this.searchValue = ceil.name;
      this.inputData = ceil.name;
      this.$emit("setupCity", ceil);
      this.isOpened = false;
    },
  },
};
</script>

<style lang="scss" scoped>
.search-container {
  width: 100%;
  position: relative;
  &__label {
    font-size: 0.875rem;
    line-height: 1.5rem;
    color: $primary-black;
    @include layout-mobile() {
      font-size: mvw(14px);
      line-height: mvw(24px);
    }
  }
  &__div {
    width: 100%;
  }
  &__results {
    z-index: 30;
    width: 100%;
    height: 11rem;
    top: calc(100% + 0.5rem);
    position: absolute;
    background: $primary-white;
    box-shadow: 0px 0px 0.625rem rgba(0, 0, 0, 0.1);
    border-radius: 0.125rem;
    overflow: scroll;
    &--ceil {
      width: 100%;
      min-height: 2.5rem;
      padding: 0.5rem 0.75rem;
      box-sizing: border-box;
      transition: 0.25s background-color;
      cursor: pointer;

      &:hover {
        background-color: #d5bb91;
      }
      @include layout-mobile() {
        min-height: mvw(40px);
        padding: mvw(8px) mvw(12px);
      }
    }
    @include layout-mobile() {
      height: mvw(176px);
    }
  }
}
</style>

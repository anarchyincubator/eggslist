<template>
  <div class="dropdown">
    <div class="label">
      <slot name="label"> </slot>
    </div>
    <div
      v-click-outside="handleClose"
      :class="[
        'dropdown__main',
        { 'dropdown__main--select': isSelect },
        { 'dropdown__main--lock': isLock },
        { 'dropdown__main--error': isInValid },
      ]"
    >
      <div
        :class="[
          'dropdown__content',
          { 'dropdown__content--select': isSelect },
        ]"
        @click="handleSelect"
      >
        <span>{{ placeholderValue }}</span>
        <img src="@/assets/images/icons/drop-down-dark.svg" />
      </div>
      <transition name="fade">
        <div v-if="isSelect" v-scroll-lock="true" class="dropdown__select">
          <div
            v-for="(item, index) in selects"
            :key="index"
            :class="[
              'dropdown__select__item',
              { 'dropdown__select__item--active': selectedIndex === index },
            ]"
            @click="handleSelectValue(index)"
          >
            {{ item.value }}
            <img
              v-if="selectedIndex === index"
              src="@/assets/images/icons/check.svg"
            />
          </div>
        </div>
      </transition>
    </div>
    <div v-if="isInValid" class="dropdown__error">
      {{ errorText || "Field is required" }}
    </div>
  </div>
</template>

<script>
export default {
  name: "CustomDropdown",
  props: {
    placeholder: {
      type: String,
      default: "Select item",
    },
    selects: {
      type: Array,
      required: true,
    },
    isLock: {
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
    value: {
      type: Object,
    },
  },
  data() {
    return {
      isSelect: false,
      selectedIndex: -1,
    };
  },
  computed: {
    placeholderValue() {
      return this.selectedValue ? this.selectedValue.value : this.placeholder;
    },
    selectedValue: {
      get() {
        return this.value;
      },
      set(value) {
        this.$emit("input", { ...value });
      },
    },
  },
  watch: {
    value: {
      handler(n) {
        this.handleSetValue(n);
      },
      deep: true,
    },
  },
  mounted() {
    this.handleSetValue(this.value);
  },
  methods: {
    handleClose() {
      this.isSelect = false;
    },
    handleSetValue(value) {
      if (!value) return;

      let ind = this.selects.findIndex(({ key }) => key === this.value.key);

      if (ind === this.selectedIndex) return;

      this.selectedIndex = ind;
    },
    handleSelectValue(index) {
      this.selectedIndex = index;
      this.selectedValue = { ...this.selects[this.selectedIndex] };
      this.isSelect = false;
    },
    handleSelect() {
      this.$emit("focus");
      this.isSelect = !this.isSelect;
    },
  },
};
</script>

<style lang="scss" scoped>
.dropdown {
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
  &__main {
    border-radius: 0.75rem;
    border: 1.5px solid $neutral-70;
    box-sizing: border-box;
    display: flex;
    height: 3rem;
    align-items: center;
    position: relative;
    cursor: pointer;
    transition: 0.5s all;
    @include layout-mobile() {
      height: mvw(48px);
      border-radius: mvw(12px);
    }
    &--select {
      border: 1.5px solid $primary-marigold;
    }
    &--lock {
      cursor: not-allowed;
      pointer-events: none;
      background-color: #faf2e6;
      border: 1.5px solid grey;
    }
    &--error {
      border: 1.5px solid $error;
    }
  }
  &__content {
    width: 100%;
    display: flex;
    height: 100%;
    box-sizing: border-box;
    padding: 0.625rem;
    align-items: center;
    cursor: pointer;
    @include layout-mobile() {
      font-size: mvw(16px);
      line-height: mvw(24px);
      padding: mvw(12px);
    }
    img {
      width: 0.625rem;
      margin-left: auto;
      margin-right: 0.25rem;
      transition: 0.5s transform;
      @include layout-mobile() {
        width: mvw(10px);
      }
    }
    &--select {
      img {
        transform: rotate(180deg);
      }
    }
  }
  &__select {
    position: absolute;
    z-index: 11;
    width: 100%;
    overflow-x: hidden;
    background: $primary-white;
    box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
    border-radius: 0.125rem;
    box-sizing: border-box;
    padding: 0;
    height: 11rem;
    overflow-y: scroll;
    bottom: -12rem;
    left: 0;
    @include layout-mobile() {
      height: mvw(176px);
      bottom: mvw(-192px);
      border-radius: mvw(2px);
    }
    &__item {
      display: flex;
      align-items: center;
      width: 100%;
      line-height: 1.5rem;
      padding: 0.5rem 0.75rem;
      cursor: pointer;
      box-sizing: border-box;
      border: 0;
      font-size: 1rem;
      @include layout-mobile() {
        padding: mvw(8px) mvw(12px);
        line-height: mvw(24px);
        font-size: mvw(16px);
      }
      &:first-child {
        padding-top: 1rem;
        @include layout-mobile() {
          padding-top: mvw(16px);
        }
      }
      &:last-child {
        padding-bottom: 1rem;
        @include layout-mobile() {
          padding-bottom: mvw(16px);
        }
      }
      img {
        width: 1rem;
        margin-left: auto;
        margin-right: 0.25rem;
        @include layout-mobile() {
          width: mvw(16px);
          margin-right: mvw(4px);
        }
      }
      &--active {
        background: #f2e2ca;
      }
      &:hover {
        background: #f2e2ca;
      }
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

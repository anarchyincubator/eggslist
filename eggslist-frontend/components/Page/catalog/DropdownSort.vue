<template>
  <div v-click-outside="handleClose" class="dropdown" @click="handleClickOpen">
    <div
      class="dropdown__main"
      :class="[{ 'dropdown__main--opened': isOpened }]"
    >
      <span> Sort: By {{ option.name }}</span>
      <img src="@/assets/images/icons/arrow-up.svg" />
    </div>
    <div v-if="isOpened" class="dropdown__opened">
      <div
        v-for="(variant, index) in variants"
        :key="index"
        class="dropdown__opened--item"
        :class="{
          'dropdown__opened--item--select': variant.key === selectedObj,
        }"
        @click="handleSelect(variant)"
      >
        {{ variant.name }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "DropdownSort",
  props: {
    value: {
      type: String,
      required: true,
    },
    variants: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      isOpened: false,
    };
  },
  computed: {
    selectedObj: {
      get() {
        return this.value;
      },
      set(val) {
        this.$emit("input", val);
      },
    },
    option() {
      return this.variants.find(({ key }) => this.selectedObj === key);
    },
  },
  methods: {
    handleClickOpen() {
      this.isOpened = !this.isOpened;
    },
    handleSelect(val) {
      this.selectedObj = val.key;
    },
    handleClose() {
      this.isOpened = false;
    },
  },
};
</script>

<style lang="scss" scoped>
.dropdown {
  cursor: pointer;
  position: relative;
  &__main {
    display: flex;
    align-items: center;
    span {
      font-size: 1rem;
      line-height: 1.5rem;
      @include layout-mobile() {
        font-size: mvw(16px);
        line-height: mvw(24px);
      }
    }
    img {
      width: 0.75rem;
      margin-left: 0.625rem;
      transform: rotate(180deg);
      transition: 0.25s transform;
      @include layout-mobile() {
        width: mvw(12px);
        margin-left: mvw(10px);
      }
    }
    &--opened {
      img {
        transform: rotate(0deg);
      }
    }
  }

  &__opened {
    position: absolute;
    top: calc(100% + 0.5rem);
    width: 100%;
    z-index: 40;
    &--item {
      width: 100%;
      display: flex;
      align-items: center;
      padding-left: 0.75rem;
      height: 2.5rem;
      background-color: $primary-white;
      font-size: 1rem;
      line-height: 1.5rem;
      @include layout-mobile() {
        font-size: mvw(12px);
        line-height: mvw(24px);
        padding-left: mvw(12px);
        height: mvw(30px);
      }

      &:hover {
        background-color: #f2e2ca;
      }
      &--select {
        background-color: #f2e2ca;
      }
    }
  }
}
</style>

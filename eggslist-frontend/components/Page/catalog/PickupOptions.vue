<template>
  <div class="pickup-container">
    <div
      :class="{ 'pickup-container__header--select': isSelect }"
      class="pickup-container__header"
    >
      <img
        v-if="isSelect"
        class="pickup-container__icon"
        src="@/assets/images/icons/check.svg"
      />
      <p>{{ pickup.name }}</p>
      <div
        class="pickup-container__header--arrow"
        :class="{ 'pickup-container__header--arrow--down': !isOpened }"
        @click="handleClickButton"
      >
        <img src="@/assets/images/icons/arrow-up.svg" />
      </div>
    </div>
    <div v-if="isOpened" class="pickup-container__main">
      <CustomCheckbox
        v-for="(opt, index) in pickup.options"
        :key="index"
        v-model="selectedData[index]"
        theme="dark"
        class="pickup-container__main--checkbox"
        @input="handleChangeValue"
      >
        {{ opt }}
      </CustomCheckbox>
    </div>
  </div>
</template>

<script>
import CustomCheckbox from "../../Common/CustomCheckbox";
export default {
  name: "PickupOptions",
  components: { CustomCheckbox },
  props: {
    value: {
      type: Array,
      required: true,
    },
    pickup: {
      type: Object,
      required: true,
    },
    openStart: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      check: false,
      isOpened: false,
    };
  },
  computed: {
    isSelect() {
      return this.selectedData.filter((item) => item).length > 0;
    },
    selectedData: {
      get() {
        return this.value;
      },
      set(value) {
        this.$emit("input", value);
      },
    },
  },
  watch: {
    openStart(val) {
      if (val && this.isSelect) {
        this.isOpened = true;
      }
    },
  },
  methods: {
    handleClickButton() {
      this.isOpened = !this.isOpened;
    },
    handleChangeValue() {
      this.$emit("input", this.selectedData);
    },
  },
};
</script>

<style lang="scss" scoped>
.pickup-container {
  width: 100%;

  &__icon {
    position: absolute;
    width: 0.6875rem;
    top: 50%;
    transform: translateY(-50%);
    left: -1rem;
    @include layout-mobile() {
      width: mvw(11px);
      left: mvw(-16px);
    }
  }
  &__header {
    display: flex;
    position: relative;
    align-items: center;
    justify-content: space-between;
    p {
      font-size: 1rem;
      line-height: 1.5rem;
      color: $neutral-30;
      font-weight: 500;
      @include layout-mobile() {
        font-size: mvw(16px);
        line-height: mvw(24px);
      }
    }
    &--select {
      p {
        color: $primary-black;
      }
    }
    &--arrow {
      cursor: pointer;
      width: 2rem;
      height: 2rem;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 1px solid $neutral-70;

      @include layout-mobile() {
        width: mvw(32px);
        height: mvw(32px);
        border: none;
      }
      &:hover {
        opacity: 0.8;
      }
      img {
        width: 0.625rem;
        transition: transform 0.5s;
        @include layout-mobile() {
          width: mvw(11px);
        }
      }
      &--down {
        img {
          transform: rotate(180deg);
        }
      }
    }
  }
  &__main {
    margin-top: 1.125rem;
    &--checkbox {
      margin-bottom: 1.25rem;
    }
  }
}
</style>

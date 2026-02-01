<template>
  <div class="pagination">
    <img
      src="@/assets/images/icons/arrow_left.svg"
      class="pagination__button"
      @click="handleClickBack"
    />
    <div
      class="pagination__page"
      :class="{ 'pagination__page--active': first === pageData }"
      @click="handleClickPage(first)"
    >
      {{ first }}
    </div>
    <div v-if="isLeft" class="pagination__dots">...</div>
    <div
      v-for="ind in range"
      :key="ind"
      class="pagination__page"
      :class="{ 'pagination__page--active': ind === pageData }"
      @click="handleClickPage(ind)"
    >
      {{ ind }}
    </div>
    <div v-if="isRight" class="pagination__dots">...</div>
    <div
      v-if="pages !== 1"
      class="pagination__page"
      :class="{ 'pagination__page--active': last === pageData }"
      @click="handleClickPage(last)"
    >
      {{ last }}
    </div>
    <img
      src="@/assets/images/icons/arrow_right.svg"
      class="pagination__button pagination__button--right"
      @click="handleClickForward"
    />
  </div>
</template>

<script>
export default {
  name: "ThePagination",
  props: {
    value: {
      type: Number,
      required: true,
    },
    pages: {
      type: Number,
      required: true,
    },
  },
  computed: {
    range() {
      const arr = [];
      for (let i = this.min; i <= this.max; i++) {
        arr.push(i);
      }
      return arr;
    },
    min() {
      if (this.pageData <= 2) {
        return 2;
      }
      if (this.pageData > this.pages - 2) {
        return Math.max(this.pageData - 2, 2);
      }
      return this.pageData - 1;
    },
    max() {
      if (this.pageData > this.pages - 2) {
        return this.pages - 1;
      }
      if (this.pageData <= 2) {
        return Math.min(this.pageData + 2, this.pages - 1);
      }
      return this.pageData + 1;
    },
    last() {
      return this.pages;
    },
    first() {
      return 1;
    },
    isLeft() {
      return this.min !== 2;
    },
    isRight() {
      return this.max !== this.pages - 1;
    },
    pageData: {
      get() {
        return this.value;
      },
      set(val) {
        this.$emit("input", val);
      },
    },
  },
  methods: {
    handleClickPage(val) {
      this.pageData = val;
    },
    handleClickBack() {
      if (this.pageData === 1) return;

      this.pageData -= 1;
    },
    handleClickForward() {
      if (this.pageData === this.pages) return;

      this.pageData += 1;
    },
  },
};
</script>

<style lang="scss" scoped>
.pagination {
  display: flex;
  justify-content: center;
  &__page {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 2.5rem;
    height: 2.5rem;
    font-weight: 600;
    font-size: 1rem;
    line-height: 1.5rem;
    box-sizing: border-box;
    border-radius: 50%;
    cursor: pointer;
    margin-right: 0.75rem;
    @include layout-mobile() {
      width: mvw(30px);
      height: mvw(30px);
      font-size: mvw(14px);
      line-height: mvw(24px);
      margin-right: mvw(12px);
    }
    &--active {
      border: 2px solid $primary-marigold;
    }
    &:hover {
      border: 2px solid $primary-marigold;
    }
    &:last-of-type {
      margin-right: 0;
    }
  }
  &__dots {
    font-weight: 600;
    font-size: 1rem;
    line-height: 1.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 0.75rem;

    @include layout-mobile() {
      font-size: mvw(14px);
      line-height: mvw(24px);
      margin-right: mvw(12px);
    }
  }

  &__button {
    width: 0.5rem;
    cursor: pointer;
    margin-right: 1.5625rem;

    @include layout-mobile() {
      width: mvw(8px);
      padding-bottom: mvw(1px);
      margin-right: mvw(10px);
    }
    &--right {
      margin-left: 1.5625rem;
      margin-right: 0;
      @include layout-mobile() {
        margin-left: mvw(10px);
      }
    }
    &:hover {
      opacity: 0.8;
    }
  }
}
</style>

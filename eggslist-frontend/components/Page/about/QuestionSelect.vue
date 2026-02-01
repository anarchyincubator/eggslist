<template>
  <div class="select">
    <div class="select__question">
      <h4>{{ question }}</h4>
      <div
        :class="[
          'select__question__button',
          { 'select__question__button--select': opened },
        ]"
        @click="handleChange"
      >
        <svg viewBox="0 0 10 7" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M5 0.666687L0 5.66669L1.175 6.84169L5 3.02502L8.825 6.84169L10 5.66669L5 0.666687Z"
            fill="#282220"
          />
        </svg>
      </div>
    </div>
    <div v-if="opened" class="select__answer body-1">{{ answer }}</div>
  </div>
</template>

<script>
export default {
  name: "QuestionSelect",
  props: {
    question: {
      type: String,
      default: "question",
    },
    answer: {
      type: String,
      default: "question",
    },
  },
  data() {
    return {
      opened: false,
    };
  },
  methods: {
    handleChange() {
      this.opened = !this.opened;
    },
  },
};
</script>

<style lang="scss" scoped>
.select {
  width: 39.375rem;
  min-height: 6rem;
  display: flex;
  flex-direction: column;
  border-bottom: 2px solid #f2e2ca;
  @include layout-mobile() {
    width: 100%;
    min-height: mvw(74px);
  }
  &__answer {
    margin: 1.75rem 0;
  }
  &__question {
    display: flex;
    width: 100%;
    margin-top: 2.25rem;
    @include layout-mobile() {
      margin-top: mvw(20px);
      align-items: center;
    }
    h4 {
      margin-right: auto;
    }
    &__button {
      width: 2rem;
      height: 2rem;
      display: flex;
      align-items: center;
      flex-shrink: 0;
      border-radius: 50%;
      border: 1.5px solid $neutral-70;
      justify-content: center;
      cursor: pointer;
      transition: all 0.5s;
      @include layout-mobile() {
        width: mvw(32px);
        height: mvw(32px);
      }
      svg {
        width: 0.75rem;
        transition: all 0.5s;
        transform: rotate(180deg);
        @include layout-mobile() {
          width: mvw(12px);
        }
        path {
          transition: all 0.5s;
        }
      }
      @include layout-not-mob() {
        &:hover {
          background: $primary-black;
          border: 1.5px solid $primary-black;
          path {
            fill: $primary-white;
          }
        }
      }

      &--select {
        background: $primary-black;
        border: 1.5px solid $primary-black;
        path {
          fill: $primary-white;
        }
        svg {
          transform: rotate(0);
        }
      }
    }
  }
}
</style>

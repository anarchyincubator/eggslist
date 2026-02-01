<template>
  <client-only>
    <div class="quotes">
      <div class="list">
        <div v-swiper:swiperInstance="swiperOptionsInner" class="fake">
          <div v-swiper:swiperInstance="swiperOptionsInner" class="list-cards">
            <div class="swiper-wrapper">
              <div
                v-for="(quote, index) in quotes"
                :key="index"
                class="quotes__item swiper-slide"
              >
                <img src="@/assets/images/icons/quote.svg" />
                <div class="quotes__title">
                  {{ quote.body }}
                </div>
                <div class="quotes__author">{{ quote.author }}</div>
              </div>
            </div>
          </div>
        </div>
        <div class="list__buttons">
          <div
            class="list__buttons__button list__buttons__button--left"
            @click="slidePrev"
          >
            <svg viewBox="0 0 12 18" fill="none">
              <path
                d="M11.115 2.115L9 0L0 9L9 18L11.115 15.885L4.245 9L11.115 2.115Z"
                fill="#FEF3E1"
              />
            </svg>
          </div>
          <div
            class="list__buttons__button list__buttons__button--right"
            @click="slideNext"
          >
            <svg viewBox="0 0 12 18" fill="none">
              <path
                d="M3.00001 0L0.88501 2.115L7.75501 9L0.88501 15.885L3.00001 18L12 9L3.00001 0Z"
                fill="#FEF3E1"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  </client-only>
</template>

<script>
export default {
  name: "QuotesList",
  props: {
    quotes: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      mounted: false,
      swiperOptionsInner: {
        slidesPerView: 1,
        spaceBetween: 20,
        allowTouchMove: false,
        loop: true,
        breakpoints: {
          729: {
            slidesPerView: 1,
            spaceBetween: 0,
          },
        },
      },
    };
  },

  methods: {
    slidePrev() {
      if (this.swiperInstance) {
        this.swiperInstance.slidePrev();
      }
    },
    slideNext() {
      if (this.swiperInstance) {
        this.swiperInstance.slideNext();
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.quotes {
  margin-top: 8.125rem;
  margin-bottom: 8.75rem;
  &__title {
    font-style: italic;
    font-size: 1.75rem;
    line-height: 2.5rem;
    text-align: center;
    margin-top: 3.625rem;
    margin-bottom: 2.5rem;
    max-width: 53.125rem;
    @include layout-mobile() {
      margin: mvw(20px) 0;
      max-width: 100%;
      font-size: mvw(20px);
      line-height: mvw(24px);
    }
  }
  &__item {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    img {
      width: 1.5625rem;
      @include layout-mobile() {
        width: mvw(25px);
      }
    }
  }
  &__author {
    font-size: 1rem;
    line-height: 1.5rem;
    font-weight: 500;
    @include layout-mobile() {
      font-size: mvw(14px);
      line-height: mvw(16px);
    }
  }
  @include layout-mobile() {
    margin-top: mvw(30px);
    margin-bottom: mvw(70px);
  }
}
.list {
  position: relative;
  &__buttons {
    &__button {
      position: absolute;
      display: flex;
      z-index: 10;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      user-select: none;
      border: 1.5px solid $primary-marigold;
      width: 3rem;
      height: 3rem;
      top: 40%;
      transform: translateY(-50%);
      cursor: pointer;
      &:hover {
        background: $primary-marigold-dark;
        @include layout-mobile() {
          background: transparent;
        }
      }
      svg {
        height: 1.125rem;
        @include layout-mobile() {
          height: mvw(18px);
        }
      }
      &--left {
        left: 0;
        @include layout-mobile() {
          left: inherit;
          margin-right: mvw(8px);
        }
      }
      &--right {
        right: 0;
        @include layout-mobile() {
          right: inherit;
        }
      }
      &-not {
        cursor: inherit;
        opacity: 0.6;
        user-select: none;
        &:hover {
          background: transparent;
        }
      }

      @include layout-mobile() {
        width: mvw(48px);
        height: mvw(48px);
        position: inherit;
        top: auto;
        transform: none;
        border: mvw(1.5px) solid $primary-marigold;
      }
    }
    @include layout-mobile() {
      display: flex;
      justify-content: center;
      margin-top: mvw(32px);
    }
  }
}
</style>

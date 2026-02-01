<template>
  <client-only>
    <div class="popular">
      <div class="popular__top">
        <h2>Popular Near You</h2>
        <a tabindex="-1" @click="pushCatalog">View All Listings</a>
      </div>
      <div v-show="!loading" :style="cssVars" class="list">
        <div v-swiper:swiperInstance="swiperOptionsInner" class="list-cards">
          <div class="swiper-wrapper">
            <CardItem
              v-for="(product, index) in products"
              :key="index"
              class="swiper-slide list__slide"
              :style="{ marginRight: marginRight }"
              :title="product.title"
              :slug="product.slug"
              :price="product.price"
              :out-stock="product.isOut"
              :background="product.image"
              :author-config="product.seller"
            ></CardItem>
          </div>
        </div>
        <div class="list__buttons">
          <div
            class="list__buttons__button list__buttons__button--left"
            :class="{ 'list__buttons__button-not': isInButtonLeft }"
            @click="slidePrev"
          >
            <img slot="content" src="@/assets/images/icons/arrow_left.svg" />
          </div>
          <div
            class="list__buttons__button list__buttons__button--right"
            :class="{ 'list__buttons__button-not': isInButtonRight }"
            @click="slideNext"
          >
            <img slot="content" src="@/assets/images/icons/arrow_right.svg" />
          </div>
        </div>
      </div>
      <div v-show="loading" class="list-loading">
        <SkeletonCardItem
          v-for="(item, index) in 4"
          :key="index"
          class="list-loading__item"
        ></SkeletonCardItem>
      </div>
    </div>
  </client-only>
</template>

<script>
import SkeletonCardItem from "../../Common/SkeletonCardItem";
import CardItem from "../../Common/CardItem";
export default {
  name: "PopularList",
  components: { CardItem, SkeletonCardItem },
  props: {
    products: {
      type: Array,
      default: () => [],
    },
    loading: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      mounted: false,
      isInButtonRight: false,
      isInButtonLeft: false,
      done: false,
      swiperOptionsInner: {
        slidesPerView: 2,
        allowTouchMove: false,
        spaceBetween: 20,
        breakpoints: {
          860: {
            slidesPerView: 4,
            spaceBetween: 30,
          },
        },
      },
    };
  },
  computed: {
    isMobile() {
      return this.$store.getters["isMobile"];
    },
    windowWidth() {
      return this.$store.state.windowWidth;
    },
    marginRight() {
      let rig = this.isMobile
        ? (20 * this.windowWidth) / 320
        : this.convertRemToPixels(1.8);

      return `${rig}px`;
    },
    cssVars() {
      return {
        "--margin": this.marginRight,
      };
    },
  },
  watch: {
    products() {
      if (!this.done) this.reCalcStyle();
    },
    windowWidth() {
      if (!this.done) this.reCalcWidth();
    },
  },

  mounted() {
    setTimeout(() => {
      this.reCalcStyle();
      this.reCalcWidth();
    }, 100);
  },
  methods: {
    convertRemToPixels(rem) {
      return (
        rem * parseFloat(getComputedStyle(document.documentElement).fontSize)
      );
    },
    pushCatalog() {
      this.done = true;
      this.$router.push("/catalog");
    },
    reCalcWidth() {
      this.swiperInstance.params.spaceBetween = this.isMobile
        ? (20 * this.windowWidth) / 320
        : this.convertRemToPixels(1.8);
    },
    reCalcStyle() {
      this.isInButtonRight =
        this.swiperInstance.realIndex + (this.isMobile ? 2 : 4) >=
        this.products.length;
      this.isInButtonLeft = this.swiperInstance.realIndex === 0;
    },
    slidePrev() {
      if (this.swiperInstance) {
        this.swiperInstance.slidePrev();
        this.reCalcStyle();
      }
    },
    slideNext() {
      if (this.swiperInstance) {
        this.swiperInstance.slideNext();
        this.reCalcStyle();
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.popular {
  &__top {
    display: flex;
    align-items: baseline;
    margin-bottom: 3rem;
    h2 {
      margin-right: auto;
    }
    a {
      font-size: 1rem;
      line-height: 1.5rem;
      padding-bottom: 0.0625rem;
      font-weight: 600;
      cursor: pointer;
      border-bottom: 2px solid $primary-marigold;
      height: min-content;
      &:hover {
        opacity: 0.75;
      }
      @include layout-mobile() {
        font-size: mvw(16px);
        line-height: mvw(24px);
        padding-bottom: mvw(1px);
        margin-top: mvw(16px);
      }
    }
    @include layout-mobile() {
      flex-direction: column;
      margin-bottom: mvw(32px);
    }
  }
}
.list-loading {
  display: flex;
  &__item {
    margin-right: 1.8rem;
    @include layout-mobile() {
      margin-right: mvw(20px);
    }
  }
}
.list {
  position: relative;
  &__slide {
    margin-right: var(--margin);
    @include layout-mobile() {
      margin-right: mvw(20px);
      width: mvw(130px);
    }
  }
  &__buttons {
    &__button {
      position: absolute;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      border: 1px solid $primary-marigold;
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
      img {
        height: 1.125rem;
        @include layout-mobile() {
          height: mvw(18px);
        }
      }
      &--left {
        left: -5.75rem;
        @include layout-mobile() {
          left: inherit;
          margin-right: mvw(8px);
        }
      }
      &--right {
        right: -5.75rem;
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
      }
    }
    @include layout-mobile() {
      display: flex;
      margin-top: mvw(32px);
    }
  }
}
</style>

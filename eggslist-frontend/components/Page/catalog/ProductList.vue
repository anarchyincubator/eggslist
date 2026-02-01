<template>
  <div v-if="isShow" class="products">
    <div class="products__top">
      <h2>{{ title }}</h2>
      <nuxt-link
        v-if="!loading"
        class="products__link"
        tabindex="-1"
        :to="link"
      >
        <span>View More</span>
        <div class="products__button">
          <img src="@/assets/images/icons/arrow-forward.svg" />
        </div>
      </nuxt-link>
    </div>
    <div v-if="!loading" class="catalog">
      <CardItem
        v-for="(item, index) in items"
        :key="index"
        :title="item.title"
        :background="item.image"
        :price="item.price"
        :out-stock="item.isOut"
        :author-config="item.seller"
        :slug="item.slug"
        :is-big-height="getIfHeight(index)"
        class="catalog__item"
      ></CardItem>
    </div>
    <div v-else class="list-loading">
      <SkeletonCardItem
        v-for="(item, index) in count"
        :key="index"
        class="list-loading__item"
      ></SkeletonCardItem>
    </div>
  </div>
</template>

<script>
import CardItem from "../../Common/CardItem";
import SkeletonCardItem from "../../Common/SkeletonCardItem";
export default {
  name: "ProductList",
  components: { CardItem, SkeletonCardItem },
  props: {
    title: {
      type: String,
      default: "",
    },
    items: {
      type: Array,
      required: true,
    },
    loading: {
      type: Boolean,
      default: false,
    },
    link: {
      type: String,
      default: "",
    },
  },
  computed: {
    isEmpty() {
      return this.items && this.items.length > 0;
    },
    isShow() {
      return (this.isEmpty && !this.loading) || this.loading;
    },
    isMobile() {
      return this.$store.getters["isMobile"];
    },
    count() {
      return this.isMobile ? 2 : 4;
    },
  },
  methods: {
    getIfHeight(index) {
      if (
        this.items.length === 0 ||
        (this.items.length === index + 1 && index % 2 === 0)
      )
        return Boolean(this.items[index].title.length >= 14);

      let isLarge = this.items[index].title.length >= 14;

      if (index % 2 === 1) {
        isLarge |= this.items[index - 1].title.length >= 14;
      } else {
        isLarge |= this.items[index + 1].title.length >= 14;
      }
      return Boolean(isLarge);
    },
  },
};
</script>

<style lang="scss" scoped>
.products {
  &__link {
    display: flex;
    align-items: center;
  }
  &__button {
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    width: 2rem;
    border: 1.5px solid $primary-marigold;
    border-radius: 50%;
    height: 2rem;
    margin-left: 1rem;
    &:hover {
      opacity: 0.8;
    }
    img {
      width: 1rem;
      height: 1rem;
      @include layout-mobile() {
        width: mvw(16px);
        height: mvw(16px);
      }
    }
    @include layout-mobile() {
      width: mvw(32px);
      height: mvw(32px);
    }
  }
  &__top {
    display: flex;
    align-items: baseline;
    margin-bottom: 3rem;
    h2 {
      margin-right: auto;
    }
    a {
      span {
        font-size: 1rem;
        line-height: 1.5rem;
        font-weight: 600;
        height: min-content;
        @include layout-mobile() {
          font-size: mvw(16px);
          line-height: mvw(24px);
        }
      }
      &:hover {
        opacity: 0.75;
      }
      @include layout-mobile() {
        font-size: mvw(16px);
        line-height: mvw(24px);
        padding-bottom: mvw(1px);
        margin-top: mvw(12px);
      }
    }
    @include layout-mobile() {
      flex-direction: column;
      margin-bottom: mvw(32px);
    }
  }
}
.catalog {
  display: flex;
  &__item {
    margin-right: 1.875rem;
    &:nth-child(4n) {
      margin-right: 0;
    }
    @include layout-mobile() {
      width: mvw(130px);
      margin-right: mvw(20px);
      margin-bottom: mvw(32px);
      &:nth-child(2n) {
        margin-right: 0;
      }
    }
  }
  @include layout-mobile() {
    flex-wrap: wrap;
  }
}
.list-loading {
  display: flex;
  &__item {
    margin-right: 1.875rem;
    @include layout-mobile() {
      margin-right: mvw(20px);
    }
  }
}
</style>

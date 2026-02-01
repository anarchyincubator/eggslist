<template>
  <div v-if="isShow" class="blogs">
    <div class="blogs__top">
      <h2>{{ title }}</h2>
      <nuxt-link v-if="!loading" class="blogs__link" tabindex="-1" :to="link">
        <span>View All Stories</span>
        <div class="blogs__button">
          <img src="@/assets/images/icons/arrow-forward.svg" />
        </div>
      </nuxt-link>
    </div>
    <div v-if="!loading" class="blogs-list">
      <BlogsItem
        v-for="(blog, index) in blogs"
        :key="index"
        class="blogs-list__item"
        :blog="blog"
      ></BlogsItem>
    </div>
    <div v-else class="list-loading">
      <SkeletonBlogItem
        v-for="(item, index) in 2"
        :key="index"
        class="list-loading__item"
      ></SkeletonBlogItem>
    </div>
  </div>
</template>

<script>
import BlogsItem from "../Blogs/BlogsItem";
import SkeletonBlogItem from "../Common/SkeletonBlogItem";
export default {
  name: "BlogsRelated",
  components: { BlogsItem, SkeletonBlogItem },
  props: {
    title: {
      type: String,
      default: "",
    },
    blogs: {
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
      return this.blogs && this.blogs.length > 0;
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
  methods: {},
};
</script>

<style lang="scss" scoped>
.blogs {
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
.blogs-list {
  display: flex;
  &__item {
    margin-right: 1.875rem;
    &:nth-child(4n) {
      margin-right: 0;
    }
    @include layout-mobile() {
      width: 100%;
      margin-right: 0;
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

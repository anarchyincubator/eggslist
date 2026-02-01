<template>
  <div class="stories">
    <div class="stories__top">
      <h2>Featured Stories</h2>
      <nuxt-link tabindex="-1" to="/blogs">View All Stories</nuxt-link>
    </div>
    <div v-if="!loading" class="list">
      <BlogsItem
        v-for="(story, index) in stories"
        :key="index"
        class="list__item"
        :blog="story"
      ></BlogsItem>
    </div>
    <div v-else class="list">
      <SkeletonBlogItem
        v-for="(item, index) in 3"
        :key="index"
        class="list__item"
      ></SkeletonBlogItem>
    </div>
  </div>
</template>

<script>
import BlogsItem from "../../Blogs/BlogsItem";
import SkeletonBlogItem from "../../Common/SkeletonBlogItem";
export default {
  name: "StoriesList",
  components: { SkeletonBlogItem, BlogsItem },
  props: {
    stories: {
      type: Array,
      default: () => [],
    },
    loading: {
      type: Boolean,
      default: false,
    },
  },
};
</script>

<style lang="scss" scoped>
.stories {
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
.list {
  position: relative;
  display: flex;
  flex-wrap: wrap;
  @include layout-mobile() {
    flex-direction: column;
  }
  &__item {
    margin-right: 1.8125rem;
    &:nth-child(3) {
      margin-right: 0;
    }
    @include layout-mobile() {
      margin: 0 0 mvw(48px) 0;
    }
  }
}
</style>

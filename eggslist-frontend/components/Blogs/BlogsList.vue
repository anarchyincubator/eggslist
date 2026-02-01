<template>
  <div class="blogs">
    <div v-if="!loading" class="blogs-list">
      <BlogsItem
        v-for="(blog, index) in blogs"
        :key="index"
        :is-edit="isEdit"
        class="blogs-list__item"
        :blog="blog"
        @delete="handleDelete"
      ></BlogsItem>
    </div>
    <div v-else class="blogs-list">
      <SkeletonBlogItem v-for="i in 3" :key="i" class="blogs-list__item" />
    </div>
    <div
      v-if="!isComplete && !loading"
      v-observe-visibility="visibilityChanged"
      class="blogs-list__loader"
    ></div>
  </div>
</template>

<script>
import BlogsItem from "./BlogsItem";
import CustomButton from "../Common/CustomButton";
import SkeletonBlogItem from "../Common/SkeletonBlogItem";
export default {
  name: "BlogsList",
  components: { SkeletonBlogItem, CustomButton, BlogsItem },
  props: {
    blogs: {
      type: Array,
      required: true,
    },
    loading: {
      type: Boolean,
      required: true,
    },
    isComplete: {
      type: Boolean,
      required: true,
    },
    isEdit: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      isVisible: false,
    };
  },
  methods: {
    handleDelete() {
      this.$emit("delete");
    },
    visibilityChanged(isVisible, entry) {
      this.isVisible = isVisible;

      if (!this.isVisible) return;

      this.$emit("loadMore");
    },
  },
};
</script>

<style lang="scss" scoped>
.blogs {
  display: flex;
  flex-direction: column;
}
.blogs-list {
  display: flex;
  flex-wrap: wrap;
  @include layout-mobile() {
    flex-direction: column;
    flex-wrap: nowrap;
  }
  &__item {
    margin-right: 1.8rem;
    margin-bottom: 3rem;
    @include layout-mobile() {
      margin: 0 0 mvw(48px);
    }
    &:nth-child(3n) {
      margin-right: 0;
    }
  }
  &__loader {
    height: 1px;
    /* background: transparent !important;
    border: 2px solid #f9aa29;*/
  }
}
</style>

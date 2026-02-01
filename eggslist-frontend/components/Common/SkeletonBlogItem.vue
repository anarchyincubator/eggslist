<template>
  <div class="skeleton-card">
    <SkeletonItem
      :height="16.875"
      :height-mobile="185"
      :width="25.625"
      :width-mobile="280"
      :border="1.875"
      :border-mobile="15"
    />
    <SkeletonItem
      class="skeleton-card__title"
      :height="1"
      :height-mobile="16"
      :width="2.5"
      :width-mobile="40"
    />
    <SkeletonItem
      class="skeleton-card__desc"
      :height="4"
      :height-mobile="48"
      :width="25.625"
      :width-mobile="280"
    />
    <SkeletonItem
      :height="1"
      :height-mobile="16"
      :width="2.5"
      :width-mobile="40"
    />
  </div>
</template>

<script>
import SkeletonItem from "./SkeletonItem";
export default {
  name: "SkeletonBlogItem",
  components: { SkeletonItem },
  props: {},
  computed: {
    backgroundStyle() {
      return {
        "background-image": `url(${this.background})`,
      };
    },
  },
};
</script>

<style lang="scss" scoped>
.skeleton-card {
  &__title {
    height: 1.5rem;
    margin-top: 1rem;
    margin-bottom: 0.5rem;
    @include layout-mobile() {
      margin-top: mvw(16px);
      margin-bottom: mvw(8px);
    }
  }
  &__desc {
    margin-bottom: 0.5rem;
    @include layout-mobile() {
      margin-bottom: mvw(8px);
    }
  }
}
</style>

<template>
  <div class="skeleton-card">
    <SkeletonItem
      :height="8.6875"
      :height-mobile="60"
      :width="18.75"
      :width-mobile="130"
      :border="1.875"
      :border-mobile="15"
    />
    <SkeletonItem
      class="skeleton-card__title"
      :height="2"
      :height-mobile="24"
      :width="10"
      :width-mobile="60"
    />
  </div>
</template>

<script>
import SkeletonItem from "./SkeletonItem";
export default {
  name: "SkeletonCategoryItem",
  components: { SkeletonItem },
  props: {},
};
</script>

<style lang="scss" scoped>
.skeleton-card {
  &__title {
    height: 1.5rem;
    margin-top: 1rem;
    @include layout-mobile() {
      margin-top: mvw(16px);
    }
  }
}
</style>

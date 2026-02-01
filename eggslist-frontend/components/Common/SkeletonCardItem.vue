<template>
  <div class="skeleton-card">
    <SkeletonItem
      :height="small ? 11.875 : 18.75"
      :height-mobile="130"
      :width="small ? 11.875 : 18.75"
      :width-mobile="130"
      :border="1.875"
      :border-mobile="12"
    />
    <SkeletonItem
      class="skeleton-card__title"
      :height="1.5"
      :height-mobile="50"
      :width="6.25"
      :width-mobile="100"
    />
    <SkeletonItem
      class="skeleton-card__price"
      :height="1.5"
      :height-mobile="24"
      :width="3.125"
      :width-mobile="50"
    />
    <SkeletonItem
      :height="1.5"
      :height-mobile="0"
      :width="4.375"
      :width-mobile="70"
    />
  </div>
</template>

<script>
import SkeletonItem from "./SkeletonItem";
export default {
  name: "SkeletonCardItem",
  components: { SkeletonItem },
  props: {
    small: {
      type: Boolean,
      default: false,
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
  &__price {
    margin-bottom: 0.5rem;
    @include layout-mobile() {
      margin-bottom: mvw(8px);
    }
  }
}
</style>

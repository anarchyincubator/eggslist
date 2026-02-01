<template>
  <div class="card">
    <SkeletonItem
      :height="9.375"
      :height-mobile="130"
      :width="9.375"
      :width-mobile="130"
      :border="1.875"
      :border-mobile="15"
    />
    <div class="card__about">
      <SkeletonItem
        :height="5.375"
        :height-mobile="100"
        :width="9.375"
        :width-mobile="130"
        :border="0"
        :border-mobile="0"
      />
    </div>
  </div>
</template>

<script>
import SkeletonItem from "../Common/SkeletonItem";
export default {
  name: "SkeletonFavouriteCard",
  components: {
    SkeletonItem,
  },
};
</script>

<style lang="scss" scoped>
.card {
  display: flex;
  &__about {
    margin-left: 2rem;
    @include layout-mobile() {
      width: mvw(20px);
    }
  }
}
</style>

<template>
  <div v-if="!loading" class="listings">
    <CardItem
      v-for="(item, index) in products"
      :key="index"
      :title="item.title"
      :background="item.image"
      :small-card="true"
      :price="item.price"
      :author-config="item.seller"
      :slug="item.slug"
      :is-edit="isEdit"
      :is-hidden="item.isHidden"
      :out-stock="item.isOut"
      class="listings__item"
      @hide="handleHide(item)"
      @out-stock="handleOut(item)"
      @delete="handleDelete(item)"
    ></CardItem>
  </div>
  <div v-else class="listings">
    <SkeletonCardItem
      v-for="(item, index) in 3"
      :key="index"
      :small="true"
      class="listings__item"
    ></SkeletonCardItem>
  </div>
</template>

<script>
import CardItem from "../../Common/CardItem";
import SkeletonCardItem from "../../Common/SkeletonCardItem";
export default {
  name: "ListingsProfile",
  components: { CardItem, SkeletonCardItem },
  props: {
    products: {
      type: Array,
      required: true,
    },
    loading: {
      type: Boolean,
      default: false,
    },
    isEdit: {
      type: Boolean,
      default: false,
    },
  },
  emits: ["hide-item", "out-item", "delete-item"],
  methods: {
    handleHide(item) {
      this.$emit("hide-item", item);
    },
    handleOut(item) {
      this.$emit("out-item", item);
    },
    handleDelete(item) {
      this.$emit("delete-item", item);
    },
  },
};
</script>

<style lang="scss" scoped>
.listings {
  display: flex;
  flex-wrap: wrap;
  &__item {
    margin-right: 1.8125rem;
    margin-bottom: 3.5rem;
    width: 11.875rem;

    @include layout-mobile() {
      margin-right: mvw(20px);
      margin-bottom: mvw(32px);
      width: mvw(130px);
    }
    &:nth-child(4n) {
      margin-right: 0;

      @include layout-mobile() {
        margin-right: mvw(20px);
      }
    }
    &:nth-child(2n) {
      @include layout-mobile() {
        margin-right: 0;
      }
    }
  }
}
</style>

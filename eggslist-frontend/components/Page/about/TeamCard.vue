<template>
  <div v-if="!loading" class="card">
    <div class="card__avatar" :style="style" />
    <h4>{{ member.first_name }} {{ member.last_name }}</h4>
    <div class="body-2">
      {{ member.job_title }}
    </div>
  </div>
  <div v-else class="card">
    <SkeletonItem
      :height="18.75"
      :height-mobile="260"
      :width="18.75"
      :width-mobile="280"
      :border="1.875"
      :border-mobile="12"
    />
    <SkeletonItem
      class="card__h4"
      :height="1.5"
      :height-mobile="50"
      :width="6.25"
      :width-mobile="100"
    />
  </div>
</template>

<script>
import SkeletonItem from "../../Common/SkeletonItem";
export default {
  name: "TeamCard",
  components: { SkeletonItem },
  props: {
    member: {
      type: Object,
      required: true,
    },
    loading: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    style() {
      return {
        "background-image": `url(${this.member.image})`,
      };
    },
  },
};
</script>

<style lang="scss" scoped>
.card {
  width: 18.75rem;
  &__avatar {
    width: 18.75rem;
    height: 17.5rem;
    border-radius: 0.75rem;
    background-size: cover;
    @include layout-mobile() {
      width: mvw(280px);
      height: mvw(261px);
      border-radius: mvw(12px);
    }
  }
  &__h4 {
    margin-top: 1.5rem;
    margin-bottom: 0.5rem;
    @include layout-mobile() {
      margin-top: mvw(16px);
      margin-bottom: mvw(4px);
    }
  }
  h4 {
    margin-top: 1.5rem;
    margin-bottom: 0.5rem;
    @include layout-mobile() {
      margin-top: mvw(16px);
      margin-bottom: mvw(4px);
    }
  }
}
</style>

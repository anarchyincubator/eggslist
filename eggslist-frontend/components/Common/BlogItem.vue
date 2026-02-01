<template>
  <div class="blog-item">
    <div class="blog-item__background" :style="backgroundStyle"></div>
    <h6>{{ category.name }}</h6>
    <h3>{{ title }}</h3>
    <div v-if="authorConfig" class="blog-item__author">
      <span>By {{ authorConfig.firstName }}</span>
    </div>
  </div>
</template>

<script>
export default {
  name: "BlogItem",
  props: {
    title: {
      type: String,
      required: true,
    },
    background: {
      type: String,
      default: "",
    },
    category: {
      type: String,
      default: "",
    },
    authorConfig: {
      type: Object,
      default: null,
    },
  },
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
.blog-item {
  h6 {
    font-size: 0.875rem;
    font-weight: 500;
    line-height: 1rem;
    margin-bottom: 1rem;
    @include layout-mobile() {
      font-size: mvw(12px);
      font-weight: 600;
      line-height: mvw(16px);
    }
  }
  h3 {
    margin: 1rem 0;
    height: 4rem;
    width: 25.625rem;
    @include layout-mobile() {
      height: auto;
      margin: mvw(8px) 0 0 0;
      width: mvw(280px);
    }
  }
  &__background {
    width: 25.625rem;
    height: 16.875rem;
    border-radius: 1.875rem;
    margin-bottom: 1.5rem;
    background-size: cover;
    background-color: $neutral-70;
    @include layout-mobile() {
      width: mvw(280px);
      height: mvw(184px);
      margin-bottom: mvw(16px);
      border-radius: mvw(15px);
    }
  }
  &__author {
    font-size: 0.875rem;
    line-height: 1rem;
    font-weight: 500;
    @include layout-mobile() {
      font-size: mvw(14px);
      line-height: mvw(16px);
      margin-top: mvw(16px);
    }
  }
}
</style>

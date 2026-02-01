<template>
  <div class="skeleton animation--fade" :style="skeletonStyle"></div>
</template>

<script>
export default {
  name: "SkeletonItem",
  props: {
    height: {
      type: Number,
      default: 100,
    },
    heightMobile: {
      type: Number,
      default: 100,
    },
    width: {
      type: Number,
      default: 100,
    },
    widthMobile: {
      type: Number,
      default: 100,
    },
    border: {
      type: Number,
      default: 0,
    },
    borderMobile: {
      type: Number,
      default: 0,
    },
  },

  computed: {
    isMobile() {
      return this.$store.getters["isMobile"];
    },
    skeletonStyle() {
      if (this.isMobile)
        return {
          height: `${(this.heightMobile * this.windowWidth) / 320}px`,
          width: `${(this.widthMobile * this.windowWidth) / 320}px`,
          "border-radius": `${(this.borderMobile * this.windowWidth) / 320}px`,
        };

      return {
        height: `${this.height}rem`,
        width: `${this.width}rem`,
        "border-radius": `${this.border}rem`,
      };
    },
    windowWidth() {
      return this.$store.state.windowWidth;
    },
  },
};
</script>

<style lang="scss" scoped>
.skeleton {
  background-color: rgba(213, 187, 145, 0.7);
}
.animation--fade {
  animation: fade 1.5s linear 0.5s infinite;
}
/* Animation definitions */
@keyframes fade {
  0% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
  100% {
    opacity: 1;
  }
}
</style>

<template>
  <div class="tooltip">
    <div
      class="tooltip__main"
      @mouseleave="handleClose"
      @mouseenter="handleHover"
    >
      ?
    </div>
    <transition name="fade" mode="out-in">
      <div v-if="isHover" class="tooltip__hover">
        <div class="tooltip__hover__text"><slot></slot></div>
        <div class="tooltip__hover__decor" />
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  name: "TooltipComponent",
  data() {
    return {
      isHover: false,
    };
  },
  methods: {
    handleHover() {
      this.isHover = true;
    },
    handleClose() {
      this.isHover = false;
    },
  },
};
</script>

<style lang="scss" scoped>
$off: mvw(12px);

.tooltip {
  position: relative;
  &__main {
    background-color: $neutral-70;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    font-size: 0.875rem;
    font-weight: 600;
    width: 1.25rem;
    height: 1.25rem;
    @include layout-mobile() {
      width: mvw(20px);
      height: mvw(20px);
      font-size: mvw(14px);
    }
  }
  &__hover {
    background: #f2e2ca;
    transition: opacity 0.5s;
    z-index: 30;
    bottom: calc(100% + 1.5rem);
    position: absolute;
    font-weight: 400;
    left: -1.25rem;
    border-radius: 0.75rem;
    font-size: 1rem;
    line-height: 1.5rem;
    width: max-content;
    padding: 1rem;
    max-width: 18.75rem;
    box-sizing: border-box;
    @include layout-mobile() {
      left: mvw(-3px);
      font-size: mvw(12px);
      line-height: mvw(24px);
      border-radius: mvw(12px);
      bottom: calc(100% + #{$off});
      max-width: mvw(190px);
    }
    &__decor {
      width: 1.5rem;
      height: 1.5rem;
      position: absolute;
      transform: rotate(-45deg);
      background: #f2e2ca;
      z-index: 20;
      @include layout-mobile() {
        width: mvw(12px);
        height: mvw(12px);
        bottom: mvw(-4px);
      }
    }
    &__text {
      z-index: 40;
      position: relative;
    }
  }
}
</style>

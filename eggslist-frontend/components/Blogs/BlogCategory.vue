<template>
  <div
    :class="[
      'auth-profile__tabs--tab',
      { 'auth-profile__tabs--tab--active': isActive },
    ]"
    @click="handleChangeTab"
  >
    {{ title }}
  </div>
</template>

<script>
export default {
  name: "BlogCategory",
  props: {
    isActive: {
      type: Boolean,
      default: false,
    },
    keyTab: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      default: "",
    },
  },
  methods: {
    handleChangeTab() {
      this.$emit("click");
    },
  },
};
</script>

<style lang="scss" scoped>
.auth-profile__tabs--tab {
  width: max-content;
  height: 3rem;
  border: 1.5px solid $neutral-70;
  border-radius: 6.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  padding: 1rem 1.5rem;
  font-size: 0.875rem;
  line-height: 1rem;
  box-sizing: border-box;
  cursor: pointer;
  transition: 0.2s all;
  @include layout-mobile() {
    width: max-content;
    font-size: mvw(14px);
    white-space: nowrap;
    font-weight: mvw(16px);
    border-width: 0;
    box-sizing: border-box;
    height: mvw(32px);
    padding: 0;
  }
  &:hover {
    background-color: $primary-black;
    color: $primary-cream;
    border: 1.5px solid $primary-black;
  }
  &--active {
    background-color: $primary-black;
    color: $primary-cream;
    border: 1.5px solid $primary-black;
    @include layout-mobile() {
      padding: 0 mvw(12px);
      border-width: 0;
    }
  }
}
</style>

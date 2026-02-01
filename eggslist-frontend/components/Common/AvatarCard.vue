<template>
  <div class="avatar">
    <div class="avatar__content">
      <img v-if="avatar" :src="avatar" />
      <slot v-else></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: "AvatarCard",
  props: {
    avatar: {
      type: String,
      default: "",
    },
    name: {
      type: String,
      default: "",
    },
  },
};
</script>

<style lang="scss" scoped>
.avatar__content {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: $neutral-70;
  text-transform: uppercase;

  h1 {
    text-transform: uppercase;
  }

  img {
    border-radius: 50%;
    width: 100%;
    height: 100%;
  }
}
</style>

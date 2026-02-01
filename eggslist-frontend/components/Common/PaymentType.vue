<template>
  <div class="type" :style="styles">{{ type }}</div>
</template>

<script>
export default {
  name: "PaymentType",
  props: {
    type: {
      type: String,
      required: true,
    },
  },
  computed: {
    styles() {
      if (this.type === "In progress") {
        return { "border-color": "#FAA614" };
      }
      if (this.type === "Success") {
        return { "border-color": "#008738" };
      }
      return { "border-color": "#B00020" };
    },
  },
};
</script>

<style lang="scss" scoped>
.type {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.875rem;
  line-height: 1.5rem;
  padding: 0.1rem 0.5rem;
  border: 2px solid #b00020;
  width: min-content;
  border-radius: 0.75rem;
}
</style>

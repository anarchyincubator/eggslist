<template>
  <div class="related">
    <div class="related__list">
      <BlogsItem />
    </div>
  </div>
</template>

<script>
import BlogsItem from "./BlogsItem";
export default {
  name: "RelatedBlogs",
  components: { BlogsItem },
};
</script>

<style scoped></style>

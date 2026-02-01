<template>
  <div class="blog-item" @click="handleToSlug">
    <div :style="backgroundStyle" class="blog-item__background">
      <div
        v-if="isEdit"
        :class="[
          'blog-item__background__edit',
          { 'blog-item__background__edit--active': isEditActive },
        ]"
        @click="handleClickEdit"
      >
        <img
          class="blog-item__background__edit--settings"
          src="@/assets/images/icons/settings.svg"
        />
        <img
          class="blog-item__background__edit--dropdown"
          src="@/assets/images/icons/drop-down.svg"
        />
        <div v-if="isEditActive" class="blog-item__background__edit--popup">
          <p class="button-2" @click="handleEdit">Edit</p>
          <strong class="button-2" @click="handleDelete">Delete</strong>
        </div>
      </div>
      <div v-else class=""></div>
    </div>
    <h6 class="blog-item__category" @click="handleCategory">
      {{ blog.category.name }}
    </h6>
    <h3>{{ blog.title }}</h3>
    <h6 @click="handleTitle">By {{ fullName }}</h6>
  </div>
</template>

<script>
export default {
  name: "BlogsItem",
  props: {
    blog: {
      required: true,
      type: Object,
    },
    isEdit: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      isEditActive: false,
    };
  },
  computed: {
    isMobile() {
      return this.$store.getters["isMobile"];
    },
    backgroundStyle() {
      return {
        "background-image": `url(${this.background})`,
      };
    },
    background() {
      return this.blog?.image;
    },
    fullName() {
      return `${this.blog.author?.firstName} ${this.blog.author?.lastName}`;
    },
  },
  methods: {
    handleEdit() {
      this.$router.push(`/blogs/edit?slug=${this.blog.slug}`);
    },
    handleDelete() {
      this.$store.dispatch("blog/deleteBlog", this.blog.slug);
      this.$emit("delete");
    },
    handleToSlug() {
      this.$router.push(`/blogs/blog?slug=${this.blog.slug}`);
    },
    handleCategory(e) {
      e.stopPropagation();
      this.$router.push(`/blogs/filter?category=${this.blog.category?.slug}`);
    },
    handleTitle(e) {
      e.stopPropagation();
      this.$router.push(`/blogs/filter?user-id=${this.blog.author?.id}`);
    },
    handleClickEdit(e) {
      this.isEditActive = !this.isEditActive;
      e.stopPropagation();
    },
  },
};
</script>

<style lang="scss" scoped>
.blog-item {
  display: flex;
  width: 25.625rem;
  height: 26.875rem;
  flex-direction: column;
  cursor: pointer;
  @include layout-mobile() {
    width: 100%;
    height: auto;
  }
  &__background {
    width: 100%;
    border-radius: 1.875rem;
    height: 16.875rem;
    background-color: $neutral-70;
    background-size: cover;
    position: relative;
    &__edit {
      width: 4.875rem;
      height: 3rem;
      border-radius: 6.25rem;
      background-color: $neutral-30;
      z-index: 10;
      position: absolute;
      top: 0.75rem;
      left: 0.75rem;
      box-sizing: border-box;
      padding: 0.875rem 1.0625rem 0.875rem 0.75rem;
      display: flex;
      align-items: center;
      &:hover {
        opacity: 0.8;
      }
      &--active {
        background-color: $primary-black;
        &:hover {
          opacity: 1;
        }
      }
      &--settings {
        width: 1.1875rem;
        margin-right: auto;
      }
      &--dropdown {
        width: 0.625rem;
      }
      &--popup {
        position: absolute;
        display: flex;
        flex-direction: column;
        left: 0;
        background: $primary-white;
        box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
        border-radius: 0.75rem;
        width: 12.125rem;
        height: 4.9375rem;
        bottom: calc(-5.5rem);
        padding: 1rem;
        box-sizing: border-box;
        z-index: 10;
        @include layout-mobile() {
          width: mvw(120px);
          height: mvw(65px);
          bottom: calc(#{mvw(-70px)});
        }
        p {
          margin-bottom: 0.75rem;
          cursor: pointer;
          font-size: 0.875rem;
          line-height: 1rem;
          @include layout-mobile() {
            line-height: mvw(14px);
            font-size: mvw(14px);
            margin-bottom: mvw(14px);
          }
          &:hover {
            opacity: 0.8;
          }
        }
        strong {
          cursor: pointer;
          color: #b00020;
          font-size: 0.875rem;
          line-height: 1rem;
          &:hover {
            opacity: 0.8;
          }
          @include layout-mobile() {
            line-height: mvw(14px);
            font-size: mvw(14px);
          }
        }
      }
    }
    @include layout-mobile() {
      width: 100%;
      border-radius: mvw(15px);
      height: mvw(184px);
    }
  }
  &__category {
    margin: 1rem 0;
    width: max-content;
    @include layout-mobile() {
      margin-top: mvw(16px);
      margin-bottom: mvw(8px);
    }
  }
  h3 {
    margin-bottom: auto;
    @include layout-mobile() {
      margin-bottom: mvw(16px);
    }
  }
  h6 {
    &:hover {
      text-decoration: underline;
      cursor: pointer;
    }
  }
}
</style>

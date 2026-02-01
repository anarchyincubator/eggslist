<template>
  <div class="page">
    <div class="page__header" @click="handleToProfile">
      <div class="page__header__button">
        <img src="@/assets/images/icons/arrow-forward.svg" />
      </div>
      <span> Profile</span>
    </div>
    <div class="page__content">
      <h1>Write A Blog Post</h1>
      <BlogForm ref="form" v-model="formData"></BlogForm>
      <div class="page__content__buttons">
        <CustomButton
          class="page__content__buttons--verified"
          :theme="theme"
          :is-loading="loadingSave"
          @click="handleSave"
          >Add Post</CustomButton
        >
        <CustomButton
          class="page__content__buttons--cancel"
          theme="secondary"
          @click="handleToProfile"
          >Cancel</CustomButton
        >
        <span
          class="page__content__buttons--cancel--mobile button-1"
          @click="handleToProfile"
          >Cancel</span
        >
      </div>
    </div>
  </div>
</template>

<script>
import { debounce } from "lodash";
import CustomButton from "../../components/Common/CustomButton";
import BlogForm from "../../components/Page/blog/BlogForm";
import { generateFormDataBlog } from "../../utils/data";

export default {
  name: "NewBlog",
  components: {
    BlogForm,
    CustomButton,
  },
  middleware: ["auth"],
  data() {
    return {
      loadingSave: false,
      formData: {
        errors: {
          title: null,
          category: null,
        },
        blog: {
          title: "",
          file: null,
          selectsCategory: null,
          body: "",
        },
      },
    };
  },
  computed: {
    theme() {
      return "primary";
    },
    categories() {
      return this.$store.getters["blog/categories"];
    },
  },
  async mounted() {
    await this.$store.dispatch("blog/getCategoriesBlogs");
  },
  methods: {
    handleToProfile() {
      this.$router.push("/profile");
    },
    validate() {
      Object.values(this.formData.errors).forEach((key) => {
        this.formData.errors[key] = null;
      });
      let val = true;

      if (!this.formData.blog.title) {
        this.formData.errors.title = "Please enter a title of the blog.";
        val &= false;
      }

      if (!this.formData.blog.selectsCategory) {
        this.formData.errors.category = "Please select a category of the blog.";
        val &= false;
      }

      return val;
    },
    async handleSave() {
      this.loadingSave = true;

      if (!this.validate()) {
        this.loadingSave = false;
        if (this.formData.errors.title) {
          this.$refs.form.scrollToElem("title");
          return;
        }
        if (this.formData.errors.category) {
          this.$refs.form.scrollToElem("category");
          return;
        }
        return;
      }

      let data = {
        title: this.formData.blog.title,
        slug: this.formData.blog.selectsCategory.key,
        body: this.formData.blog.body,
      };

      if (this.formData.blog.file) data.image = this.formData.blog.file;
      let formData = generateFormDataBlog(data);
      try {
        let response = await this.$store.dispatch("blog/createBlog", formData);
        await this.$store.dispatch("user/getUserData");
        await this.$router.push(`/blogs/blog?slug=${response.slug}`);
      } catch (e) {}

      this.loadingSave = false;
    },
  },
};
</script>

<style lang="scss" scoped>
.page {
  width: calc(100% + #{$padding-with-width} * 2);
  margin-left: calc(0rem - $padding-with-width);
  padding: 8rem $padding-with-width 8.6875rem $padding-with-width;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  flex-direction: column;
  background-color: $primary-white;
  @include layout-mobile() {
    width: calc(100% + #{$padding-left-mobile} * 2);
    margin-left: calc(0rem - $padding-left-mobile);
    padding: mvw(80px) $padding-left-mobile;
  }
  &__header {
    display: flex;
    margin-bottom: 3rem;
    align-items: center;
    margin-right: auto;
    cursor: pointer;
    &:hover {
      opacity: 0.8;
    }
    &__button {
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      width: 2rem;
      border: 1.5px solid $primary-marigold;
      border-radius: 50%;
      height: 2rem;
      img {
        width: 1rem;
        height: 1rem;
        transform: rotate(180deg);
        @include layout-mobile() {
          width: mvw(16px);
          height: mvw(16px);
        }
      }
      @include layout-mobile() {
        width: mvw(32px);
        height: mvw(32px);
      }
    }
    span {
      font-size: 1rem;
      line-height: 1.5rem;
      font-weight: 600;
      margin-left: 0.5rem;
      @include layout-mobile() {
        font-size: mvw(16px);
        line-height: mvw(24px);
        margin-left: mvw(8px);
      }
    }
    @include layout-mobile() {
      margin-bottom: mvw(38px);
    }
  }
  &__content {
    width: 39.375rem;
    display: flex;
    flex-direction: column;
    @include layout-mobile() {
      width: 100%;
    }

    h1 {
      margin-bottom: 3rem;
      @include layout-mobile() {
        margin-bottom: mvw(32px);
      }
    }
    h4 {
      margin-top: 2rem;
      display: flex;
      margin-bottom: 1rem;
      @include layout-mobile() {
        margin-top: mvw(32px);
        margin-bottom: mvw(16px);
      }
      div {
        margin-left: 0.5rem;
      }
    }
    &__upload {
      margin-bottom: 3rem;
    }
    &__row {
      display: flex;
      margin-bottom: 1.5rem;
      @include layout-mobile() {
        flex-direction: column;
        margin-bottom: mvw(16px);
      }
      div:first-child {
        @include layout-mobile() {
          margin-bottom: mvw(16px);
        }
      }
      &--input {
        margin-right: 1.5rem;
        &:last-child {
          margin-right: 0;
        }
      }
      &--label {
        strong {
          color: #b00020;
        }
      }
      &--column {
        flex-direction: column;
      }
      &--checkbox {
        margin-top: 1.375rem;
      }
    }
    &__buttons {
      display: flex;
      margin-top: 3rem;
      @include layout-mobile() {
        flex-direction: column;
        align-items: center;
      }
      &--verified {
        margin-right: 1.5rem;
        width: 10.9375rem;
        @include layout-mobile() {
          width: 100%;
          padding: 0;
          margin: 0;
        }
      }
      &--cancel {
        display: flex;
        @include layout-mobile() {
          display: none;
        }
        &--mobile {
          border-bottom: 2px solid $primary-marigold;
          display: none;
          @include layout-mobile() {
            display: flex;
            width: mvw(58px);
            margin-top: mvw(24px);
          }
        }
      }
    }
  }
}
</style>

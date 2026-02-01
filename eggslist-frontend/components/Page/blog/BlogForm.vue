<template>
  <div>
    <UploadPhoto
      v-model="dataValue.blog.file"
      :preview="dataValue.blog.preview"
      class="form__content__upload"
      title="Upload a photo of your product"
      subtitle="Optimal size 1000x1000. Images will be cropped to a square."
    />
    <div class="form__content__row">
      <CustomInput
        id="title"
        v-model="dataValue.blog.title"
        :is-in-valid="Boolean(dataValue.errors.title)"
        :error-text="dataValue.errors.title"
        class="form__content__row--input"
        @focus="dataValue.errors.title = null"
        ><span slot="label" class="form__content__row--label"
          >Blog title <strong>*</strong>
        </span></CustomInput
      >
    </div>
    <div class="form__content__row">
      <CustomDropdown
        id="category"
        v-model="dataValue.blog.selectsCategory"
        class="form__content__row--input"
        :is-in-valid="Boolean(dataValue.errors.category)"
        :error-text="dataValue.errors.category"
        :selects="selectsCategory"
        @focus="dataValue.errors.category = null"
        ><span slot="label" class="form__content__row--label"
          >Category <strong>*</strong>
        </span></CustomDropdown
      >
    </div>
    <span slot="label" class="form__content__row--label"
      >Body <strong>*</strong>
    </span>
    <ckeditor
      ref="editor"
      v-model="dataValue.blog.body"
      :editor="editor"
      :config="editorConfig"
    ></ckeditor>
  </div>
</template>

<script>
import Editor from "../../../plugins/ckeditor/build/ckeditor";
import UploadPhoto from "../../Common/UploadPhoto";
import CustomInput from "../../Common/CustomInput";
import CustomDropdown from "../../Common/CustomDropdown";

export default {
  name: "BlogForm",
  components: {
    CustomInput,
    UploadPhoto,
    CustomDropdown,
  },
  props: {
    value: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      editor: Editor,
      editorConfig: {
        simpleUpload: {
          uploadUrl: `${this.$config.url}/blogs/blogs/ckeditor-upload`,
          withCredentials: true,
          headers: {
            Authorization: this.$axios.defaults.headers.common["Authorization"],
          },
        },
        toolbar: ["heading", "|", "undo", "redo", "|", "link", "uploadImage"],
        heading: {
          options: [
            {
              model: "paragraph",
              title: "Paragraph",
              class: "ck-heading_paragraph",
            },
            {
              model: "heading1",
              view: "h2",
              title: "Heading 1",
              class: "ck-heading_heading2",
            },
            {
              model: "heading2",
              view: "h5",
              title: "Heading 2",
              class: "ck-heading_heading5",
            },
          ],
        },
      },
    };
  },
  computed: {
    dataValue: {
      get() {
        return this.value;
      },
      set(value) {
        this.$emit("input", { ...value });
      },
    },
    categories() {
      return this.$store.getters["blog/categories"];
    },
    selectsCategory() {
      return this.categories.map((item) => ({
        key: item.slug,
        value: item.name,
      }));
    },
  },
  methods: {
    scrollToElem(refName) {
      var element = document.getElementById(refName);
      var top = element.offsetTop;

      window.scrollTo({ top: top - 200, behavior: "smooth" });
    },
  },
};
</script>

<style lang="scss">
.ck-editor__editable_inline {
  min-height: 200px;
}
</style>

<style lang="scss" scoped>
.form {
  scroll-behavior: smooth;
  display: flex;
  flex-direction: column;
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
  }
}
</style>

<template>
  <div class="page">
    <div class="page__header" @click="handleToProfile">
      <div class="page__header__button">
        <img src="@/assets/images/icons/arrow-forward.svg" />
      </div>
      <span> Profile</span>
    </div>
    <div class="page__content">
      <h1>Post a listing</h1>
      <FormListing v-model="formData"></FormListing>
      <div class="page__content__buttons">
        <CustomButton
          class="page__content__buttons--verified"
          :theme="theme"
          :is-loading="loadingSave"
          @click="handleSave"
          >Post a Listing</CustomButton
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
import FormListing from "../../components/Page/product/FormListing";

export default {
  name: "NewProduct",
  components: {
    FormListing,
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
          sub: null,
          price: null,
          description: null,
        },
        product: {
          title: "",
          file: null,
          delivery: false,
          pickup: false,
          selectsCategory: null,
          selectSub: null,
          price: null,
          description: "",
        },
      },
    };
  },
  computed: {
    theme() {
      return "primary";
    },
    categories() {
      return this.$store.getters["categories/categories"];
    },
  },
  async mounted() {
    await this.$store.dispatch("categories/getCategories");
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

      if (!this.formData.product.description) {
        this.formData.errors.description =
          "Please enter a description of the listing.";
        val &= false;
      }

      if (!this.formData.product.title) {
        this.formData.errors.title = "Please enter a title of the listing.";
        val &= false;
      }

      if (!this.formData.product.price) {
        this.formData.errors.price = "Please enter a price of the listing.";
        val &= false;
      }

      if (!this.formData.product.selectsCategory) {
        this.formData.errors.category =
          "Please select a category of the listing.";
        val &= false;
      }

      if (!this.formData.product.selectSub) {
        this.formData.errors.sub =
          "Please select a subcategory of the listing.";
        val &= false;
      }

      return val;
    },
    async handleSave() {
      this.loadingSave = true;

      if (!this.validate()) {
        this.loadingSave = false;
        return;
      }

      let data = {
        title: this.formData.product.title,
        delivery: this.formData.product.delivery,
        pickup: this.formData.product.pickup,
        price: this.formData.product.price,
        description: this.formData.product.description,
        subcategory: this.formData.product.selectSub.key,
      };

      if (this.formData.product.file) data.image = this.formData.product.file;
      try {
        let response = await this.$store.dispatch(
          "products/createProduct",
          data
        );
        await this.$router.push(`/catalog/product?slug=${response.slug}`);
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

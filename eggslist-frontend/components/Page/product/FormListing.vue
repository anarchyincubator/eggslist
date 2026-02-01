<template>
  <div>
    <UploadPhoto
      v-model="dataValue.product.file"
      :preview="dataValue.product.preview"
      class="form__content__upload"
      title="Upload a photo of your product"
      subtitle="Optimal size 1000x1000. Images will be cropped to a square."
    />
    <div class="form__content__row">
      <CustomInput
        v-model="dataValue.product.title"
        :is-in-valid="Boolean(dataValue.errors.title)"
        :error-text="dataValue.errors.title"
        class="form__content__row--input"
        @focus="dataValue.errors.title = null"
        ><span slot="label" class="form__content__row--label"
          >Listing title <strong>*</strong>
        </span></CustomInput
      >
    </div>
    <div class="form__content__row">
      <CustomDropdown
        v-model="dataValue.product.selectsCategory"
        class="form__content__row--input"
        :is-in-valid="Boolean(dataValue.errors.category)"
        :error-text="dataValue.errors.category"
        :selects="selectsCategory"
        @input="handleChangeCategory"
        @focus="dataValue.errors.category = null"
        ><span slot="label" class="form__content__row--label"
          >Category <strong>*</strong>
        </span></CustomDropdown
      >
    </div>
    <div class="form__content__row">
      <CustomDropdown
        v-model="dataValue.product.selectSub"
        :is-in-valid="Boolean(dataValue.errors.sub)"
        :error-text="dataValue.errors.sub"
        class="form__content__row--input"
        :selects="selectsSub"
        :is-lock="isLockSub"
        @focus="dataValue.errors.sub = null"
        ><span slot="label" class="form__content__row--label"
          >Subcategory <strong>*</strong>
        </span></CustomDropdown
      >
    </div>
    <div class="form__content__row">
      <CustomInput
        v-model="dataValue.product.price"
        type="number"
        :is-in-valid="Boolean(dataValue.errors.price)"
        :error-text="dataValue.errors.price"
        class="form__content__row--input"
        @focus="dataValue.errors.price = null"
        ><span slot="label" class="form__content__row--label"
          >Price <strong>*</strong>
        </span></CustomInput
      >
    </div>
    <div class="form__content__row">
      <CustomTextarea
        v-model="dataValue.product.description"
        class="form__content__row--input"
        :is-in-valid="Boolean(dataValue.errors.description)"
        :error-text="dataValue.errors.description"
        placeholder="Details about your product."
        @focus="dataValue.errors.description = null"
        ><span slot="label" class="form__content__row--label"
          >Description <strong>*</strong>
        </span></CustomTextarea
      >
    </div>
    <div class="form__content__row--column">
      <div class="label">Delivery options</div>
      <CustomCheckbox
        v-model="dataValue.product.pickup"
        class="form__content__row--checkbox"
      >
        Pickup
      </CustomCheckbox>
      <CustomCheckbox
        v-model="dataValue.product.delivery"
        class="form__content__row--checkbox"
      >
        Delivery
      </CustomCheckbox>
    </div>
  </div>
</template>

<script>
import UploadPhoto from "../../Common/UploadPhoto";
import CustomInput from "../../Common/CustomInput";
import CustomDropdown from "../../Common/CustomDropdown";
import CustomTextarea from "../../Common/CustomTextarea";
import CustomCheckbox from "../../Common/CustomCheckbox";
export default {
  name: "FormListing",
  components: {
    CustomCheckbox,
    CustomTextarea,
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
      return this.$store.getters["categories/categories"];
    },
    selectsCategory() {
      return this.categories.map((item) => ({
        key: item.name,
        value: item.name,
        obj: item.subs,
      }));
    },
    selectsSub() {
      if (
        this.dataValue.product.selectsCategory === null ||
        !this.dataValue.product.selectsCategory.obj
      )
        return [];
      return this.dataValue.product.selectsCategory.obj?.map((item) => ({
        key: item.slug,
        value: item.name,
      }));
    },
    isLockSub() {
      return this.dataValue.product.selectsCategory === null;
    },
  },
  methods: {
    handleChangeCategory() {
      this.dataValue.product.selectSub = null;
    },
  },
};
</script>

<style lang="scss" scoped>
.form {
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

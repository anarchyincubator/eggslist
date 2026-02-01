<template>
  <div>
    <div
      v-click-outside="handleClose"
      :class="['settings__edit', { 'settings__edit--active': isEditActive }]"
      @click="handleClickEdit"
    >
      <img
        class="settings__edit--settings"
        src="@/assets/images/icons/settings.svg"
      />
      <img
        class="settings__edit--dropdown"
        src="@/assets/images/icons/drop-down.svg"
      />
      <div v-if="isEditActive" class="settings__edit--popup">
        <p class="button-2" @click="handleEdit">Edit</p>
        <p class="button-2" @click="handleHide">
          {{ product.isHidden ? "Unhide" : "Hide" }}
        </p>
        <p class="button-2" @click="handleOut">
          {{ product.isOut ? "Mark as “In Stock”" : "Mark as “Out of Stock”" }}
        </p>
        <strong class="button-2" @click="handleDelete">Delete</strong>
      </div>
    </div>
    <ModalDeleteListing
      ref="delete"
      @delete="handleDeletedProduct"
    ></ModalDeleteListing>
  </div>
</template>

<script>
import ModalDeleteListing from "../Page/profile/ModalDeleteListing";
export default {
  name: "SettingsProduct",
  components: {
    ModalDeleteListing,
  },
  props: {
    product: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      isEditActive: false,
    };
  },
  methods: {
    handleEdit() {
      this.$router.push({
        path: "/product/edit",
        query: { slug: this.product.slug },
      });
    },
    async handleHide() {
      try {
        await this.$store.dispatch("products/updateProduct", {
          slug: this.product.slug,
          params: { is_hidden: !this.product.isHidden },
        });
        this.$emit("hide");
      } catch (e) {}
    },
    async handleOut() {
      try {
        await this.$store.dispatch("products/updateProduct", {
          slug: this.product.slug,
          params: { is_out_of_stock: !this.product.isOut },
        });
        this.$emit("out");
      } catch (e) {}
    },
    handleDelete() {
      this.$refs.delete.show(this.product);
    },
    handleDeletedProduct() {
      this.$router.push("/profile");
    },
    handleClickEdit() {
      this.isEditActive = !this.isEditActive;
    },
    handleClose() {
      this.isEditActive = false;
    },
  },
};
</script>

<style lang="scss" scoped>
.settings {
  &__edit {
    width: 4.875rem;
    height: 3rem;
    border-radius: 6.25rem;
    position: relative;
    background-color: $neutral-30;
    cursor: pointer;
    z-index: 10;
    box-sizing: border-box;
    padding: 0.875rem 1.0625rem 0.875rem 0.75rem;
    display: flex;
    align-items: center;
    @include layout-mobile() {
      width: mvw(68px);
      height: mvw(48px);
      border-radius: mvw(30px);
    }
    &:hover {
      opacity: 0.8;
      @include layout-mobile() {
        opacity: 1;
      }
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
      @include layout-mobile() {
        width: mvw(20px);
      }
    }

    &--dropdown {
      width: 0.625rem;
      @include layout-mobile() {
        width: mvw(10px);
      }
    }

    &--popup {
      position: absolute;
      display: flex;
      flex-direction: column;
      right: 0;
      background: $primary-white;
      box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
      border-radius: 0.75rem;
      width: 12.125rem;
      height: 7.9375rem;
      bottom: calc(-8.3125rem);
      padding: 1rem;
      box-sizing: border-box;
      z-index: 10;
      @include layout-mobile() {
        width: mvw(196px);
        padding: mvw(16px);
        height: mvw(156px);
        bottom: mvw(-164px);
      }
      p {
        margin-bottom: 0.75rem;
        cursor: pointer;
        font-size: 0.875rem;
        line-height: 1rem;
        @include layout-mobile() {
          font-size: mvw(14px);
          line-height: mvw(16px);
          margin-bottom: mvw(18px);
        }
        &:hover {
          opacity: 0.8;
        }
      }

      strong {
        cursor: pointer;
        color: #b00020;

        &:hover {
          opacity: 0.8;
        }
      }
    }
  }

  @include layout-mobile() {
    width: mvw(130px);
    height: mvw(130px);
    margin-bottom: mvw(16px);
    border-radius: mvw(15px);
  }
}
</style>

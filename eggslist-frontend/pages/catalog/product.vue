<template>
  <div class="page">
    <ModalPurchase ref="purchase" :product="product" />
    <div class="product-page">
      <div class="product-page__header" @click="handleGoMarket">
        <div class="product-page__button">
          <img src="@/assets/images/icons/arrow-forward.svg" />
        </div>
        <span>Market</span>
      </div>
      <transition name="fade" mode="in-out">
        <div v-if="product.isHidden" class="product-page__red">
          <img src="@/assets/images/icons/error.svg" />
          <span class="body-1">
            Other users can’t see your listing because it’s hidden.
          </span>
        </div>
      </transition>
      <div v-if="!loading" class="product-page__content">
        <div class="product-page__content--card">
          <img class="product-page__content--background" :src="product.image" />
          <SettingsProduct
            v-if="isMyProduct"
            :product="product"
            class="product-page__content--edit"
            @out="handleOut"
            @hide="handleHide"
            @delete="handleDelete"
          />
          <transition name="fade">
            <div
              v-if="product.isOut || product.isHidden"
              class="product-page__content--hover"
            />
          </transition>
          <div class="product-page__content--text">
            <div v-if="product.isOut" class="product-page__content--out">
              out of stock
            </div>
            <transition name="fade">
              <div v-if="product.isHidden" class="product-page__content--red">
                <img src="@/assets/images/icons/error.svg" />
                <span class="body-1">
                  Other users can’t see your listing because it’s hidden.
                </span>
              </div>
            </transition>
          </div>
          <transition name="fade">
            <div v-if="product.isHidden" class="product-page__content--hidden">
              <img src="@/assets/images/icons/visibility_off.svg" />
              <h3>Hidden</h3>
            </div>
          </transition>
        </div>
        <div class="product-page__description">
          <div class="product-page__description--cat" @click="goToSlug">
            {{ product.subName }}
          </div>
          <h2 class="product-page__description--title">
            {{ product.title }}
          </h2>

          <h3 class="product-page__description--price">${{ product.price }}</h3>
          <div class="product-page__description--desc body-2">
            {{ product.description }}
          </div>
          <div class="product-page__options">
            <p>Delivery options</p>
            <span>
              <img :src="getImgDeliver(product.allowPickup)" /> Pickup</span
            >
            <span>
              <img :src="getImgDeliver(product.allowDelivery)" /> Delivery</span
            >
          </div>
          <ProfileContact
            :slug="product.slug"
            :author="product.seller || {}"
            @contact-click="showModal"
          />
          <div v-if="false">
            <div class="product-page__border" />
            <CustomButton class="product-page__settings" theme="secondary"
              >Listing Settings</CustomButton
            >
          </div>
        </div>
      </div>
      <div v-else class="product-page__content">
        <SkeletonItem
          class="product-page__content--card"
          :height="41.25"
          :height-mobile="280"
          :width="41.25"
          :width-mobile="280"
          :border="1.875"
          :border-mobile="30"
        />
        <div class="product-page__description">
          <SkeletonItem
            class="product-page__description--cat"
            :height="1"
            :height-mobile="16"
            :width="6.25"
            :width-mobile="100"
          />
          <SkeletonItem
            class="product-page__description--title"
            :height="3"
            :height-mobile="32"
            :width="18.75"
            :width-mobile="200"
          />
          <SkeletonItem
            class="product-page__description--price"
            :height="2"
            :height-mobile="24"
            :width="10"
            :width-mobile="100"
          />
          <SkeletonItem
            class="product-page__description--desc body-2"
            :height="5"
            :height-mobile="100"
            :width="25"
            :width-mobile="280"
          />
          <SkeletonItem
            class="product-page__options"
            :height="5"
            :height-mobile="100"
            :width="10"
            :width-mobile="140"
          />
        </div>
      </div>
    </div>
    <div
      v-if="
        (product.moreProduct && product.moreProduct.length > 0) ||
        (product.alsoLike && product.alsoLike.length > 0)
      "
      class="page__lists"
    >
      <ProductList
        :items="product.moreProduct || []"
        :loading="loading"
        title="More From This Farm"
        class="page__lists--more"
        :link="`/profile?id=${product.seller?.id}`"
      ></ProductList>
      <ProductList
        :items="product.alsoLike || []"
        :loading="loading"
        :link="`/catalog?subcategory=${product.sub?.toLowerCase()}`"
        title="You May Also Like"
      ></ProductList>
    </div>
    <PopupProfile
      ref="popup"
      :seller="product.seller || {}"
      @changeFavorite="handleChangeFavourite"
    />
  </div>
</template>

<script>
import check from "@/assets/images/icons/check.svg";
import close from "@/assets/images/icons/close_dark.svg";
import SkeletonItem from "../../components/Common/SkeletonItem";
import ProductList from "../../components/Page/catalog/ProductList";
import ProfileContact from "../../components/Page/catalog/ProfileContact";
import PopupProfile from "../../components/Page/catalog/PopupProfile";
import CustomButton from "../../components/Common/CustomButton";
import SettingsProduct from "../../components/Common/SettingsListing";
import ModalPurchase from "../../components/Page/product/ModalPurchase";
export default {
  components: {
    ModalPurchase,
    SettingsProduct,
    CustomButton,
    PopupProfile,
    ProfileContact,
    ProductList,
    SkeletonItem,
  },
  data() {
    return {
      loading: true,
      product: {},
    };
  },
  computed: {
    isMyProduct() {
      return this.product?.seller.id === this.user?.id;
    },
    user() {
      return this.$store.getters["user/user"];
    },
  },
  watch: {
    "$route.query": {
      async handler(val) {
        window.scrollTo(0, 0);
        this.loading = true;
        const { product } = await this.$store.dispatch(
          "products/getProduct",
          val?.slug
        );
        this.product = product;
        this.loading = false;
      },
    },
  },
  async mounted() {
    const { product } = await this.$store.dispatch(
      "products/getProduct",
      this.$route.query.slug
    );
    this.product = { ...product };
    this.loading = false;

    if (this.$route.query["popup_purchase"]) {
      this.$refs.purchase.show();
    }
  },
  methods: {
    getImgDeliver(val) {
      return val ? check : close;
    },
    goToSlug() {
      this.$router.push(`/catalog?subcategory=${this.product.sub}`);
    },
    showModal() {
      this.$refs.popup.show();
    },
    handleGoMarket() {
      this.$router.push("/catalog");
    },
    handleOut() {
      this.product.isOut = !this.product.isOut;
    },
    handleHide() {
      this.product.isHidden = !this.product.isHidden;
    },
    handleDelete() {},
    async handleChangeFavourite() {
      this.product.seller.isFavourite = !this.product.seller.isFavourite;
      const { product } = await this.$store.dispatch(
        "products/getProduct",
        this.$route.query.slug
      );
      this.product = { ...product };
    },
  },
};
</script>

<style lang="scss" scoped>
.page {
  width: calc(100% + #{$padding-with-width} * 2);
  margin-left: calc(0rem - $padding-with-width);
  &__lists {
    padding: 8rem $padding-with-width;
    @include layout-mobile() {
      padding: mvw(64px) $padding-left-mobile;
    }
    &--more {
      margin-bottom: 8rem;
      @include layout-mobile() {
        margin-bottom: mvw(64px);
      }
    }
  }
  @include layout-mobile() {
    width: calc(100% + #{$padding-left-mobile} * 2);
    margin-left: calc(0rem - $padding-left-mobile);
  }
}
.product-page {
  background-color: $primary-white;
  padding: 8rem $padding-with-width 8.6875rem $padding-with-width;
  &__header {
    display: flex;
    margin-bottom: 3rem;
    align-items: center;
    cursor: pointer;
    &:hover {
      opacity: 0.8;
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
  &__border {
    width: 100%;
    height: 1px;
    background-color: $neutral-70;
    margin: 3rem 0;
  }
  &__settings {
    width: 100%;
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
  &__red {
    width: 100%;
    margin-top: mvw(-10px);
    margin-bottom: mvw(20px);
    box-sizing: border-box;
    align-items: flex-start;
    display: none;
    z-index: 7;
    span {
      color: #b00020;
    }
    img {
      width: mvw(20px);
      margin-top: mvw(8px);
      margin-right: mvw(10px);
    }
    @include layout-mobile() {
      display: flex;
    }
  }
  &__content {
    display: flex;
    &--background {
      width: 100%;
      height: 100%;
      position: absolute;
      border-radius: 1.875rem;
      @include layout-mobile() {
        border-radius: mvw(30px);
      }
    }
    &--edit {
      position: absolute;
      top: 1.6875rem;
      right: 1.6875rem;
      @include layout-mobile() {
        top: mvw(16px);
        right: mvw(16px);
      }
    }
    &--text {
      position: absolute;
      top: 1.6875rem;
      left: 1.6875rem;
      z-index: 7;
      @include layout-mobile() {
        top: mvw(16px);
        right: mvw(16px);
      }
    }
    &--out {
      border-radius: 6.25rem;
      background-color: $neutral-30;
      padding: 0.5rem 0.75rem;
      font-size: 0.75rem;
      line-height: 1rem;
      width: 8.125rem;
      box-sizing: border-box;
      flex-shrink: 0;
      margin-bottom: 1.5625rem;
      text-transform: uppercase;
      font-weight: 700;
      color: $primary-white;
      letter-spacing: 0.075rem;
      @include layout-mobile() {
        border-radius: mvw(100px);
        padding: mvw(8px) mvw(14px);
        font-size: mvw(12px);
        letter-spacing: mvw(1.2px);
        line-height: mvw(16px);
        width: mvw(130px);
      }
    }
    &--red {
      background: #f2e2ca;
      border-radius: 1.875rem;
      width: 25.625rem;
      padding: 1.25rem;
      box-sizing: border-box;
      align-items: flex-start;
      display: flex;
      z-index: 7;
      span {
        color: #b00020;
      }
      img {
        width: 1.25rem;
        margin-top: 0.5rem;
        margin-right: 0.625rem;
      }
      @include layout-mobile() {
        display: none;
      }
    }
    &--hidden {
      position: absolute;
      left: 50%;
      top: 50%;
      display: flex;
      align-items: center;
      flex-direction: column;
      justify-content: center;
      z-index: 5;
      translate: -50% -50%;
      img {
        width: 1.375rem;
        margin-bottom: 0.375rem;
        @include layout-mobile() {
          width: mvw(18px);
        }
      }
      h3 {
        height: auto;
      }
    }
    &--hover {
      background: linear-gradient(
        0deg,
        rgba(254, 243, 225, 0.6),
        rgba(254, 243, 225, 0.6)
      );
      width: 100%;
      height: 100%;
      z-index: 5;
      position: absolute;
    }
    &--card {
      position: relative;
      width: 41.25rem;
      height: 41.25rem;
      border-radius: 1.875rem;
      margin-right: 6.875rem;

      @include layout-mobile() {
        width: mvw(280px);
        height: mvw(280px);
        border-radius: mvw(30px);
        margin-right: 0;
        margin-bottom: mvw(48px);
      }
    }
    @include layout-mobile() {
      flex-direction: column;
    }
  }
  &__description {
    width: 25.5625rem;
    &--cat {
      color: $neutral-30;
      font-size: 0.875rem;
      line-height: 1rem;
      font-weight: 500;
      text-decoration-line: underline;
      margin-bottom: 0.5rem;
      cursor: pointer;
      @include layout-mobile() {
        font-size: mvw(14px);
        margin-bottom: mvw(8px);
        line-height: mvw(16px);
      }
    }
    &--title {
      margin-bottom: 1rem;
      @include layout-mobile() {
        margin-bottom: mvw(16px);
      }
    }
    &--price {
      color: $neutral-30;
      margin-bottom: 1rem;
      @include layout-mobile() {
        margin-bottom: mvw(16px);
      }
    }
    &--desc {
      margin-bottom: 1.5rem;
      @include layout-mobile() {
        margin-bottom: mvw(24px);
      }
    }
    @include layout-mobile() {
      width: 100%;
    }
  }
  &__options {
    display: flex;
    flex-direction: column;
    margin-bottom: 3rem;
    @include layout-mobile() {
      margin-bottom: mvw(48px);
    }
    p {
      margin: 0 0 0.5rem;
      font-weight: 700;
      text-transform: uppercase;
      font-size: 0.75rem;
      line-height: 1rem;
      letter-spacing: 1.2px;
      @include layout-mobile() {
        padding-bottom: mvw(8px);
        font-size: mvw(14px);
        line-height: mvw(16px);
      }
    }
    img {
      width: 1rem;
      margin-right: 0.625rem;
      @include layout-mobile() {
        width: mvw(14px);
        margin-right: mvw(10px);
      }
    }
    span {
      display: flex;
      align-items: center;
      margin-bottom: 0.5rem;
      font-size: 1rem;
      line-height: 1.5rem;
      @include layout-mobile() {
        margin-bottom: mvw(8px);
        line-height: mvw(24px);
        font-size: mvw(16px);
      }
    }
  }
  @include layout-mobile() {
    padding: mvw(68px) $padding-left-mobile;
  }
}
</style>

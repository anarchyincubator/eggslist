<template>
  <div class="page">
    <div class="header-container">
      <div class="header-container__back" @click="handleToProfile">
        <img src="@/assets/images/icons/arrow-back.svg" />
        Back To Profile
      </div>
      <h1>Payments</h1>
      <PatternTop class="header-container__bottom" />
    </div>
    <div class="page-container">
      <div v-if="!loading && results.length > 0">
        <div class="page-container__total">
          <span>Total Sales: ${{ total }}</span>
          <div class="page-container__dash button-1" @click="handleView">
            View Stripe Dashboard
            <div class="page-container__dash__icon">
              <img src="@/assets/images/icons/arrow-up-right.svg" />
            </div>
          </div>
        </div>
        <div class="page-container__border" />
        <div class="page-container__list">
          <div
            v-for="(item, index) in results"
            :key="index"
            class="page-container__item"
          >
            <div class="page-container__top">
              <h4
                class="page-container__top--title"
                @click="handleToProduct(item.product.slug)"
              >
                {{ item.product.title }}
              </h4>
              <PaymentType
                class="page-container__top--type"
                type="Success"
              ></PaymentType>
              <h4>${{ item.price }}</h4>
            </div>
            <p>{{ $dayjs(item.created).format("MM/DD/YY hh:mma") }}</p>
          </div>
          <div
            v-if="!isComplete && !loading"
            v-observe-visibility="visibilityChanged"
            class="page-container--pixel"
          ></div>
        </div>
      </div>
      <div v-else-if="!loading" class="page-container__not">
        <h3>No Payments</h3>
        <p class="body-1">No sales yet!</p>
        <CustomButton
          class="page-container__not-button"
          theme="primary"
          @click="handleToProfile"
        >
          To Profile</CustomButton
        >
      </div>
      <div v-else class="page-container__not">
        <SkeletonItem
          class="loading-item"
          :height="3.75"
          :height-mobile="16"
          :width="52.875"
          :width-mobile="256"
          :border="0"
          :border-mobile="0"
        />
        <SkeletonItem
          class="loading-item"
          :height="3.75"
          :height-mobile="16"
          :width="52.875"
          :width-mobile="256"
          :border="0"
          :border-mobile="0"
        />
        <SkeletonItem
          class="loading-item"
          :height="3.75"
          :height-mobile="16"
          :width="52.875"
          :width-mobile="256"
          :border="0"
          :border-mobile="0"
        />
        <SkeletonItem
          class="loading-item"
          :height="3.75"
          :height-mobile="16"
          :width="52.875"
          :width-mobile="256"
          :border="0"
          :border-mobile="0"
        />
      </div>
    </div>
  </div>
</template>

<script>
import SkeletonItem from "../components/Common/SkeletonItem";
import CustomButton from "../components/Common/CustomButton";
import PaymentType from "../components/Common/PaymentType";
import PatternTop from "../components/Page/index/PatternTop";
export default {
  name: "PaymentsPage",
  components: {
    PatternTop,
    PaymentType,
    CustomButton,
    SkeletonItem,
  },
  middleware: ["auth"],
  data() {
    return {
      page: 1,
      results: [],
      total: 0,
      loading: false,
      isVisible: false,
      isComplete: false,
    };
  },
  watch: {
    isVisible(newVal) {
      if (!newVal) return;

      if (this.isComplete) return;

      this.getPayment();
    },
  },
  async mounted() {
    this.loading = true;
    await this.getPayment();
    this.loading = false;
  },
  methods: {
    handleView() {
      window.open("https://dashboard.stripe.com/", "_blank");
    },
    handleToProduct(slug) {
      window.open(`/catalog/product?slug=${slug}`);
    },
    handleToProfile() {
      this.$router.push("/profile");
    },
    visibilityChanged(isVisible, entry) {
      this.isVisible = isVisible;
    },
    async getPayment() {
      const { total, results } = await this.$store.dispatch(
        "seller/getPayments",
        this.page
      );
      this.results.push(...results);

      if (results.length === 0) {
        this.isComplete = true;
        return;
      }
      this.page += 1;
      this.total = total;
    },
  },
};
</script>

<style lang="scss" scoped>
.loading-item {
  margin-bottom: 1.5rem;
}
.page {
  padding-bottom: 7.5rem;

  .header-container {
    background-color: $primary-black;
    padding-top: 10.5625rem;
    padding-bottom: 5rem;
    width: 100vw;
    margin-left: calc(0rem - $padding-with-width);
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
    @include layout-mobile() {
      margin-left: -$padding-left-mobile;
      padding-top: mvw(64px);
      padding-bottom: mvw(40px);
    }
    &__back {
      cursor: pointer;
      color: $primary-cream;
      font-size: 0.875rem;
      line-height: 1rem;
      font-weight: 600;
      margin-right: auto;
      margin-left: 12.625rem;
      img {
        width: 0.8125rem;
        margin-right: 0.5rem;
      }
      @include layout-mobile() {
        margin-right: auto;
        margin-left: $padding-left-mobile;
        margin-top: mvw(36px);
      }
    }
    h1 {
      color: $primary-marigold;
      margin-bottom: 2rem;
      @include layout-mobile() {
        width: mvw(280px);
        margin-top: mvw(44px);
        margin-bottom: mvw(16px);
        text-align: left;
      }
    }

    .body-1 {
      color: $primary-white;
      width: 53.125rem;
      text-align: center;
      @include layout-mobile() {
        width: auto;
        text-align: left;
        margin-left: $padding-left-mobile;
        padding-right: $padding-left-mobile;
      }
    }

    &__bottom {
      position: absolute;
      bottom: 0;
      width: 100%;
      height: 1.5rem;
      background-size: cover;
      @include layout-mobile() {
        height: mvw(40px);
        bottom: mvw(-20px);
        width: 101%;
        transform: scale(1);
      }
    }
  }

  &-container {
    padding: 5rem 12.8125rem 0 12.8125rem;
    @include layout-mobile() {
      padding: 0;
    }
    &__item {
      font-size: 1rem;
      line-height: 1.5rem;
      margin-bottom: 1.625rem;
    }
    &__top {
      display: flex;
      align-items: center;
      margin-bottom: 0.5rem;
      &--title {
        cursor: pointer;
        @include layout-mobile() {
          margin-right: auto;
          text-overflow: ellipsis;
          overflow: hidden;
          width: mvw(193px);
          white-space: nowrap;
        }
      }
      &--type {
        margin-right: auto;
        margin-left: 1.5rem;
        @include layout-mobile() {
          display: none;
        }
      }
    }
    &__not {
      display: flex;
      width: 32.125rem;
      margin-left: auto;
      margin-right: auto;
      align-items: center;
      text-align: center;
      flex-direction: column;
      @include layout-mobile() {
        width: 100%;
        margin-top: mvw(50px);
      }
      p {
        margin-top: 1rem;
        margin-bottom: 2rem;
        @include layout-mobile() {
          margin-top: mvw(16px);
          margin-bottom: mvw(32px);
        }
      }
      &-button {
        font-weight: 600;
        height: 3.5rem;
        @include layout-mobile() {
          height: mvw(56px);
          width: mvw(270px);
          margin-bottom: mvw(32px);
        }
      }
    }
    &__border {
      width: 100%;
      height: 1px;
      margin: 1.875rem 0 3rem 0;
      background-color: $neutral-70;
      @include layout-mobile() {
        margin-bottom: mvw(24px);
      }
    }
    &__total {
      display: flex;
      width: 100%;
      justify-content: space-between;
      align-items: center;
      @include layout-mobile() {
        flex-direction: column;
        align-items: start;
        margin-top: mvw(16px);
      }
    }
    &__dash {
      font-weight: 600;
      font-size: 1rem;
      line-height: 1.5rem;
      display: flex;
      align-items: center;
      cursor: pointer;
      @include layout-mobile() {
        font-size: mvw(16px);
        line-height: mvw(24px);
        margin-top: mvw(16px);
      }
      &__icon {
        border: 1.5px solid $primary-marigold;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        width: 2.25rem;
        height: 2.25rem;
        margin-left: 0.5rem;
        @include layout-mobile() {
          width: mvw(36px);
          height: mvw(36px);
          margin-left: mvw(8px);
          img {
            width: mvw(16px);
          }
        }
        img {
          width: 1rem;
        }
      }
    }
  }
}
</style>

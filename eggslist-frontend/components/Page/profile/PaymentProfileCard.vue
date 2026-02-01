<template>
  <div class="card__payment">
    <div class="card__payment__border" />
    <div class="card__payment__header">
      <h4>Recent Purchases</h4>
      <a
        v-if="!isLoading && recent.length > 0"
        class="card__payment__header__edit button-1"
        @click="handleClickPayment"
        >View All</a
      >
    </div>
    <div v-if="!isLoading && recent.length > 0" class="card__list">
      <div
        v-for="(item, index) in recent"
        :key="index"
        class="card__list__item"
      >
        <h5>{{ item.product.title }}</h5>
        <h5 class="right">${{ Number(item.price) }}</h5>
      </div>
      <a class="card__payment__edit button-1" @click="handleClickPayment"
        >View All</a
      >
    </div>
    <div v-else-if="!isLoading && recent.length === 0" class="card__list">
      <div class="card__list__item">
        <h5>No sales yet!</h5>
      </div>
    </div>
    <div v-else class="card__list">
      <SkeletonItem
        :height="1.5"
        class="card__list__item"
        :height-mobile="16"
        :width="15"
        :width-mobile="256"
        :border="0"
        :border-mobile="0"
      />
      <SkeletonItem
        :height="1.5"
        class="card__list__item"
        :height-mobile="16"
        :width="15"
        :width-mobile="256"
        :border="0"
        :border-mobile="0"
      />
    </div>
    <div class="card__payment__border card__payment__border-all" />
    <div class="card__payment__dash button-1" @click="handleView">
      View Stripe Dashboard
      <div class="card__payment__dash__icon">
        <img src="@/assets/images/icons/arrow-up-right.svg" />
      </div>
    </div>
  </div>
</template>

<script>
import SkeletonItem from "../../Common/SkeletonItem";
export default {
  name: "PaymentProfileCard",
  components: {
    SkeletonItem,
  },
  computed: {
    recent() {
      console.log(this.$store.getters["seller/recentTransactions"]);
      return this.$store.getters["seller/recentTransactions"];
    },
    isLoading() {
      return this.$store.state.seller.isLoadingRecent;
    },
  },
  methods: {
    handleClickPayment() {
      this.$router.push("/payments");
    },
    handleView() {
      window.open("https://dashboard.stripe.com/", "_blank");
    },
  },
};
</script>

<style lang="scss" scoped>
.card {
  &__list {
    width: 100%;
    display: flex;
    flex-direction: column;
    &__item {
      width: 100%;
      margin-bottom: 1rem;
      h5 {
        font-weight: 500;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        text-align: left;
        width: 70%;
      }
      .right {
        text-align: right;
      }
      display: flex;
      justify-content: space-between;
    }
  }
  &__payment {
    text-align: center;
    display: flex;
    flex-direction: column;
    padding: 2rem;
    align-items: flex-start;
    background-color: #f2e2ca;
    border-radius: 0.75rem;
    margin-top: 1rem;
    &__header {
      display: flex;
      align-items: center;
      margin-bottom: 1.5rem;
      width: 100%;
      &__edit {
        display: none;
        width: max-content;
        cursor: pointer;
        font-size: mvw(14px);
        box-sizing: border-box;
        margin-left: auto;
        border-bottom: 2px solid $primary-marigold;
        @include layout-mobile() {
          display: inherit;
        }
      }
    }
    h4 {
      align-self: start;
      @include layout-mobile() {
        align-self: center;
      }
    }
    &__edit {
      padding-bottom: 0.125rem;
      width: max-content;
      margin: 0.5rem 0 1.5rem 0;
      cursor: pointer;
      border-bottom: 2px solid $primary-marigold;
      @include layout-mobile() {
        display: none;
      }
    }
    &__dash {
      font-weight: 600;
      font-size: 1rem;
      line-height: 1.5rem;
      margin-top: 1.875rem;
      display: flex;
      align-items: center;
      cursor: pointer;
      @include layout-mobile() {
        font-size: mvw(16px);
        line-height: mvw(24px);
        margin-top: 0;
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
    &__border {
      width: 100%;
      height: 1px;
      background-color: $neutral-70;
      display: none;
      @include layout-mobile() {
        display: inherit;
        margin-bottom: mvw(24px);
      }
    }
    &__border-all {
      display: inherit;
      @include layout-mobile() {
        display: none;
      }
    }

    span {
      margin: 1rem 0;
    }

    @include layout-mobile() {
      margin: 0;
      background-color: transparent;
      padding: 0 mvw(32px) mvw(32px) mvw(32px);
    }
  }
}
</style>

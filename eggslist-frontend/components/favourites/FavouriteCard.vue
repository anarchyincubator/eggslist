<template>
  <div class="card" @click="goToProfile">
    <div class="card__avatar" :style="style">
      <h2 v-if="!seller.avatar">
        {{ seller.firstName && seller.firstName[0] }}
      </h2>
      <div class="card__avatar__heart">
        <img src="@/assets/images/icons/like.svg" />
      </div>
    </div>
    <div class="card__about">
      <h4>{{ seller.firstName }}</h4>
      <h6>
        <img src="@/assets/images/icons/map.svg" />{{ seller.location?.city }},
        {{ seller.location?.state }}
      </h6>
      <h6><img src="@/assets/images/icons/phone.svg" />{{ phoneNumber }}</h6>
      <div class="card__about__link" @click="goToProfile">View Listings</div>
    </div>
  </div>
</template>

<script>
export default {
  name: "FavouriteCard",
  props: {
    seller: {
      type: Object,
      required: true,
    },
  },
  computed: {
    phoneNumber() {
      let number = this.seller.phone;
      return (
        "(" +
        number.slice(2, 5) +
        ") " +
        number.slice(5, 8) +
        "-" +
        number.slice(8, 10) +
        number.slice(10, 12)
      );
    },
    style() {
      return {
        "background-image": `url(${this.seller.avatar})`,
      };
    },
  },
  methods: {
    goToProfile() {
      this.$router.push(`/profile?id=${this.seller.id}`);
    },
  },
};
</script>

<style lang="scss" scoped>
.card {
  display: flex;
  &__avatar {
    width: 9.375rem;
    height: 9.375rem;
    margin-right: 2rem;
    background-color: $neutral-70;
    background-size: cover;
    border-radius: 1.875rem;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    @include layout-mobile() {
      width: mvw(130px);
      height: mvw(130px);
      margin-right: mvw(20px);
      border-radius: mvw(15px);
    }
    &__heart {
      width: 2rem;
      position: absolute;
      right: 0.75rem;
      top: 0.75rem;
      display: flex;
      align-items: center;
      justify-content: center;
      background: $primary-black;
      border-radius: 50%;
      height: 2rem;
      @include layout-mobile() {
        width: mvw(32px);
        height: mvw(32px);
        right: mvw(12px);
        top: mvw(12px);
      }
      img {
        width: 0.8125rem;
        @include layout-mobile() {
          width: mvw(12px);
        }
      }
    }
  }
  &__about {
    width: 8.25rem;
    @include layout-mobile() {
      width: mvw(130px);
    }
    &__link {
      font-size: 1rem;
      line-height: 1.5rem;
      font-weight: 600;
      width: 6.5625rem;
      border-bottom: 0.125rem solid $primary-marigold;
      margin-top: 2rem;
      cursor: pointer;
      @include layout-mobile() {
        font-size: mvw(16px);
        line-height: mvw(24px);
        width: mvw(105px);
        margin-top: mvw(18px);
      }
    }
    h4 {
      margin-bottom: 0.5rem;
      @include layout-mobile() {
        margin-bottom: mvw(8px);
      }
    }
    h6 {
      display: flex;
      margin-bottom: 0.5rem;
      align-items: center;
      @include layout-mobile() {
        margin-bottom: mvw(8px);
      }
      img {
        width: 0.75rem;
        margin-right: 0.5rem;
        @include layout-mobile() {
          width: mvw(12px);
          margin-right: mvw(5px);
        }
      }
    }
  }
}
</style>

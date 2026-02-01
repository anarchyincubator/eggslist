<template>
  <div class="seller-card">
    <AvatarCard class="seller-card__avatar" :name="seller.firstName">
      <h1>{{ seller?.firstName[0] }}</h1>
    </AvatarCard>
    <div class="seller-card__info">
      <h2>{{ `${seller.firstName} ${seller.lastName}` }}</h2>
      <h4>
        <img src="@/assets/images/icons/map.svg" />{{
          seller.location?.zipcode
        }}, {{ seller.location?.city }}, {{ seller.location?.state }}
      </h4>
      <div class="seller-card__links">
        <nuxt-link class="button-1" :to="linkListings">
          View Listings</nuxt-link
        >
        <a class="button-1" @click="handleShow">Contact</a>
      </div>
    </div>
  </div>
</template>

<script>
import AvatarCard from "../Common/AvatarCard";
export default {
  name: "SellerCard",
  components: { AvatarCard },
  props: {
    seller: {
      type: Object,
      required: true,
    },
  },
  computed: {
    linkListings() {
      return `/profile?id=${this.seller.id}`;
    },
  },
  methods: {
    handleShow() {
      this.$emit("contact");
    },
  },
};
</script>

<style lang="scss" scoped>
.seller-card {
  width: 100%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  @include layout-mobile() {
    flex-direction: column;
    justify-content: center;
  }
  &__avatar {
    width: 13.75rem;
    height: 13.75rem;
    margin-right: 2rem;
    @include layout-mobile() {
      margin-right: 0;
      width: mvw(80px);
      height: mvw(80px);
      margin-bottom: mvw(20px);
    }
  }
  &__info {
    @include layout-mobile() {
      text-align: center;
    }
  }
  h4 {
    margin-top: 1rem;
    margin-bottom: 1.5rem;
    img {
      width: 0.875rem;
      margin-right: 0.4375rem;
      @include layout-mobile() {
        width: mvw(10px);
      }
    }
  }
  &__links {
    display: flex;
    a:first-child {
      margin-right: 1.5rem;
      @include layout-mobile() {
        margin-right: mvw(32px);
      }
    }
    a {
      cursor: pointer;
      border-bottom: 2px solid $primary-marigold;
      @include layout-mobile() {
        border-bottom: mvw(2px) solid $primary-marigold;
      }
    }
  }
}
</style>

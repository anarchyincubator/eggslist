<template>
  <div class="auth-profile">
    <ProfileCard
      v-if="!loading"
      :is-auth="false"
      class="auth-profile__card"
      :user="user"
      @changeFavorite="handleChangeFavourite"
    ></ProfileCard>
    <SkeletonItem
      v-else
      class="auth-profile__card"
      :height="31.25"
      :height-mobile="300"
      :width="20.625"
      :width-mobile="320"
      :border="0.75"
      :border-mobile="0"
    />
    <div class="auth-profile__second">
      <h2>Listings</h2>
      <div>
        <GuestListingsProfile
          class="auth-profile__listings"
          :loading="loading"
          :products="currentItems"
        ></GuestListingsProfile>
      </div>
      <div v-if="!loading">
        <div v-if="isEmptyListings" class="auth-profile__content">
          <div class="auth-profile__info">
            <h3>No listings yet.</h3>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ProfileCard from "./ProfileCard";
import GuestListingsProfile from "./GuestListingsProfile";
import SkeletonItem from "../../Common/SkeletonItem";
export default {
  name: "GuestProfile",
  components: {
    SkeletonItem,
    GuestListingsProfile,
    ProfileCard,
  },
  props: {
    id: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      loading: true,
      user: {},
      currentItems: [],
    };
  },
  computed: {
    isEmptyListings() {
      return this.currentItems.length === 0;
    },
  },
  async mounted() {
    let user = {};
    try {
      user = await this.$store.dispatch("user/getUserInfo", this.id);
    } catch (e) {
      await this.$router.push("/");
    }
    const { products } = await this.$store.dispatch(
      "products/getSellerProducts",
      this.id
    );
    this.user = { ...user };
    this.currentItems = [...products];
    this.loading = false;
  },
  methods: {
    async handleChangeFavourite() {
      this.user.isFavourite = !this.user.isFavourite;
      const { products } = await this.$store.dispatch(
        "products/getSellerProducts",
        this.user.id
      );
      this.currentItems = [...products];
    },
  },
};
</script>

<style lang="scss" scoped>
.auth-profile {
  display: flex;
  margin-bottom: 5.5rem;
  @include layout-mobile() {
    width: calc(100% + #{$padding-left-mobile} * 2);
    margin-left: -$padding-left-mobile;
    flex-direction: column;
    background-color: #f2e2ca;
  }
  &__card {
    flex-shrink: 0;
    margin-top: -10rem;
    @include layout-mobile() {
      margin-top: 0px;
    }
  }
  &__second {
    display: flex;
    width: 100%;
    margin-left: 6.875rem;
    flex-direction: column;
    margin-top: 2rem;
    @include layout-mobile() {
      margin-left: 0;
      padding: 0 $padding-left-mobile;
      box-sizing: border-box;
      margin-top: mvw(34px);
    }
  }
  &__info {
    margin: 6rem auto 0 auto;
    width: 32.125rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    @include layout-mobile() {
      margin-top: mvw(30px);
      width: auto;
    }
    .body-1 {
      margin-top: 1rem;
      text-align: center;
    }
    &--button {
      padding: 1rem 1.875rem;
      margin-top: 2rem;
      @include layout-mobile() {
      }
    }
  }
  &__listings {
    margin-top: 3rem;
  }
}
</style>

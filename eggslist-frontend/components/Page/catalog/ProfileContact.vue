<template>
  <div class="profile">
    <ModalSameId ref="same" />
    <div class="profile-header" @click="handleGoToProfile">
      <AvatarCard
        :avatar="author.avatar"
        :name="author.firstName"
        class="profile-header__avatar"
      >
        <h3>{{ author?.firstName[0] }}</h3>
      </AvatarCard>
      <div class="profile-header__name">
        <h4>
          {{ author.firstName }} {{ author.lastName }}
          <img
            v-if="author.isVerified"
            src="@/assets/images/icons/verified_dark.svg"
          />
        </h4>
        <h6>
          <img src="@/assets/images/icons/map.svg" />{{
            author.location?.zipcode
          }}, {{ author.location?.city }}, {{ author.location?.state }}
        </h6>
      </div>
    </div>
    <CustomButton
      v-if="!isStripe"
      class="profile__button"
      :is-large="true"
      theme="primary"
      :is-loading="loading"
      @click="handleClickButton"
      >Contact</CustomButton
    >
    <CustomButton
      v-else
      class="profile__button"
      :is-large="true"
      theme="primary"
      :is-loading="loadingPurchase"
      @click="handlePurchaseButton"
    >
      <div class="profile__button__content">
        Purchase
        <img
          class="profile__button-img"
          src="@/assets/images/icons/arrow-up-right.svg"
        />
      </div>
    </CustomButton>
    <a v-if="isStripe" @click="handleClickButton">Contact</a>
  </div>
</template>

<script>
import CustomButton from "../../Common/CustomButton";
import AvatarCard from "../../Common/AvatarCard";
import author from "../../../utils/adapters/Author";
import ModalSameId from "../product/ModalSameId";
export default {
  name: "ProfileContact",
  components: { ModalSameId, AvatarCard, CustomButton },
  props: {
    author: {
      type: Object,
      required: true,
    },
    slug: {
      type: String,
      required: true,
    },
  },
  emits: ["contact-click"],
  data() {
    return {
      loading: false,
      loadingPurchase: false,
    };
  },
  computed: {
    isStripe() {
      return this.author.isStripe;
    },
    user() {
      return this.$store.getters["user/user"];
    },
  },
  methods: {
    handleGoToProfile() {
      this.$router.push(`/profile?id=${this.author.id}`);
    },
    async handlePurchaseButton() {
      this.isAuth = !this.author.id || this.author.id === this.user?.id;

      if (this.isAuth) {
        this.$refs.same.show();
        return;
      }
      this.loadingPurchase = true;
      const resp = await this.$store.dispatch(
        "products/getProductPurchase",
        this.slug
      );
      this.loadingPurchase = false;
      window.open(resp, "_self");
    },
    async handleClickButton() {
      this.loading = true;
      try {
        await this.$store.dispatch("products/createContact", this.slug);
        this.$emit("contact-click");
      } catch (e) {}
      this.loading = false;
    },
  },
};
</script>

<style lang="scss" scoped>
.profile {
  background-color: #f2e2ca;
  border-radius: 0.75rem;
  padding: 2rem;
  width: 25.5625rem;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  @include layout-mobile() {
    border-radius: mvw(12px);
    width: 100%;
    padding: mvw(32px) mvw(24px);
  }
  &-header {
    display: flex;
    cursor: pointer;
    &:hover {
      h1,
      h4 {
        text-decoration: underline;
      }
    }
    &__avatar {
      width: 3.5rem;
      height: 3.5rem;
      margin-right: 1rem;
      h1 {
        font-size: 3px !important;
      }
      @include layout-mobile() {
        width: mvw(56px);
        height: mvw(56px);
        margin-right: mvw(16px);
      }
    }
    h4 {
      display: flex;
      align-items: center;
      img {
        width: 0.8125rem;
        margin-left: 0.3125rem;
        @include layout-mobile() {
          width: mvw(13px);
          margin-left: mvw(6px);
        }
      }
    }
    h6 {
      margin-top: 0.5rem;
      @include layout-mobile() {
        margin-top: mvw(10px);
      }
      img {
        width: 0.625rem;
        margin-right: 0.3125rem;
        @include layout-mobile() {
          width: mvw(10px);
          margin-right: mvw(6px);
        }
      }
    }
  }
  &__button {
    width: 100%;
    margin-bottom: 1rem;
    margin-top: 2.5rem;
    height: 3.5rem;
    @include layout-mobile() {
      height: mvw(56px);
      margin-top: mvw(40px);
      margin-bottom: mvw(16px);
    }
    &__content {
      display: flex;
      align-items: center;
    }
    &-img {
      height: 1rem;
      margin-left: 0.5rem;
    }
  }
  a {
    border-bottom: 2px solid $primary-marigold;
    padding-bottom: 0.0625rem;
    font-size: 1rem;
    line-height: 1.5rem;
    font-weight: 600;
    cursor: pointer;
    margin: 0 auto;
    @include layout-mobile() {
      padding-bottom: mvw(2px);
      font-size: mvw(16px);
      line-height: mvw(24px);
    }
  }
}
</style>

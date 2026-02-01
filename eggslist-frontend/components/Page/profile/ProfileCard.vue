<template>
  <div class="profile">
    <div class="profile__main">
      <SettingsProfile v-if="isAuth" class="profile__main__settings" />
      <AvatarCard :avatar="user.avatar" class="profile__main__avatar">
        <h1>{{ user?.firstName && user?.firstName[0] }}</h1>
      </AvatarCard>
      <div class="profile__main__name">
        <h4>{{ user.firstName }} {{ user.lastName }}</h4>
        <img
          v-if="user.isVerified"
          src="@/assets/images/icons/verified_dark.svg"
        />
      </div>
      <div v-if="user.location" class="profile__main__location">
        <img src="@/assets/images/icons/map.svg" />
        <span
          >{{ user.location?.zip_code }}, {{ user.location.city }},
          {{ user.location.state }}</span
        >
      </div>
      <div class="profile__main__date">
        Joined on {{ $dayjs(user.dateJoined).format("MM/DD/YY") }}
      </div>
      <nuxt-link
        v-if="isAuth"
        class="profile__main__edit button-1"
        to="/profile/edit"
        >Edit Profile</nuxt-link
      >
      <nuxt-link
        v-else-if="user.hasPostedBlogs"
        :to="`/blogs/filter?user-id=${user.id}`"
        class="profile__main__stories"
      >
        <span class="button-1">My Stories</span>
        <p><img src="@/assets/images/icons/arrow-forward.svg" /></p>
      </nuxt-link>
      <div
        v-if="user.phone || user.bio || !isAuth"
        class="profile__main__border"
      />
      <div v-if="user.phone" class="profile__main__phone">
        <p>phone number</p>
        <span>{{ phoneNumber }}</span>
      </div>
      <div v-if="user.email" class="profile__main__bio">
        <p>email</p>
        <span>{{ user.email }}</span>
      </div>
      <div v-if="user.bio" class="profile__main__bio">
        <p>bio</p>
        <span>{{ user.bio }}</span>
      </div>
      <CustomButton
        v-if="isAuthenticated && !user.isFavourite && !isAuth"
        class="profile__main__add"
        theme="primary"
        :is-loading="loadingButton"
        @click="handleAddFavourite"
      >
        <img
          src="@/assets/images/icons/favourite.svg"
          class="profile__main__add--icon"
        />
        Add To Favorites
      </CustomButton>
      <CustomButton
        v-if="isAuthenticated && user.isFavourite && !isAuth"
        class="profile__main__add"
        theme="primary"
        :is-loading="loadingButton"
        @click="handleAddFavourite"
      >
        <img
          src="@/assets/images/icons/favourite-full.svg"
          class="profile__main__add--icon"
        />
        Remove From Favorites
      </CustomButton>
    </div>
    <div v-if="isVerifiedLabel" class="profile__verified">
      <div class="profile__verified__border" />
      <h4>
        {{
          user.isVerifiedPending
            ? "Verification request pending."
            : "Become a verified seller!"
        }}
      </h4>
      <span class="body-2">
        {{
          user.isVerifiedPending
            ? "We are reviewing your information."
            : "Trust is important to us! We need some extra information to verify that you’re a real farm."
        }}
      </span>
      <nuxt-link
        v-if="!user.isVerifiedPending"
        to="/profile/verify"
        class="profile__verified__edit button-1"
        >Get verified</nuxt-link
      >
    </div>
    <div v-if="isVerifiedLabel" class="profile__payment">
      <div class="profile__story__border" />
      <h4>Allow online Payments for your customers</h4>
      <span class="body-2"
        >You need to become a verified seller before you can start accepting
        online payments.</span
      >
      <div class="profile__story__edit profile__story__not-allowed button-1">
        Set Up Online Payments
      </div>
    </div>
    <div
      v-else-if="isAuth && user.isVerified && !fullUser.isStriped"
      class="profile__payment"
    >
      <div class="profile__payment__border" />
      <h4>Allow online Payments for your customers</h4>
      <span class="body-2"
        >Please complete the Stripe registration to start selling online.</span
      >
      <a class="profile__payment__edit button-1" @click="handleClickPayment"
        >Set Up Online Payments</a
      >
    </div>
    <PaymentProfileCard
      v-else-if="isAuth && user.isVerified && fullUser.isStriped"
    />
   <div v-if="isAuth && user.isVerified" class="profile__story">
      <div class="profile__story__border" />
      <h4>Tell the community about your farm!</h4>
      <span v-if="!user.hasPostedBlogs" class="body-2"
        >We want to grow our virtual farmers market - tell us a little about
        what makes you special as a farm.</span
      >
      <a class="profile__story__edit button-1" @click="handleNewStory"
        >Write a story</a
      >
      <a
        v-if="user.hasPostedBlogs"
        class="profile__story__edit button-1"
        @click="handleToStories"
        >My Stories</a
      >
    </div>
  </div>
</template>

<script>
import PaymentProfileCard from "./PaymentProfileCard";
import CustomButton from "../../Common/CustomButton";
import SettingsProfile from "./SettingsProfile";
import AvatarCard from "../../Common/AvatarCard";
export default {
  name: "ProfileCard",
  components: { AvatarCard, SettingsProfile, PaymentProfileCard, CustomButton },
  props: {
    user: {
      type: Object,
      required: true,
    },
    isAuth: {
      type: Boolean,
      default: true,
    },
  },

  data() {
    return {
      loadingButton: false,
    };
  },
  computed: {
    fullUser() {
      if (!this.isAuth) return {};

      return this.$store.getters["user/fullUser"];
    },
    phoneNumber() {
      let number = this.user.phone;
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
    mainUser() {
      return this.$store.getters["user/user"];
    },
    isVerifiedLabel() {
      return this.isAuth && !this.user.isVerified;
    },
    isAuthenticated() {
      return this.$store.getters["auth/isAuthenticated"];
    },
  },
  async mounted() {
    if (!this.isAuth) return;

    if (!this.fullUser.isStriped) return;

    await this.$store.dispatch("seller/getRecentTransactions");
  },
  methods: {
    handleNewStory() {
      this.$router.push("/blogs/new");
    },
    handleToStories() {
      this.$router.push(`/blogs/filter?user-id=${this.mainUser.id}`);
    },
    async handleAddFavourite() {
      this.loadingButton = true;
      try {
        await this.$store.dispatch("user/changeFavouriteUser", this.user.id);
        this.$emit("changeFavorite");
      } catch (e) {}
      this.loadingButton = false;
    },
    async handleClickPayment() {
      const resp = await this.$store.dispatch("seller/getSpriteConnection");
      window.open(resp, "_self");
    },
  },
};
</script>

<style lang="scss" scoped>
.profile {
  width: 20.625rem;
  z-index: 20;
  @include layout-mobile() {
    width: 100%;
    z-index: 1;
    background-image: url("@/assets/images/noise.jpg");
    background-size: contain;
  }
  &__main {
    display: flex;
    flex-direction: column;
    padding: 2rem;
    background-color: #f2e2ca;
    align-items: center;
    border-radius: 0.75rem;
    position: relative;
    @include layout-mobile() {
      border-radius: 0;
      padding: mvw(32px);
      background-color: transparent;
    }
    &__settings {
      position: absolute;
      right: 1rem;
      top: 1rem;
    }
    &__avatar {
      width: 8.125rem;
      height: 8.125rem;
      flex-shrink: 0;
      @include layout-mobile() {
        width: mvw(80px);
        position: relative;
        z-index: 50;
        height: mvw(80px);
        margin-top: mvw(-70px);
      }
    }
    &__name {
      display: flex;
      justify-content: center;
      margin-top: 2rem;
      position: relative;
      img {
        width: 1rem;
        margin-left: 0.5625rem;
        @include layout-mobile() {
          width: mvw(16px);
          margin-left: auto;
          position: absolute;
          right: mvw(-25px);
          top: 50%;
          transform: translateY(-50%);
        }
      }
      h4 {
        text-align: center;
      }
      @include layout-mobile() {
        margin-top: mvw(16px);
        max-width: calc(100% - 2rem);
      }
    }
    &__location {
      display: flex;
      justify-content: center;
      margin-top: 0.5rem;
      img {
        width: 0.6875rem;
        margin-right: 0.375rem;
        @include layout-mobile() {
          width: mvw(9px);
          margin-right: mvw(5px);
        }
      }
      span {
        font-size: 0.875rem;
        line-height: 1.5rem;
        @include layout-mobile() {
          font-size: mvw(12px);
          line-height: mvw(16px);
        }
      }
    }
    &__edit {
      padding-bottom: 0.125rem;
      border-bottom: 2px solid $primary-marigold;
      @include layout-mobile() {
        margin-bottom: mvw(24px);
      }
    }
    &__border {
      width: 100%;
      height: 1px;
      background-color: $neutral-70;
      margin: 2rem 0;
      @include layout-mobile() {
        margin: 0 0;
        background-color: transparent;
      }
    }
    &__date {
      font-size: 0.875rem;
      line-height: 1.5rem;
      margin-top: 0.5rem;
      margin-bottom: 1.5rem;
      @include layout-mobile() {
        font-size: mvw(12px);
        line-height: mvw(16px);
        margin: mvw(8px) 0;
      }
    }
    &__phone,
    &__bio {
      align-self: baseline;
      @include layout-mobile() {
        align-self: center;
        text-align: center;
      }
      p {
        font-weight: 700;
        font-size: 0.75rem;
        letter-spacing: 1.2px;
        line-height: 1rem;
        text-transform: uppercase;
        margin: 0;
        margin-bottom: 0.25rem;
        @include layout-mobile() {
          font-size: mvw(12px);
          line-height: mvw(16px);
        }
      }
      span {
        font-size: 1rem;
        line-height: 1.5rem;
        @include layout-mobile() {
          font-size: mvw(16px);
          line-height: mvw(24px);
        }
      }
    }
    &__phone {
      @include layout-mobile() {
        margin-top: mvw(24px);
      }
    }
    &__bio {
      margin-top: 2rem;
      @include layout-mobile() {
        margin-bottom: 0;
        margin-top: mvw(30px);
      }
    }
    &__add {
      width: 100%;
      height: 3.5rem;
      margin-top: 2rem;
      &--icon {
        width: 1.25rem;
        margin-right: 0.625rem;
        @include layout-mobile() {
          width: mvw(20px);
          margin-right: mvw(10px);
        }
      }
      @include layout-mobile() {
        padding: 0 0;
        height: mvw(56px);
      }
    }
    &__stories {
      display: flex;
      align-items: center;
      p {
        width: 2.25rem;
        height: 2.25rem;
        border-radius: 50%;
        padding: 0.625rem;
        box-sizing: border-box;
        display: flex;
        align-items: center;
        border: 2px solid $primary-marigold;
        justify-content: center;
        margin-left: 0.5rem;
        img {
          width: 1rem;
        }
      }
      @include layout-mobile() {
        margin-bottom: mvw(24px);
      }
    }
  }
  &__verified,
  &__payment,
  &__story {
    text-align: center;
    display: flex;
    flex-direction: column;
    padding: 2rem;
    background-color: #f2e2ca;
    align-items: center;
    border-radius: 0.75rem;
    margin-top: 1rem;
    &__edit {
      padding-bottom: 0.125rem;
      border-bottom: 2px solid $primary-marigold;
      cursor: pointer;
    }
    &__not-allowed {
      color: $neutral-30;
      border-bottom: 2px solid $neutral-70;
      cursor: inherit;
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
    a {
      cursor: pointer;
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
  &__story {
    &__edit {
      margin-top: 1rem;
    }
    span {
      margin-bottom: 0;
    }
  }
}
</style>

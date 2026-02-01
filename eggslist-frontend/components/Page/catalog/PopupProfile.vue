<template>
  <transition name="fade">
    <div v-if="isShow" v-scroll-lock="isShow" class="modal">
      <div class="modal__background" @click="handleClose"></div>
      <div class="modal-profile">
        <div class="modal-profile__close" @click="handleClose">
          <img src="@/assets/images/icons/close_dark.svg" />
        </div>
        <div class="modal-profile__header">
          <AvatarCard
            class="modal-profile__header--avatar"
            :avatar="seller.avatar"
          >
            <h2>{{ seller?.firstName[0] }}</h2>
          </AvatarCard>
          <h3>
            {{ seller.firstName }} {{ seller.lastName }}
            <img
              v-if="seller.isVerified"
              class="modal-profile__header--verified"
              src="@/assets/images/icons/verified_dark.svg"
            />
          </h3>
        </div>
        <div class="modal-profile__location">location</div>
        <div class="modal-profile__city">
          {{ seller.location?.city }}, {{ seller.location?.state }}
        </div>
        <div v-if="phoneNumber" class="modal-profile__phone">phone number</div>
        <div v-if="phoneNumber" class="modal-profile__phone-number">
          {{ phoneNumber }}
        </div>
        <div class="modal-profile__phone">email</div>
        <div class="modal-profile__phone-number">{{ seller.email }}</div>
        <CustomButton
          class="modal-profile__button"
          theme="primary"
          @click="handleView"
        >
          View Profile
        </CustomButton>
        <CustomButton
          v-if="isAuth && !seller.isFavourite && seller.id !== user?.id"
          class="modal-profile__view"
          theme="secondary"
          :is-loading="loadingButton"
          @click="handleAddFavourite"
        >
          <img
            src="@/assets/images/icons/favourite.svg"
            class="modal-profile__view--icon"
          />
          Add To Favorites
        </CustomButton>
        <CustomButton
          v-else-if="isAuth && seller.id !== user?.id"
          class="modal-profile__view"
          :is-loading="loadingButton"
          theme="secondary"
          @click="handleAddFavourite"
        >
          <img
            src="@/assets/images/icons/favourite-full.svg"
            class="modal-profile__view--icon"
          />
          Remove From Favorites
        </CustomButton>
      </div>
    </div>
  </transition>
</template>

<script>
import CustomButton from "../../Common/CustomButton";
import AvatarCard from "../../Common/AvatarCard";
export default {
  name: "PopupProfile",
  components: { AvatarCard, CustomButton },
  props: {
    seller: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      isShow: false,
      loadingButton: false,
    };
  },
  computed: {
    user() {
      return this.$store.getters["user/user"];
    },
    isAuth() {
      return this.$store.getters["auth/isAuthenticated"];
    },
    phoneNumber() {
      if (!this.seller.phoneNumber) return null;

      let number = this.seller.phoneNumber;
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
  },
  methods: {
    show() {
      this.isShow = true;
    },
    handleClose() {
      this.isShow = false;
    },
    handleView() {
      this.$router.push(`/profile?id=${this.seller.id}`);
    },
    async handleAddFavourite() {
      this.loadingButton = true;
      try {
        await this.$store.dispatch("user/changeFavouriteUser", this.seller.id);
        this.$emit("changeFavorite");
      } catch (e) {}
      this.loadingButton = false;
    },
  },
};
</script>

<style lang="scss" scoped>
.modal {
  width: 100%;
  height: 100%;
  position: fixed;
  left: 0;
  top: 0;
  z-index: 1000;
  &__background {
    position: absolute;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.8);
  }
  &-profile {
    width: 25.5625rem;
    background-color: $primary-cream;
    border-radius: 0.75rem;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    padding: 3rem 2rem;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    align-items: center;
    @include layout-mobile() {
      border-radius: 0;
      width: 100%;
      padding: mvw(32px) mvw(24px);
    }
    &__close {
      width: 2rem;
      height: 2rem;
      position: absolute;
      cursor: pointer;
      right: 1rem;
      top: 1.5rem;
      @include layout-mobile() {
        right: mvw(16px);
        top: mvw(24px);
        width: mvw(32px);
        height: mvw(32px);
      }
      img {
        width: 0.875rem;
        @include layout-mobile() {
          width: mvw(12px);
        }
      }
    }
    &__header {
      display: flex;
      align-items: center;
      flex-direction: column;
      margin-bottom: 2.25rem;
      @include layout-mobile() {
        margin-bottom: mvw(16px);
      }
      &--avatar {
        width: 6.25rem;
        height: 6.25rem;
        border-radius: 50%;
        @include layout-mobile() {
          width: mvw(72px);
          height: mvw(72px);
        }
      }
      h3 {
        display: flex;
        margin-top: 1.5rem;
        align-items: center;
        justify-content: center;
        text-align: center;
        @include layout-mobile() {
          margin-top: mvw(16px);
        }
      }
      &--verified {
        margin-left: 0.625rem;
        width: 1.25rem;
        @include layout-mobile() {
          width: mvw(13px);
          margin-left: mvw(10px);
        }
      }
    }
    &__location,
    &__phone {
      font-size: 0.75rem;
      font-weight: 700;
      text-transform: uppercase;
      line-height: 1rem;
      letter-spacing: 1.2px;
      @include layout-mobile() {
        font-size: mvw(12px);
        line-height: mvw(16px);
        letter-spacing: mvw(1.2px);
      }
    }
    &__city {
      font-size: 1rem;
      line-height: 1.5rem;
      margin-bottom: 1.5rem;
      @include layout-mobile() {
        font-size: mvw(16px);
        line-height: mvw(24px);
        margin-bottom: mvw(16px);
      }
    }
    &__phone-number {
      line-height: 1.5rem;
      font-size: 1rem;
      @include layout-mobile() {
        font-size: mvw(16px);
        line-height: mvw(24px);
      }
    }
    &__button {
      margin-top: 2.25rem;
      width: 100%;
      height: 3.5rem;
      margin-bottom: 1rem;
      @include layout-mobile() {
        height: mvw(56px);
        margin-bottom: mvw(16px);
        padding: 0 0;
      }
    }
    &__view {
      width: 100%;
      height: 3.5rem;
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
  }
}
</style>

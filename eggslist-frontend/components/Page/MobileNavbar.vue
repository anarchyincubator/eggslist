<template>
  <div
    v-scroll-lock="opened"
    class="navbar-container"
    :class="{ 'navbar-container--opened': opened }"
  >
    <div class="navbar-container__top">
      <img src="@/assets/images/icons/logo_dark.svg" @click="handleGoMain" />
      <TheHamburger v-model="opened" />
    </div>
    <div v-if="opened" class="navbar-container-opened">
      <nuxt-link class="ceil menu-1" to="/catalog" @click.native="handleClose">
        Market
      </nuxt-link>
      <nuxt-link class="ceil menu-1" to="/about" @click.native="handleClose">
        About
      </nuxt-link>
      <nuxt-link class="ceil menu-1" to="/blogs" @click.native="handleClose">
        Our stories
      </nuxt-link>
      <div
        v-if="!isAuthenticated"
        class="ceil menu-1"
        @click="handleClickLogin"
      >
        Login
      </div>
      <nuxt-link
        v-else
        class="ceil menu-1"
        to="/favorites"
        @click.native="handleClose"
        >Favorite Farmers</nuxt-link
      >
      <div v-if="isAuthenticated" class="navbar-container__line" />
      <div
        v-if="isAuthenticated"
        class="navbar-container__avatar ceil"
        @click="handleProfile"
      >
        <AvatarCard :avatar="user?.avatar" class="avatar">
          <h4>{{ user?.firstName && user?.firstName[0] }}</h4>
        </AvatarCard>
        <span class="menu-1"> {{ user.firstName }}</span>
      </div>
      <CustomButton
        theme="primary"
        class="navbar-container__button button-2"
        @click="handlePost"
      >
        Post A Listing
      </CustomButton>
      <CustomButton
        v-if="isAuthenticated && user.isVerified"
        theme="secondary"
        class="navbar-container__button--bottom button-2"
        @click="handleNewStory"
      >
        Write a Story
      </CustomButton>
      <div v-if="isAuthenticated">
        <ModalConfirmEmail ref="confirm" />
        <ModalEditProfile ref="edit" />
      </div>
    </div>
  </div>
</template>

<script>
import CustomButton from "../Common/CustomButton.vue";
import AvatarCard from "../Common/AvatarCard.vue";
import TheHamburger from "../Common/TheHamburger.vue";
import ModalConfirmEmail from "./profile/ModalConfirmEmail";
import ModalEditProfile from "./profile/ModalEditProfile";
export default {
  name: "MobileNavbar",
  components: {
    TheHamburger,
    CustomButton,
    ModalConfirmEmail,
    ModalEditProfile,
    AvatarCard,
  },
  data() {
    return {
      opened: false,
    };
  },
  computed: {
    isAuthenticated() {
      return this.$store.getters["auth/isAuthenticated"];
    },
    user() {
      return this.$store.getters["user/user"];
    },
  },
  methods: {
    handleClickLogin() {
      this.$store.commit("setAuthComponent", true);
      this.opened = false;
    },
    handleNewStory() {
      this.$router.push("/blogs/new");
      this.handleClose();
    },
    handleGoMain() {
      this.$router.push("/");
    },
    handleClose() {
      this.opened = false;
    },
    handleProfile() {
      this.$router.push("/profile");
      this.handleClose();
    },
    handlePost() {
      if (!this.user.isEmail) {
        this.$refs.confirm.show();
        return;
      }
      if (!this.user.phone || !this.user.location) {
        this.$refs.edit.show();
        return;
      }
      this.$router.push("/product/new");
      this.handleClose();
    },
  },
};
</script>

<style lang="scss" scoped>
$height-top: mvw(60px);
$padding-bottom: mvw(32px);
.ceil {
  width: 100%;
  height: mvw(56px);
  display: flex;
  align-items: center;
}
.navbar-container {
  position: fixed;
  z-index: 50;
  background: $primary-white;
  margin-left: -$padding-left-mobile;
  padding: 0 $padding-left-mobile;
  width: calc(100% - #{$padding-left-mobile} * 2);
  &--opened {
    height: 100%;
  }
  &__top {
    width: 100%;
    display: flex;
    padding: mvw(18px) 0;
    align-items: center;
    img {
      width: mvw(102px);
      margin-right: auto;
    }
  }
  &-opened {
    display: flex;
    height: calc(100% - #{$height-top} - #{$padding-bottom});
    flex-direction: column;
  }
  &__no-auth {
    display: flex;
    flex-direction: column;
  }
  &__button {
    margin-top: auto;
    &--bottom {
      margin-top: mvw(10px);
    }
  }
  &__line {
    border: 1px solid #d5bb91;
    margin: mvw(8px) 0;
  }
  &__avatar {
    display: flex;
    .avatar {
      width: mvw(32px);
      cursor: pointer;
      height: mvw(32px);
      margin-right: mvw(8px);
      h4 {
        color: #282220;
      }
    }
  }
}
</style>

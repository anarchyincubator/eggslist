<template>
  <div
    v-click-outside="handleClose"
    :class="['settings', { 'settings--opened': isOpened }]"
    @click="handleClick"
  >
    <img class="settings__icon" :src="iconPath" />
    <svg
      class="settings__dropdown"
      viewBox="0 0 10 5"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M0 0L5 5L10 0H0Z" :fill="colorStyle" />
    </svg>
    <div v-if="isOpened" class="settings__popup">
      <p class="button-1" @click="handleChangePassword">Change Password</p>
      <p class="button-1" @click="handleChangeEmail">Change Email</p>
      <p class="button-1" @click="handleLogout">Sign out</p>
    </div>
  </div>
</template>

<script>
import settings__dark from "@/assets/images/icons/settings_dark.svg";
import settings from "@/assets/images/icons/settings.svg";
export default {
  name: "SettingsProfile",
  data() {
    return {
      isOpened: false,
    };
  },
  computed: {
    colorStyle() {
      return this.isOpened ? "#FEF3E1" : "#282220";
    },
    iconPath() {
      return this.isOpened ? settings : settings__dark;
    },
  },
  methods: {
    handleClick() {
      this.isOpened = !this.isOpened;
    },
    handleClose() {
      this.isOpened = false;
    },
    handleChangeEmail() {
      this.$router.push("/profile/change-email");
    },
    handleChangePassword() {
      this.$router.push("/profile/change-password");
    },
    async handleLogout() {
      await this.$router.push("/");
      await this.$store.dispatch("auth/clearToken");
      await this.$store.commit("user/clearUser");
    },
  },
};
</script>

<style lang="scss" scoped>
.settings {
  position: relative;
  height: 3rem;
  border-radius: 6.25rem;
  background-color: $neutral-70;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  width: 4rem;
  z-index: 10;
  transition: background-color 0.5s;
  @include layout-mobile() {
    width: mvw(64px);
    height: mvw(48px);
    border-radius: mvw(100px);
  }
  &--opened {
    background-color: $primary-black;
  }
  &__icon {
    width: 1rem;
    margin-right: 0.5rem;
    @include layout-mobile() {
      width: mvw(16px);
      margin-right: mvw(8px);
    }
  }
  &__dropdown {
    width: 0.5rem;
    @include layout-mobile() {
      width: mvw(8px);
    }
  }
  &__popup {
    position: absolute;
    height: 11.5rem;
    width: 13.25rem;
    border-radius: 0.75rem;
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    padding: 2rem;
    top: 4rem;
    z-index: 15;
    left: -9.25rem;
    background-color: $primary-white;
    @include layout-mobile() {
      width: mvw(212px);
      height: mvw(202px);
      border-radius: mvw(12px);
      padding: mvw(30px);
      left: mvw(-150px);
      top: mvw(64px);
    }
    p {
      margin: 0;
      margin-bottom: 1.5rem;
      &:last-child {
        margin-bottom: 0;
      }
      &:hover {
        opacity: 0.7;
      }
      @include layout-mobile() {
        margin-bottom: mvw(24px);
      }
    }
  }
}
</style>

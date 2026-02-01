<template>
  <div class="auth-profile">
    <ModalDeleteListing
      ref="modal-delete"
      @delete="getActualItems"
    ></ModalDeleteListing>
    <ProfileCard class="auth-profile__card" :user="user"></ProfileCard>
    <div class="auth-profile__second">
      <h2>Listings</h2>
      <div ref="tabs" class="auth-profile__tabs">
        <div
          :class="[
            'auth-profile__tabs--tab',
            { 'auth-profile__tabs--tab--active': isMyListings },
          ]"
          @click="handleChangeTab('my')"
        >
          My listings
        </div>
        <div
          :class="[
            'auth-profile__tabs--tab',
            { 'auth-profile__tabs--tab--active': isHidden },
          ]"
          @click="handleChangeTab('hidden')"
        >
          My Hidden Listings
        </div>
        <div
          :class="[
            'auth-profile__tabs--tab',
            { 'auth-profile__tabs--tab--active': isRecently },
          ]"
          @click="handleChangeTab('recently')"
        >
          Recently viewed
        </div>
      </div>
      <div v-if="((loading || !isEmptyListings) && user.isEmail) || isRecently">
        <ListingsProfile
          class="auth-profile__listings"
          :loading="loading"
          :is-edit="isMyListings || isHidden"
          :products="currentItems"
          @hide-item="handleHide"
          @out-item="handleOut"
          @delete-item="handleDelete"
        ></ListingsProfile>
        <ThePagination
          v-if="!loading && !isRecently && totalPage > 1"
          v-model="currentPage"
          class="page__container__pagination"
          :pages="totalPage"
          @input="handleChangePagination"
        ></ThePagination>
      </div>
      <div v-else>
        <div v-if="!user.isEmail" class="auth-profile__content">
          <div class="auth-profile__info">
            <h3>Confirm your email</h3>
            <span class="body-1"
              >Confirm your email to access full Eggslist functionality.</span
            >
            <CustomButton
              v-if="!sendVerify"
              class="auth-profile__info--button"
              theme="primary"
              :is-loading="loadingButton"
              @click="handleResendEmail"
              >Resend email</CustomButton
            >
          </div>
        </div>
        <div v-else-if="isNeedInfo" class="auth-profile__content">
          <div class="auth-profile__info">
            <h3>Do you want to start selling?</h3>
            <span class="body-1">Add your contact info and location!</span>
            <CustomButton
              class="auth-profile__info--button"
              theme="primary"
              @click="handleEditPush"
              >Edit profile</CustomButton
            >
          </div>
        </div>
        <div v-else-if="isEmptyListings" class="auth-profile__content">
          <div class="auth-profile__info">
            <h3>{{ textNoListings }}</h3>
            <CustomButton
              v-if="isMyListings"
              class="auth-profile__info--button"
              theme="primary"
              @click="handlePostlisting"
              >Post a listing</CustomButton
            >
            <CustomButton
              v-if="isRecently"
              class="auth-profile__info--button"
              theme="primary"
              @click="handleCatalog"
              >Give it a try!
            </CustomButton>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ThePagination from "../../Common/ThePagination";
import ProfileCard from "./ProfileCard";
import CustomButton from "../../Common/CustomButton";
import ListingsProfile from "./ListingsProfile";
import ModalDeleteListing from "./ModalDeleteListing";
export default {
  name: "AuthProfile",
  components: {
    ModalDeleteListing,
    ListingsProfile,
    CustomButton,
    ProfileCard,
    ThePagination,
  },
  data() {
    return {
      currentTab: "my",
      currentPage: 1,
      totalPage: 0,
      loading: true,
      currentItems: [],
      loadingButton: false,
      sendVerify: false,
    };
  },
  computed: {
    user() {
      return this.$store.getters["user/user"];
    },
    isMyListings() {
      return this.currentTab === "my";
    },
    isRecently() {
      return this.currentTab === "recently";
    },
    isHidden() {
      return this.currentTab === "hidden";
    },
    isEmptyListings() {
      return this.currentItems.length === 0;
    },
    isNeedInfo() {
      return !this.user.phone || !this.user.location;
    },
    textNoListings() {
      if (this.isMyListings) return "No listings yet.";
      if (this.isHidden) return "There are no hidden listings in your farm";
      return "Haven't Explore Our Catalog Yet?";
    },
    windowWidth() {
      return this.$store.state["windowWidth"];
    },
  },
  async mounted() {
    await this.getActualItems();
  },
  methods: {
    handleDelete(item) {
      this.$refs["modal-delete"].show(item);
    },
    handleEditPush() {
      this.$router.push("/profile/edit");
    },
    getOffset(size) {
      return (size * this.windowWidth) / 320;
    },
    async handleResendEmail() {
      this.loadingButton = true;
      try {
        await this.$store.dispatch("auth/sendEmailVerify");
        this.loadingButton = false;
        this.sendVerify = true;
      } catch (e) {
        this.loadingButton = false;
      }
    },
    handlePostlisting() {
      this.$router.push("/product/new");
    },
    async handleChangeTab(tab) {
      this.currentTab = tab;
      this.currentPage = 1;
      await this.getActualItems();
    },
    async handleChangePagination() {
      await this.getActualItems();
    },
    handleCatalog() {
      this.$router.push("/catalog");
    },
    async handleHide(it) {
      try {
        await this.$store.dispatch("products/updateProduct", {
          slug: it.slug,
          params: { is_hidden: !it.isHidden },
        });
        await this.getActualItems();
      } catch (e) {}
    },
    async handleOut(it) {
      try {
        await this.$store.dispatch("products/updateProduct", {
          slug: it.slug,
          params: { is_out_of_stock: !it.isOut },
        });
        this.currentItems.find(({ slug }) => it.slug === slug).isOut =
          !it.isOut;
      } catch (e) {}
    },
    async getActualItems() {
      this.loading = true;

      if (this.isMyListings) {
        const { products, totalPage, count } = await this.$store.dispatch(
          "products/getMyProducts",
          this.currentPage
        );
        this.loading = false;
        this.totalPage = totalPage;
        this.currentItems = [...products];
        this.$refs.tabs?.scrollTo(0, 0);
        return;
      }
      if (this.isHidden) {
        const { products, totalPage, count } = await this.$store.dispatch(
          "products/getMyHiddenProducts",
          this.currentPage
        );
        this.loading = false;
        this.totalPage = totalPage;
        this.currentItems = [...products];
        this.$refs.tabs?.scrollTo(this.getOffset(50), 0);
        return;
      }
      if (this.isRecently) {
        const { products, totalPage, count } = await this.$store.dispatch(
          "products/getRecentProducts"
        );
        this.$refs.tabs?.scrollTo(this.getOffset(100), 0);
        this.currentItems = [...products];
        this.loading = false;
        return;
      }
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
      margin-top: mvw(-40px);
      margin-top: 0px;
    }
  }
  &__second {
    display: flex;
    width: 100%;
    margin-left: 6.875rem;
    flex-direction: column;
    @include layout-mobile() {
      margin-left: 0;
      padding: 0 $padding-left-mobile;
      margin-top: mvw(64px);
      width: calc(100% - #{$padding-left-mobile} * 2);
    }
    h2 {
      display: none;
      @include layout-mobile() {
        display: inherit;
        margin-bottom: mvw(16px);
      }
    }
  }
  &__tabs {
    display: flex;
    @include layout-mobile() {
      overflow-x: scroll;
      scroll-behavior: smooth;
      padding-right: $padding-left-mobile;
    }
    &--tab {
      width: 10.375rem;
      height: 3rem;
      border: 1.5px solid $neutral-70;
      border-radius: 6.25rem;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 600;
      font-size: 0.875rem;
      line-height: 1rem;
      box-sizing: border-box;
      margin-right: 1.5rem;
      cursor: pointer;
      transition: 0.5s all;
      @include layout-mobile() {
        width: max-content;
        font-size: mvw(14px);
        white-space: nowrap;
        font-weight: mvw(16px);
        border-width: 0;
        box-sizing: border-box;
        height: mvw(32px);
        padding: 0;
      }
      &--active {
        background-color: $primary-black;
        color: $primary-cream;
        border: 1.5px solid $primary-black;
        @include layout-mobile() {
          padding: 0 mvw(12px);
          border-width: 0;
        }
      }
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
      margin-top: mvw(60px);
      width: auto;
      box-sizing: border-box;
    }
    .body-1 {
      margin-top: 1rem;
      text-align: center;
    }
    &--button {
      padding: 1rem 1.875rem;
      margin-top: 2rem;
      min-width: 9.0625rem;
      @include layout-mobile() {
      }
    }
  }
  &__listings {
    margin-top: 3rem;
  }
}
</style>

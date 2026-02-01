<template>
  <div class="page">
    <PopupProfile ref="modal" :seller="blog.author || {}" />
    <div class="header-container">
      <div class="page__header" @click="handleToBlogs">
        <div class="page__header__button">
          <img src="@/assets/images/icons/arrow-forward.svg" />
        </div>
        <span> All Stories</span>
      </div>
      <div class="header-container__body">
        <SkeletonItem
          v-if="loading"
          :height="8"
          :height-mobile="88"
          :width="45.625"
          :width-mobile="280"
          class="header-container__left header-container__left--alone"
        ></SkeletonItem>
        <div
          v-else
          :class="[
            'header-container__left',
            { 'header-container__left--alone': !blog.image },
          ]"
        >
          <h5>{{ blog.category?.name }}</h5>
          <h1>{{ blog.title }}</h1>
          <div class="header-container__sub">
            <h5>By {{ blog.author?.firstName }} {{ blog.author?.lastName }}</h5>
            <div class="header-container__line" />
            <div class="body-2">
              {{ $dayjs(blog.dateCreated).format("MMMM DD, YYYY") }}
            </div>
          </div>
        </div>
        <img
          v-if="blog.image"
          class="header-container__right"
          :src="blog.image"
        />
      </div>
      <PatternTop class="header-container__bottom" />
    </div>
    <div v-if="!loading" class="blog__container">
      <div class="blog__container__body" v-html="blog.body"></div>
      <SellerCard
        v-if="!loading"
        class="blog__container__card"
        :seller="blog.author"
        @contact="handleShowPopup"
      />
      <div class="blog__container__line" />
      <ShareItems
        v-if="!loading"
        class="blog__container__share"
        :title="blog.title"
      />
    </div>
    <SkeletonItem
      v-else
      :height="25"
      :height-mobile="168"
      :width="45.625"
      :width-mobile="280"
      class="blog__container blog__container__loading"
    ></SkeletonItem>
    <div v-if="!loading" class="blog__bottom">
      <BlogsRelated
        :blogs="blog.similarBlogs"
        title="Related Stories"
        :link="linkToRelated"
        :loading="loading"
      />
    </div>
  </div>
</template>

<script>
import PatternTop from "../../components/Page/index/PatternTop";
import BlogsRelated from "../../components/Blogs/BlogsRelated";
import SellerCard from "../../components/Blogs/SellerCard";
import PopupProfile from "../../components/Page/catalog/PopupProfile";
import ShareItems from "../../components/Page/blog/ShareItems";
import SkeletonItem from "../../components/Common/SkeletonItem";
export default {
  name: "BlogPage",
  components: {
    SkeletonItem,
    SellerCard,
    BlogsRelated,
    PopupProfile,
    PatternTop,
    ShareItems,
  },
  data() {
    return {
      blog: {},
      loading: true,
    };
  },
  computed: {
    linkToRelated() {
      const id = this.blog && this.blog.author?.id;
      return `/profile?id=${id}`;
    },
  },
  watch: {
    "$route.query": {
      async handler(val) {
        window.scrollTo(0, 0);
        await this.getBlog();
      },
    },
  },

  async mounted() {
    await this.getBlog();
  },

  methods: {
    handleToBlogs() {
      this.$router.push("/blogs");
    },
    handleShowPopup() {
      this.$refs.modal.show();
    },
    async getBlog() {
      this.blog = {};
      this.loading = true;
      const slug = this.$route.query["slug"];

      if (!slug) {
        return this.$nuxt.error({ statusCode: 404, message: "err message" });
      }

      const { blog } = await this.$store.dispatch("blog/getBlog", { slug });
      this.blog = { ...blog };
      this.loading = false;
    },
  },
};
</script>
<style lang="scss">
.blog {
  &__container {
    &__body {
      display: flex;
      flex-direction: column;
      img {
        width: 53.75rem !important;
        height: 30.375rem !important;
        border-radius: 1.875rem;
        object-fit: cover;
        margin-top: 3rem;
        margin-bottom: 3rem;
        @include layout-mobile() {
          width: 100% !important;
          margin: mvw(0px) 0;
          border-radius: mvw(30px);
          height: mvw(210px) !important;
        }
      }
      a {
        color: $neutral-30;
        text-decoration: underline;
        &:hover {
          color: $primary-marigold;
        }
      }
      p {
        font-weight: 400;
        font-size: 1.25rem;
        line-height: 2rem;
        margin-top: 2rem;
        @include layout-mobile() {
          font-size: mvw(16px);
          margin-top: mvw(32px);
          line-height: mvw(32px);
        }
      }
      h5 {
        font-size: 1.75rem;
        font-weight: 400;
        line-height: 2.5rem;
        margin-top: 2rem;
        @include layout-mobile() {
          margin-top: mvw(32px);
        }
      }
      h2 {
        margin-top: 2rem;
        @include layout-mobile() {
          margin-top: mvw(32px);
        }
      }
      br {
        margin: 1rem 0;
        @include layout-mobile() {
          margin: mvw(16px) 0;
        }
      }
    }
  }
}
</style>
<style lang="scss" scoped>
.page {
  .blog__bottom {
    background-color: $primary-white;
    width: 100vw;
    box-sizing: border-box;
    margin-left: calc(0rem - $padding-with-width);
    padding: 8rem $padding-with-width 8rem;
    display: flex;
    flex-direction: column;
    position: relative;
    @include layout-mobile() {
      margin-left: -$padding-left-mobile;
      padding: mvw(64px) $padding-left-mobile mvw(40px) $padding-left-mobile;
    }
  }
  .blog__container {
    display: flex;
    flex-direction: column;
    width: 53.125rem;
    margin: 0 auto;

    @include layout-mobile() {
      width: 100%;
    }

    &__loading {
      margin-bottom: 4rem;
    }

    &__card {
      margin-top: 5rem;
    }
    &__line {
      height: 1px;
      width: 100%;
      background-color: $neutral-70;
      margin-top: 5rem;
      margin-bottom: 3rem;
      @include layout-mobile() {
        margin-top: mvw(64px);
        margin-bottom: mvw(24px);
        height: mvw(1px);
      }
    }
    &__share {
      margin-bottom: 9.375rem;
      @include layout-mobile() {
        margin-bottom: mvw(32px);
      }
    }
  }
  &__header {
    display: flex;
    margin-bottom: 3rem;
    align-items: center;
    margin-right: auto;
    cursor: pointer;
    &:hover {
      opacity: 0.8;
    }
    &__button {
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      width: 2rem;
      border: 1.5px solid $primary-marigold;
      border-radius: 50%;
      height: 2rem;
      img {
        width: 1rem;
        height: 1rem;
        transform: rotate(180deg);
        @include layout-mobile() {
          width: mvw(16px);
          height: mvw(16px);
        }
      }
      @include layout-mobile() {
        width: mvw(32px);
        height: mvw(32px);
      }
    }
    span {
      font-size: 1rem;
      line-height: 1.5rem;
      font-weight: 600;
      margin-left: 0.5rem;
      @include layout-mobile() {
        font-size: mvw(16px);
        line-height: mvw(24px);
        margin-left: mvw(8px);
      }
    }
    @include layout-mobile() {
      margin-bottom: mvw(38px);
    }
  }
  .header-container {
    background-color: $primary-white;
    width: 100vw;
    box-sizing: border-box;
    margin-left: calc(0rem - $padding-with-width);
    margin-bottom: 3.125rem;
    padding: 10.5625rem $padding-with-width 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
    @include layout-mobile() {
      margin-left: -$padding-left-mobile;
      padding: mvw(84px) $padding-left-mobile mvw(0px) $padding-left-mobile;
    }
    &__body {
      display: flex;
      @include layout-mobile() {
        flex-direction: column;
      }
      .body-1 {
        color: $primary-white;
        width: 39.375rem;
        @include layout-mobile() {
          width: auto;
        }
      }
    }
    &__sub {
      display: flex;
      align-items: center;
      @include layout-mobile() {
        flex-direction: column;
      }
    }
    &__bottom {
      display: none;
      @include layout-mobile() {
        position: absolute;
        display: block;
        background-size: cover;
        height: mvw(40px);
        bottom: mvw(-20px);
        width: 101%;
        transform: scale(1);
      }
    }
    &__line {
      height: 1.5rem;
      margin: 0 0.75rem;
      width: 1px;
      background-color: $primary-black;
      @include layout-mobile() {
        display: none;
      }
    }
    &__left {
      margin-bottom: 5rem;
      &--alone {
        margin-left: 13.75rem;
        @include layout-mobile() {
          margin-left: 0;
        }
      }
      @include layout-mobile() {
        margin-bottom: 2rem;
        text-align: center;
      }
    }
    h1 {
      color: $primary-black;
      margin-bottom: 2rem;
      margin-top: 1.5rem;
      width: 39.375rem;
      text-align: left;
      @include layout-mobile() {
        width: auto;
        text-align: center;
      }
    }
  }
}
.header-container {
  &__body {
    display: flex;
    width: 100%;
  }
  &__right {
    width: 44.625rem;
    height: 29.3125rem;
    object-fit: cover;
    margin-left: 8.625rem;
    margin-top: -5rem;
    @include layout-mobile() {
      margin-top: mvw(20px);
      width: 100vw;
      height: mvw(210px);
      margin-left: -$padding-left-mobile;
    }
  }
}
</style>

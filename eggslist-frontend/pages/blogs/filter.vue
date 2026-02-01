<template>
  <div class="page">
    <div class="header-container">
      <div class="page__header" @click="handleToBlogs">
        <div class="page__header__button">
          <img src="@/assets/images/icons/arrow-forward.svg" />
        </div>
        <span> All Stories</span>
      </div>
      <h5>{{ type[currentType]?.subtitle }}</h5>
      <h1 v-if="titleLoads">{{ type[currentType]?.title }}</h1>
      <SkeletonItem
        v-else
        :height="4"
        :height-mobile="130"
        :width="18.75"
        :width-mobile="130"
      />
    </div>
    <div class="page__container">
      <BlogsList
        :blogs="blogs"
        :loading="loadingBlogs"
        :is-complete="completeLoader"
        :is-edit="isUser"
        @delete="handleDelete"
        @loadMore="loadMoreBlogs"
      ></BlogsList>
    </div>
  </div>
</template>

<script>
import BlogsList from "../../components/Blogs/BlogsList";
import SearchCommon from "../../components/Common/SearchCommon";
import BlogCategory from "../../components/Blogs/BlogCategory";
import SkeletonItem from "../../components/Common/SkeletonItem";
export default {
  name: "FilterPage",
  components: {
    SkeletonItem,
    BlogsList,
  },
  data() {
    return {
      blogs: [],
      loadingBlogs: true,
      completeLoader: false,
      searchInput: "",
      currentType: null,
      titleLoads: false,
      page: 1,
      query: "",
      type: {
        author: {
          subtitle: "Written by",
        },
        category: {
          subtitle: "Category",
        },
      },
    };
  },
  computed: {
    isUser() {
      const id = this.$route.query["user-id"];
      if (!id || !this.user) return false;

      return this.user.id === Number(id);
    },
    user() {
      return this.$store.getters["user/user"];
    },
  },
  watch: {
    "$route.query": {
      async handler(val) {
        window.scrollTo(0, 0);
        this.loadingBlogs = true;
        this.currentType = null;
        this.page = 1;
        this.blogs = [];
        this.titleLoads = false;
        this.initBlogs();
      },
    },
  },
  mounted() {
    this.initBlogs();
  },

  methods: {
    handleDelete() {
      window.scrollTo(0, 0);
      this.loadingBlogs = true;
      this.currentType = null;
      this.page = 1;
      this.blogs = [];
      this.titleLoads = false;
      this.initBlogs();
    },
    async initBlogs() {
      if (this.$route.query["user-id"]) {
        this.currentType = "author";
        this.query = this.$route.query["user-id"];
      }
      if (this.$route.query["category"]) {
        this.currentType = "category";
        this.query = this.$route.query["category"];
      }
      if (!this.currentType) {
        throw new Error();
      }

      const { blogs } = await this.$store.dispatch("blog/getBlogs", {
        page: this.page,
        [this.currentType]: this.query,
      });

      if (blogs.length === 0)
        return this.$nuxt.error({ statusCode: 404, message: "err message" });

      this.blogs.push(...blogs);
      if (this.currentType === "category") {
        this.type[this.currentType].title = blogs[0].category.name;
      } else {
        this.type[
          this.currentType
        ].title = `${blogs[0].author.firstName} ${blogs[0].author.lastName}`;
      }
      this.titleLoads = true;
      this.loadingBlogs = false;
    },
    handleToBlogs() {
      this.$router.push("/blogs");
    },
    loadMoreBlogs() {
      this.page += 1;
      this.$store
        .dispatch("blog/getBlogs", {
          page: this.page,
          [this.currentType]: this.query,
        })
        .then(({ blogs }) => {
          if (blogs?.length === 0) {
            this.completeLoader = true;
            return;
          }
          this.blogs.push(...blogs);
        })
        .catch((e) => {
          console.log(e);
        });
    },
    handleEnter() {},
  },
};
</script>

<style lang="scss" scoped>
.page {
  padding-bottom: 7.5rem;
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
  &__container {
    display: flex;
    flex-direction: column;
    &__header {
      margin-bottom: 4.5rem;
      display: flex;
    }
    &__search {
      width: 19.125rem;
      margin-left: auto;
    }
  }
  .header-container {
    width: 100vw;
    box-sizing: border-box;
    margin-left: calc(0rem - $padding-with-width);
    padding: 10.5625rem $padding-with-width 8.5rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
    @include layout-mobile() {
      margin-left: -$padding-left-mobile;
      padding: mvw(84px) $padding-left-mobile mvw(40px) $padding-left-mobile;
    }
    &__body {
      display: flex;
      .body-1 {
        color: $primary-white;
        width: 39.375rem;
      }
    }
    h5 {
      font-weight: 500;
    }
    &__bottom {
      position: absolute;
      bottom: 0;
      width: 100%;
      height: 1.5rem;
      background-size: cover;
      @include layout-mobile() {
        height: mvw(40px);
        bottom: mvw(-20px);
        width: 101%;
        transform: scale(1);
      }
    }
  }
}
</style>

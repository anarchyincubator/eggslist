<template>
  <div class="page">
    <div class="header-container">
      <div class="header-container__body">
        <h1>Our Stories</h1>
        <div class="body-1">
          Dive into the world of Brand. Explore insights. And stay up to date
          with product and company news.
        </div>
      </div>
      <PatternTop class="header-container__bottom" />
    </div>
    <div class="page__container">
      <div class="page__container__header">
        <div v-if="!isMobile" class="page__container__filters">
          <BlogCategory
            key-tab="all"
            class="page__container__filters__item"
            title="All"
            :is-active="currentCategory && !currentCategory.key"
            @click="handleChangeCategory(defaultAll)"
          ></BlogCategory>
          <BlogCategory
            v-for="(tab, index) in categories"
            :key="index"
            class="page__container__filters__item"
            :key-tab="tab.slug"
            :title="tab.name"
            :is-active="currentCategory.key === tab.slug"
            @click="handleChangeCategory(tab)"
          />
        </div>
        <CustomDropdown
          v-else
          v-model="currentCategory"
          class="page__container__category"
          :selects="categoriesMobile"
          @input="handleChangeCategoryMobile"
        ></CustomDropdown>
        <SearchCommon
          v-model="searchInput"
          class="page__container__search"
          placeholder="Search"
          @input="loadDebounceQueryBlogs"
          @enter="loadQueryBlogs"
        ></SearchCommon>
      </div>
      <div
        v-if="blogs.length === 0 && !loadingBlogs"
        class="page__container__not"
      >
        <h3>No Results</h3>
        <p class="body-1">
          No one has posted any blogs that match your selection yet. To get more
          results, try changing or removing some filters!
        </p>
        <CustomButton
          class="page__container__not-button"
          theme="primary"
          @click="handleReset"
        >
          Reset Filters</CustomButton
        >
      </div>
      <BlogsList
        :blogs="blogs"
        :loading="loadingBlogs"
        :is-complete="completeLoader"
        @loadMore="loadMoreBlogs"
      ></BlogsList>
    </div>
  </div>
</template>

<script>
import CustomDropdown from "../../components/Common/CustomDropdown";
import CustomButton from "../../components/Common/CustomButton";
import { debounce } from "lodash";
import searchIcon from "../../assets/images/icons/search.svg";
import PatternTop from "../../components/Page/index/PatternTop";
import BlogsList from "../../components/Blogs/BlogsList";
import SearchCommon from "../../components/Common/SearchCommon";
import BlogCategory from "../../components/Blogs/BlogCategory";
export default {
  name: "BlogsPage",
  components: {
    BlogCategory,
    SearchCommon,
    CustomButton,
    BlogsList,
    PatternTop,
    CustomDropdown,
  },
  data() {
    return {
      blogs: [],
      defaultAll: { key: null, value: "All" },
      loadingBlogs: true,
      completeLoader: false,
      currentCategory: { key: null, value: "All" },
      searchInput: "",
      page: 1,
      categories: [],
      categoriesMobile: [{ value: "All", key: null }],
      searchIcon,
    };
  },
  computed: {
    isMobile() {
      return this.$store.getters["isMobile"];
    },
  },
  async mounted() {
    const { blogs } = await this.$store.dispatch("blog/getBlogs", {
      page: this.page,
    });
    this.blogs.push(...blogs);
    const { categories } = await this.$store.dispatch(
      "blog/getCategoriesBlogs"
    );
    this.categories.push(...categories.slice(0, 5));
    this.categoriesMobile.push(
      ...categories.map((item) => {
        return { value: item.name, key: item.slug };
      })
    );
    this.loadingBlogs = false;
  },
  methods: {
    handleReset() {
      this.currentCategory = { ...this.defaultAll };
      this.searchInput = "";
      this.loadQueryBlogs();
    },
    handleChangeCategoryMobile(val) {
      this.currentCategory = { ...val };
      this.loadQueryBlogs();
    },
    handleChangeCategory(category) {
      if (category.slug === this.currentCategory.key) return;

      this.currentCategory = { key: category.slug, value: category.name };
      this.loadQueryBlogs();
    },
    loadQueryBlogs() {
      this.loadingBlogs = true;
      this.page = 1;
      this.$store
        .dispatch("blog/getBlogs", {
          page: this.page,
          search: this.searchInput.trim().toLowerCase(),
          category: this.currentCategory && this.currentCategory.key,
        })
        .then(({ blogs }) => {
          this.blogs = [...blogs];
          this.loadingBlogs = false;
          this.completeLoader = false;
        })
        .catch((e) => {
          console.log(e);
        });
    },
    loadDebounceQueryBlogs: debounce(function (val) {
      this.loadQueryBlogs();
    }, 500),
    loadMoreBlogs() {
      this.page += 1;
      this.$store
        .dispatch("blog/getBlogs", {
          page: this.page,
          search: this.searchInput.trim().toLowerCase(),
          category: this.currentCategory && this.currentCategory.key,
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

  &__container {
    display: flex;
    flex-direction: column;
    &__header {
      margin-bottom: 4.5rem;
      display: flex;
      @include layout-mobile() {
        margin-bottom: mvw(64px);
        flex-direction: column;
      }
    }
    &__search {
      width: 19.125rem;
      margin-left: auto;
      @include layout-mobile() {
        width: 100%;
      }
    }
    &__category {
      margin-bottom: mvw(20px);
    }
    &__filters {
      display: flex;
      &__item {
        margin-right: 2rem;
      }
      @include layout-mobile() {
        display: none;
      }
    }
    &__not {
      margin-top: 7.5rem;
      display: flex;
      width: 32.125rem;
      align-items: center;
      text-align: center;
      flex-direction: column;
      align-self: center;
      @include layout-mobile() {
        width: 100%;
        margin-top: mvw(50px);
      }
      p {
        margin-top: 1rem;
        margin-bottom: 2rem;
        @include layout-mobile() {
          margin-top: mvw(16px);
          margin-bottom: mvw(32px);
        }
      }
      &-button {
        font-weight: 600;
        width: 10rem;
        height: 3.5rem;
        padding: 0;
        @include layout-mobile() {
          height: mvw(56px);
          width: mvw(270px);
          margin-bottom: mvw(32px);
        }
      }
    }
  }
  .header-container {
    background-color: $primary-black;
    width: 100vw;
    box-sizing: border-box;
    margin-left: calc(0rem - $padding-with-width);
    margin-bottom: 3.125rem;
    padding: 10.5625rem $padding-with-width 8rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
    @include layout-mobile() {
      margin-left: -$padding-left-mobile;
      padding: mvw(64px) $padding-left-mobile mvw(40px) $padding-left-mobile;
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
    h1 {
      color: $primary-marigold;
      margin-bottom: 2rem;
      width: 39.375rem;
      @include layout-mobile() {
        width: auto;
        margin-top: mvw(64px);
        margin-bottom: mvw(16px);
      }
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

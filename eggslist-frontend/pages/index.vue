<template>
  <div class="page">
    <div class="header-container">
      <h1>Find Farmers Near You</h1>
      <SearchCity
        :cities="cities"
        class="header-container__search"
        @save="refreshData"
      />
      <PatternTop class="header-container__bottom" />
    </div>
    <CategoriesList
      :loading="loadingCategories"
      :categories="categories"
    ></CategoriesList>
    <PopularList
      :loading="loadingProducts"
      class="page__popular"
      :products="products"
    ></PopularList>
    <StoriesList
      :loading="loadingBlogs"
      class="page__stories"
      :stories="blogs"
    ></StoriesList>
    <TheFooter
      :is-additive="true"
      :is-non-auth="!isAuthenticated"
      :quotes="quotes"
      class="page__footer"
    />
  </div>
</template>

<script>
import TheFooter from "../components/Page/TheFooter";
import SearchCity from "../components/Page/index/SearchCity";
import CategoriesList from "../components/Page/index/CategoriesList";
import PopularList from "../components/Page/index/PopularList";
import StoriesList from "../components/Page/index/StoriesList";
import PatternTop from "../components/Page/index/PatternTop";
export default {
  components: {
    PatternTop,
    StoriesList,
    PopularList,
    CategoriesList,
    SearchCity,
    TheFooter,
  },
  data() {
    return {
      blogs: [],
      products: [],
      quotes: [],
      loadingProducts: true,
      loadingBlogs: true,
      loadingCategories: true,
    };
  },
  computed: {
    categories() {
      return this.$store.getters["categories/categories"];
    },
    cities() {
      return this.$store.getters["cities"];
    },
    isAuthenticated() {
      return this.$store.getters["auth/isAuthenticated"];
    },
  },
  created() {
    if (this.$route.query.login) {
      this.$store.commit("setAuthComponent", true);
    }
  },

  async mounted() {
    this.$store.dispatch("categories/getCategories").then(({}) => {
      this.loadingCategories = false;
    });

    this.$store.dispatch("products/getProductsPopular").then(({ products }) => {
      this.products.push(...products);
      this.loadingProducts = false;
    });

    this.$store.dispatch("quotes/getQuotes").then(({ quotes }) => {
      this.quotes.push(...quotes);
    });
    this.$store.dispatch("blog/getFeaturedBlogs").then(({ blogs }) => {
      this.blogs.push(...blogs);
      this.loadingBlogs = false;
    });
  },
  methods: {
    async refreshData() {
      this.loadingProducts = true;
      const { products } = await this.$store.dispatch(
        "products/getProductsPopular"
      );
      this.products = [...products];
      this.loadingProducts = false;
    },
  },
};
</script>
<style lang="scss" scoped>
.page {
  width: 100%;
  .header-container {
    background-image: url("@/assets/images/homepage.jpg");
    background-size: cover;
    padding-top: 9.375rem;
    padding-bottom: 5rem;
    width: 100vw;
    margin-left: calc(0rem - $padding-with-width);
    margin-bottom: 3.125rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
    h1 {
      color: $primary-marigold;
      margin-bottom: 2rem;
      @include layout-mobile() {
        margin-top: mvw(64px);
        margin-bottom: mvw(16px);
        text-align: center;
      }
    }
    &__search {
      width: 51.375rem;
      margin-bottom: 4.6875rem;
      @include layout-mobile() {
        width: 100%;
      }
    }
    &__bottom {
      position: absolute;
      bottom: 0;
      width: 100%;
      height: 1.5rem;
      background-size: cover;
      @include layout-mobile() {
        height: mvw(60px);
        bottom: mvw(-42px);
        width: 101%;
        transform: scale(1);
      }
    }
    @include layout-mobile() {
      padding: mvw(70px) $padding-left-mobile 0 $padding-left-mobile;
      margin-left: -$padding-left-mobile;
      background-image: url("@/assets/images/homepage_mob.jpg");
      width: 100%;
    }
  }
  &__popular {
    margin: 8rem 0;
    @include layout-mobile() {
      margin: mvw(64px) 0;
    }
  }
  &__stories {
    margin-bottom: 8rem;
  }
}
</style>

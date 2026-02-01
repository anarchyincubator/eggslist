<template>
  <div class="filter-container">
    <div class="filter-container__input">
      <img
        class="filter-container__input--icon"
        src="@/assets/images/icons/search.svg"
        alt="search"
      />
      <CustomInput
        v-model="searchInput"
        :padding-default="false"
        :is-small="true"
        placeholder="Search"
        class="filter-container__search"
        @enter="handleApplyFilter"
        @focusout="handleApplyFilter"
      />
    </div>
    <div class="filter-container__filter" @click="handleOpenCatalog">
      <img
        class="filter-container__filter--icon"
        src="@/assets/images/icons/filter.svg"
      />
      <span> Filters </span>
    </div>
    <div
      v-if="isOpened"
      v-scroll-lock="isOpened"
      class="filter-container__absolute"
    >
      <div class="filter-container__content">
        <h2>
          Filters
          <img
            src="@/assets/images/icons/close_dark.svg"
            @click="handleClose"
          />
        </h2>
        <div
          class="filter-container__location button-1"
          @click="handleClickLocation"
        >
          {{ currentCity.city }}, {{ currentCity.radius }} mi
        </div>
        <div class="filter-container__line" />
        <PickupOptions
          v-model="pickupSelects"
          :pickup="pickup"
          :open-start="Boolean(query.allow_pickup || query.allow_delivery)"
          class="filter-container__category filter-container__pickup"
        ></PickupOptions>
        <div class="filter-container__button-container">
          <CustomButton
            theme="primary"
            class="filter-container__button button-2"
            @click="handleApplyFilter"
          >
            Apply filters</CustomButton
          >
        </div>
        <h6>Category</h6>
        <TheCategory
          v-for="(category, index) in categories"
          :key="index"
          v-model="selects[index]"
          :category="category"
          :open-start="Boolean(query.subcategory)"
          class="filter-container__category"
          @input="handleChangeSelect($event, index)"
        ></TheCategory>
        <h6>Price</h6>
        <div class="filter-container__price">
          <CustomInput
            v-model="priceMin"
            placeholder="$ Min"
            type="number"
          ></CustomInput>
          <p>to</p>
          <CustomInput
            v-model="priceMax"
            placeholder="$ Max"
            type="number"
          ></CustomInput>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import CustomInput from "../../Common/CustomInput";
import TheCategory from "./TheCategory";
import PickupOptions from "./PickupOptions";
import CustomButton from "../../Common/CustomButton";
export default {
  name: "FiltersCatalogMobile",
  components: {
    CustomButton,
    PickupOptions,
    TheCategory,
    CustomInput,
  },
  props: {
    categories: {
      type: Array,
      required: true,
    },
    query: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  data() {
    return {
      selects: [],
      city: "",
      radius: "",
      searchInput: "",
      resultCity: [],
      pickupSelects: [],
      isOpened: false,
      priceMin: null,
      priceMax: null,
      pickup: {
        name: "Pickup Options",
        options: ["Allow pickup", "Allow delivery"],
      },
    };
  },
  computed: {
    currentCity() {
      return this.$store.getters["currentCity"];
    },
    cities() {
      return this.$store.getters["cities"];
    },
    selectedSlugs() {
      const obj = {};
      this.categories.forEach((item, index) => {
        if (this.selects[index].length === 0) return;

        obj[item.name] = item.subs
          .filter((it, ind) => this.selects[index][ind])
          .map(({ slug }) => {
            return slug;
          });
      });
      return obj;
    },
  },
  watch: {
    categories: {
      handler(val) {
        this.selects = val.map((item) => []);
      },
      deep: true,
    },
    query: {
      handler(val) {
        this.getFromQuery();
      },
      deep: true,
    },
  },
  mounted() {
    this.getCity();
  },
  created() {
    this.selects = this.categories.map((item) => []);
  },
  methods: {
    async getCity() {
      this.city = await this.$store.dispatch("getLocate");
    },
    handleOpenCatalog() {
      this.isOpened = true;
    },
    handleChangeSelect(val, index) {
      this.selects = this.categories.map((item) => []);
      this.selects[index] = val;
      // this.handleApplyFilter();
    },
    handleClickLocation() {
      this.$emit("showModal");
    },
    getFromQuery() {
      if (this.query.subcategory) {
        this.categories.forEach((item, ind) => {
          item.subs.forEach(({ slug }, index) => {
            if (
              Array.isArray(this.query.subcategory) &&
              this.query.subcategory.find((sl) => sl === slug)
            ) {
              this.$set(this.selects[ind], index, true);
            }

            if (
              !Array.isArray(this.query.subcategory) &&
              this.query.subcategory === slug
            ) {
              this.$set(this.selects[ind], index, true);
            }
          });
        });
      } else {
        this.selects = this.categories.map((item) => []);
      }
      if (this.query.search) {
        this.searchInput = this.query.search;
      } else {
        this.searchInput = "";
      }
      if (this.query.price_from) {
        this.priceMin = Number(this.query.price_from);
      } else {
        this.priceMin = null;
      }
      if (this.query.price_to) {
        this.priceMax = Number(this.query.price_to);
      } else {
        this.priceMax = null;
      }
      if (this.query.allow_pickup) {
        this.$set(this.pickupSelects, 0, true);
      } else {
        this.$set(this.pickupSelects, 0, false);
      }
      if (this.query.allow_delivery) {
        this.$set(this.pickupSelects, 1, true);
      } else {
        this.$set(this.pickupSelects, 1, false);
      }
      this.$emit("changeQuery", this.generateQuery());
    },
    generateQuery() {
      let query = "";
      Object.values(this.selectedSlugs).forEach((item, index) => {
        item.forEach((key, index) => {
          query +=
            `subcategory=${key}` + (index !== item.length - 1 ? "&" : "");
        });
      });

      if (this.searchInput) {
        query += `&search=${this.searchInput}`;
      }

      if (this.priceMin) {
        query += `&price_from=${this.priceMin}`;
      }
      if (this.priceMax) {
        query += `&price_to=${this.priceMax}`;
      }
      if (this.pickupSelects.length >= 1 && this.pickupSelects[0]) {
        query += "&allow_pickup=true";
      }
      if (this.pickupSelects.length >= 2 && this.pickupSelects[1]) {
        query += "&allow_delivery=true";
      }
      return query;
    },
    handleAppleCity() {
      this.$emit("changeCity", this.generateQuery());
    },
    handleApplyFilter() {
      this.$emit("apply", this.generateQuery());
      this.isOpened = false;
    },
    handleClose() {
      this.isOpened = false;
      this.getFromQuery();
    },
    async handleEmitCity(val) {
      try {
        await this.$store.dispatch("saveCity", val);
        this.handleAppleCity();
      } catch (e) {}
    },
    handleChangeCity(val) {
      this.resultCity = this.cities
        .filter(({ name }) => {
          return name.includes(val);
        })
        .map((obj) => {
          return { name: `${obj.name}, ${obj.state}`, slug: obj.slug };
        });
    },
    resetFilters() {
      this.selects = this.categories.map((item) => []);
      this.searchInput = "";
      this.resultCity = [];
      this.pickupSelects = [];
      this.priceMin = null;
      this.priceMax = null;
      this.$emit("reset");
    },
  },
};
</script>

<style lang="scss" scoped>
.filter-container {
  width: vw(300px);
  flex-shrink: 0;
  @include layout-mobile() {
    width: 100%;
  }
  &__absolute {
    position: fixed;
    z-index: 50;
    overflow-y: scroll;
    height: 100%;
    top: 0;
    background: $primary-white;
    margin-left: -$padding-left-mobile;
    padding: 0 $padding-left-mobile 0 $padding-left-mobile;
    width: calc(100% - #{$padding-left-mobile} * 2);
  }
  &__content {
    width: 100%;
    padding-top: mvw(32px);
    h2 {
      display: flex;
      justify-content: space-between;
      img {
        width: mvw(15px);
      }
    }
  }
  &__header {
    display: flex;
    align-items: center;
    margin-bottom: vw(32px);
    &--button {
      height: vw(40px);
      font-size: vw(12px);
      font-weight: 600;
      padding: 0 vw(12px);
      margin-left: auto;
    }
  }
  &__reset {
    font-size: vw(16px);
    line-height: vw(24px);
    text-decoration-line: underline;
    align-self: center;
    cursor: pointer;
  }
  &__search {
    position: relative;
  }
  &__input {
    position: relative;
    &--icon {
      position: absolute;
      z-index: 5;
      top: 50%;
      transform: translateY(-50%);
      @include layout-mobile() {
        width: mvw(18px);
        left: mvw(18px);
      }
    }
  }
  &__filter {
    position: relative;
    width: 100%;
    background: $primary-white;
    height: mvw(50px);
    box-sizing: border-box;
    display: flex;
    align-items: center;
    border: 1px solid $neutral-70;
    border-radius: mvw(12px);
    span {
      margin-left: mvw(47px);
      font-weight: 600;
      font-size: mvw(16px);
      line-height: mvw(24px);
    }
    &--icon {
      position: absolute;
      left: vw(14px);
      width: vw(12px);
      z-index: 5;
      top: 50%;
      transform: translateY(-50%);
      @include layout-mobile() {
        width: mvw(18px);
        left: mvw(18px);
      }
    }
  }
  h6 {
    margin-top: vw(48px);
    font-size: vw(12px);
    line-height: vw(16px);
    letter-spacing: vw(1.2px);
    text-transform: uppercase;

    @include layout-mobile() {
      margin-top: mvw(32px);
      font-size: mvw(12px);
      line-height: mvw(16px);
      letter-spacing: mvw(1.2px);
    }
  }
  &__location {
    margin-bottom: 1.625rem;
    margin-top: 3rem;
    border-bottom: 2px solid $primary-marigold;
    width: fit-content;
    cursor: pointer;
  }
  &__category {
    margin-top: vw(20px);

    @include layout-mobile() {
      margin-top: mvw(16px);
    }
  }
  &__price {
    display: flex;
    align-items: center;
    margin-top: vw(16px);
    margin-bottom: mvw(140px);
    @include layout-mobile() {
      margin-top: mvw(16px);
    }
    p {
      font-size: vw(16px);
      line-height: vw(24px);
      margin: 0 vw(16px);

      @include layout-mobile() {
        font-size: mvw(16px);
        line-height: mvw(24px);
        margin: 0 mvw(16px);
      }
    }
  }
  &__search {
    margin-top: mvw(16px);
    margin-bottom: mvw(24px);
    position: relative;
  }
  &__line {
    height: 1px;
    width: 100%;
    background-color: $neutral-70;
  }
  &__pickup {
  }
  &__button-container {
    background-color: $primary-cream;
    margin-left: -$padding-left-mobile;
    width: 100%;
    width: calc(100% - #{$padding-left-mobile} * 2);
    padding: mvw(24px) mvw(15px) mvw(32px) mvw(25px);
    position: fixed;
    z-index: 100;
    bottom: 0;
  }
}
.icon {
  position: absolute;
  left: vw(13px);
  width: vw(12px);
  z-index: 5;
  top: 50%;
  transform: translateY(-50%);
  @include layout-mobile() {
    width: mvw(18px);
    left: mvw(18px);
  }
}
</style>

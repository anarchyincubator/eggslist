<template>
  <div class="filter-container">
    <div class="filter-container__header">
      <div class="filter-container__reset" @click="resetFilters">
        Reset Filters
      </div>
    </div>
    <div class="filter-container__input">
      <img
        class="filter-container__input--icon"
        src="@/assets/images/icons/search.svg"
        alt="search"
      />
      <CustomInput
        v-model="searchInput"
        :padding-default="false"
        placeholder="Search"
        class="filter-container__search"
        @enter="handleApplyFilter"
        @focusout="handleApplyFilter"
      />
    </div>
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
      class="filter-container__category"
      @input="handleApplyFilter"
    ></PickupOptions>
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
        @enter="handleApplyFilter"
        @focusout="handleApplyFilter"
      ></CustomInput>
      <p>to</p>
      <CustomInput
        v-model="priceMax"
        placeholder="$ Max"
        type="number"
        @enter="handleApplyFilter"
        @focusout="handleApplyFilter"
      ></CustomInput>
    </div>
  </div>
</template>

<script>
import CustomInput from "../../Common/CustomInput";
import TheCategory from "./TheCategory";
import PickupOptions from "./PickupOptions";
export default {
  name: "FiltersCatalog",
  components: {
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
    handleChangeSelect(val, index) {
      this.selects = this.categories.map((item) => []);
      this.selects[index] = val;
      this.handleApplyFilter();
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
      }
      if (this.query.search) {
        this.searchInput = this.query.search;
      }
      if (this.query.price_from) {
        this.priceMin = Number(this.query.price_from);
      }
      if (this.query.price_to) {
        this.priceMax = Number(this.query.price_to);
      }
      if (this.query.allow_pickup) {
        this.$set(this.pickupSelects, 0, true);
      }
      if (this.query.allow_delivery) {
        this.$set(this.pickupSelects, 1, true);
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
  width: 18.75rem;
  flex-shrink: 0;
  &__header {
    display: flex;
    align-items: center;
    margin-bottom: 2rem;
    &--button {
      height: 2.5rem;
      font-size: 0.75rem;
      font-weight: 600;
      padding: 0 0.75rem;
      margin-left: auto;
    }
  }
  &__reset {
    font-size: 1rem;
    line-height: 1.5rem;
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
      left: 0.875rem;
      width: 0.75rem;
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
    margin-top: 3rem;
    font-size: 0.75rem;
    line-height: 1rem;
    letter-spacing: 0.075rem;
    text-transform: uppercase;
  }
  &__category {
    margin-top: 1.25rem;
  }
  &__location {
    margin-bottom: 1.625rem;
    margin-top: 3rem;
    border-bottom: 2px solid $primary-marigold;
    width: fit-content;
    cursor: pointer;
  }
  &__price {
    display: flex;
    align-items: center;
    margin-top: 1rem;
    p {
      font-size: 1rem;
      line-height: 1.5rem;
      margin: 0 1rem;
    }
  }
  &__search {
    margin-top: 1rem;
    margin-bottom: 1.5rem;
    position: relative;
  }
  &__line {
    height: 1px;
    width: 100%;
    background-color: $neutral-70;
  }
}
.icon {
  position: absolute;
  left: 0.8125rem;
  width: 0.75rem;
  z-index: 5;
  top: 50%;
  transform: translateY(-50%);
  @include layout-mobile() {
    width: mvw(18px);
    left: mvw(18px);
  }
}
</style>
